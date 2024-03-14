import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import erc721Contract from "@/libs/utils/erc/erc721.contract";
import handleBignumber from "@/libs/utils/handleBignumber";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalDocument from "../ModalLength/ModalDocument";
import { ModalError, ModalSuccess, ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
interface ModalConfirmAddLiquidityERC721Props {
  isOpenConfirmAddLiquidity: boolean;
  tokenAddress: string;
  data: DataBase;
  inputToken: string;
  nftAddress: string;
  idNFT: string;
  isOpenTransaction: boolean;
  inputNFT: string[];
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenConfirmAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setInputToken: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenLiquidity?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmAddLiquidityERC721: React.FunctionComponent<
  ModalConfirmAddLiquidityERC721Props
> = ({
  isOpenConfirmAddLiquidity,
  tokenAddress,
  data,
  inputToken,
  isOpenTransaction,
  inputNFT,
  setIsOpenTransaction,
  setIsOpenConfirmAddLiquidity,
  setInputToken,
  setIsOpenLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { demask, tokenDefault, account, wallet, slippage, txDeadline } =
    useContext(AccountContext);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
    FACTORY: factoryAddress,
  } = demask;
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [preFectch, setPreFetch] = useState<boolean>(false);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const [isOpenSuccessAdd, setIsOpenSuccessAdd] = useState<boolean>(true);
  const [isOpenErrorAdd, setIsOpenErrorAdd] = useState<boolean>(false);
  const collectionAddress = "0x58d8D129a641A60976d5a4d81Fa3C8F1F3f44DEd";

  const { bigNumberBalance } = useInformationToken(
    account,
    tokenAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );
  const dmlToken = useDMLToken(
    account,
    collectionAddress,
    nativeAddress,
    wallet,
    demask.FACTORY_721,
    "",
    isOpenTransaction,
    isOpenConfirmAddLiquidity
  );
  console.log(dmlToken);

  useEffect(() => {
    const load = setInterval(() => {
      if (isOpenConfirmAddLiquidity) {
        setPreFetch(true);
      } else {
        setPreFetch(false);
      }
    }, 20000);
    return () => {
      clearInterval(load);
    };
  }, [isOpenConfirmAddLiquidity, preFectch]);
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
  console.log(inputNFT);

  useEffect(() => {
    let amountErcDesired;
    if (
      dmlToken !== "0x0000000000000000000000000000000000000000" &&
      data &&
      inputNFT
    ) {
      amountErcDesired =
        ((Number(inputNFT.length) * +reserveToken) / +reserveNFT) *
        (1 + slippage / 100);
    } else {
      amountErcDesired = handleBignumber(Number(inputToken), 18);
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
  }, [inputToken, reserveToken, reserveNFT, dmlToken]);

  const addLiquidity = async () => {
    if (!account) {
      setIsOpen(true);
      return;
    }

    if (!isSufficientToken && Math.floor(amountErcDesired) !== 0) {
      const providerChoice = await getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      try {
        setIsOpenTransaction(true);
        const valueToSend =
          tokenAddress === nativeAddress
            ? exponentialToDecimal(Math.floor(amountErcDesired))
            : 0;
        const result = await erc721Contract.addLiquidity(
          wallet,
          collectionAddress,
          nativeAddress,
          inputNFT,
          demask.ROUTER_721,
          amountErcDesired,
          account,
          txDeadline,
          valueToSend
        );
        setHash(result.hash);
        const check = await provider.waitForTransaction(result.hash);
        setIsOpenTransaction(false);
        setInputToken("");
        setAmountErcDesiredToDec("");
        setIsOpenConfirmAddLiquidity(false);
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
      <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
        <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
            Create Pool
          </p>
          <div className="flex justify-between text-lg font-semibold text-dark2">
            <div className="max-w-[60%]">
              <ModalDocument data={data?.metadata?.symbol} />
            </div>
          </div>
          <div className="flex justify-center mx-auto text-xl font-semibold text-dark2">
            +
          </div>
          <div className="flex justify-between text-lg font-semibold text-dark2">
            <FormatNumber number={amountErcDesiredToDec} />
            <p>{data?.tokenSymbol}</p>
          </div>
          {isSufficientToken && (
            <p className="text-xs text-red" key="inputNFT">
              Insufficient Token balance
            </p>
          )}
          {Math.floor(amountErcDesired) === 0 && (
            <p className="mt-2 text-xs text-red" key="inputNFT">
              Can't add liquidity
            </p>
          )}
          {preFectch && (
            <div className="flex items-center justify-between p-4 mt-8 font-semibold text-white rounded-lg bg-secondary5">
              <p className="text-xs">Price Updated</p>
              <Button
                disabled={isLoadingInforDML}
                primary
                className="px-6 py-2 bg-secondary5"
                onClick={() => {
                  setUpdatePrice(!updatePrice);
                  setPreFetch(false);
                }}
              >
                Accept
              </Button>
            </div>
          )}
          <div className="flex justify-between mt-8 text-lg font-semibold text-secondary1">
            <p>Slippage tolerance</p>
            <p>{slippage}%</p>
          </div>
          <p className="mt-2 mb-6 text-sm text-dark2">
            Output is estimated. You will receive at least 12 NFT or the
            transaction will revert
          </p>
          <div className="flex flex-col items-center mt-6">
            <button
              type="button"
              disabled={isLoadingInforDML || preFectch}
              className={`py-2 flex justify-center items-center gap-x-1 w-[144px] hover:bg-white border hover:text-secondary5 hover:border-secondary5 ${
                isLoadingInforDML || preFectch ? "bg-dark4" : "bg-secondary5"
              } rounded-lg text-sm text-white mx-auto block`}
              onClick={addLiquidity}
            >
              Create pool
              {isLoadingInforDML && (
                <BiLoaderAlt className="text-white animate-spin" />
              )}
            </button>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
        </button>
      </div>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
      <ModalSuccess
        isOpenSuccess={true}
        transactionHash={'123'}
        type="Add Liquidity Success"
        setIsOpenSuccess={setIsOpenSuccessAdd}
      />
      {/* <ModalError
        isOpenError={isOpenErrorAdd}
        transactionHash={hash}
        type="Add Liquidity Failed"
        setIsOpenError={setIsOpenErrorAdd}
      /> */}
    </Wrapper>
  );
};

export default memo(ModalConfirmAddLiquidityERC721);
