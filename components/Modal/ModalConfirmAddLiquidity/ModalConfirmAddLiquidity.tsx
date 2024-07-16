import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NoteIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import handleBignumber from "@/libs/utils/handleBignumber";
import Tippy from "@tippyjs/react";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import Wrapper from "../Wrapper";
interface ModalConfirmAddLiquidityProps {
  isOpenConfirmAddLiquidity: boolean;
  tokenAddress: string;
  data: DataBase;
  inputNFT: string;
  inputToken: string;
  nftAddress: string;
  idNFT: string;
  isOpenTransaction: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenConfirmAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setInputNFT: React.Dispatch<React.SetStateAction<string>>;
  setInputToken: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenLiquidity?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmAddLiquidity: React.FunctionComponent<
  ModalConfirmAddLiquidityProps
> = ({
  isOpenConfirmAddLiquidity,
  tokenAddress,
  data,
  inputToken,
  inputNFT,
  nftAddress,
  idNFT,
  isOpenTransaction,
  setIsOpenTransaction,
  setIsOpenConfirmAddLiquidity,
  setInputNFT,
  setInputToken,
  setIsOpenLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const {
    demask,
    account,
    wallet,
    slippage,
    txDeadline,
    bigNumberBalance,
    updateBalance,
  } = useContext(AccountContext);
  const {
    ROUTER: routerAddress,
    NATIVE_ADDRESS: nativeAddress,
    FACTORY: factoryAddress,
  } = demask;
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const dmlToken = useDMLToken(
    account,
    nftAddress,
    tokenAddress,
    wallet,
    factoryAddress,
    idNFT,
    isOpenTransaction,
    isOpenConfirmAddLiquidity
  );

  useEffect(() => {
    const load = setInterval(() => {
      if (isOpenConfirmAddLiquidity) {
        setUpdatePrice(!updatePrice);
      }
    }, 20000);
    return () => {
      clearInterval(load);
    };
  }, [isOpenConfirmAddLiquidity]);
  const { reserveNFT, reserveToken, isLoadingInforDML } = useInformationDML(
    dmlToken,
    wallet,
    account,
    isOpenTransaction,
    false,
    false,
    isOpenConfirmAddLiquidity,
    true,
    updatePrice
  );

  useEffect(() => {
    let amountErcDesired;
    if (dmlToken !== "0x0000000000000000000000000000000000000000" && inputNFT) {
      amountErcDesired =
        ((Number(inputNFT) * +reserveToken) / +reserveNFT) *
        (1 + slippage / 100);
    } else {
      amountErcDesired = handleBignumber(
        Number(inputToken),
        Number(data?.tokenDecimals)
      );
    }
    setAmountErcDesired(amountErcDesired);

    if (amountErcDesired) {
      const amountErcDesiredToDec = divideByDecimal(
        amountErcDesired?.toString(),
        data?.tokenDecimals
      );
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true);
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [inputNFT, inputToken, reserveToken, reserveNFT, dmlToken]);
  const addLiquidity = async () => {
    if (!account) {
      return;
    }

    if (!isSufficientToken && Math.floor(amountErcDesired) !== 0) {
      try {
        setIsOpenTransaction(true);
        const valueToSend =
          tokenAddress === nativeAddress
            ? exponentialToDecimal(Math.floor(amountErcDesired))
            : 0;
        const result = await erc1155Contract.addERC20ERC1155(
          wallet,
          nftAddress,
          tokenAddress,
          idNFT,
          routerAddress,
          amountErcDesired,
          inputNFT,
          account,
          txDeadline,
          valueToSend
        );
        const check = await result.wait();
        setHash(result.hash);
        setIsOpenTransaction(false);
        setInputNFT("");
        setInputToken("");
        setAmountErcDesiredToDec("");
        setIsOpenConfirmAddLiquidity(false);
        await updateBalance();
        if (setIsOpenLiquidity) {
          setIsOpenLiquidity(false);
        }
        if (check.status === 1) {
          setIsOpenSuccess(true);
        } else {
          setIsOpenError(true);
        }
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenConfirmAddLiquidity(false);
  };

  return (
    <Wrapper isOpen={isOpenConfirmAddLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative">
          <div className="px-4 pt-4">
            <div className="flex justify-between text-primary_200 border-shader_500">
              <p className="title_modal">Create Pool</p>
              <div onClick={handleClose}>
                <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
              </div>
            </div>
          </div>
          <div className="p-4 text-sm text-shader_200">
            <div className="flex items-center pb-4 border-b gap-x-3 border-shader_500">
              <div className="w-[65px] h-[65px] rounded-lg overflow-hidden">
                <MediaNFT data={data} isControls />
              </div>
              <div>
                <p className="text-base title">{data?.metadata?.name}</p>
                <div className="flex items-center gap-x-1">
                  <a
                    href={`${demask.urltxHash}address/${nftAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${nftAddress.slice(0, 8)}...${nftAddress.slice(-8)}`}
                  </a>
                  <Copy content={nftAddress} />
                </div>
              </div>
            </div>
            <div className="flex flex-col py-4 gap-y-2">
              <div className="flex justify-between ">
                <p>NFT quantity</p>
                <div className="flex items-center font-bold text-white gap-x-1">
                  {inputNFT}
                  <p>
                    <EtherIcon width={14} height={14} />
                  </p>
                </div>
              </div>
              <div className="flex justify-between ">
                <p>Liquidity</p>
                <div className="flex gap-x-1">
                  <div className="flex items-center font-bold text-white gap-x-1">
                    <FormatNumber number={amountErcDesiredToDec} />
                    <EtherIcon width={14} height={14} />
                  </div>
                </div>
              </div>
              <div className="flex justify-between ">
                <div className="flex items-center gap-x-1">
                  <span>Slippage tolerance</span>
                  <Tippy
                    interactive
                    content={
                      <div className="flex">
                        Output is estimated. You will receive at least{" "}
                        {inputNFT} NFT or the transaction will revert
                      </div>
                    }
                  >
                    <div>
                      <NoteIcon width={14} height={14} />
                    </div>
                  </Tippy>
                </div>
                <div className="flex items-center font-bold text-primary_300 gap-x-1">
                  {slippage}%
                </div>
              </div>
              {isSufficientToken && reserveToken && (
                <p className="text-xs text-red" key="Tokenbalance">
                  Insufficient Token balance
                </p>
              )}
              <div className="flex justify-between p-3 rounded-lg bg-primary_500 bg-opacity-10 mt-2 font-semibold">
                <p className="text-primary_200">Total ETH</p>
                <div className="flex items-center font-bold text-white gap-x-1">
                  <FormatNumber number={amountErcDesiredToDec} />
                  <EtherIcon width={14} height={14} />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Button
                disabled={isLoadingInforDML}
                primary={!isLoadingInforDML}
                className="px-8 py-3"
                active={isLoadingInforDML}
                isLoadingBtn={isLoadingInforDML}
                onClick={addLiquidity}
              >
                Create Pool
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </Wrapper>
  );
};

export default memo(ModalConfirmAddLiquidity);
