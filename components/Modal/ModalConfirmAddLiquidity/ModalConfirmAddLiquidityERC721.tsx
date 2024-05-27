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
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalDocument from "../ModalLength/ModalDocument";
import { ModalTransation } from "../ModalTransation";
import Wrapper from "../Wrapper";
import { useQueryClient } from "@tanstack/react-query";
interface ModalConfirmAddLiquidityERC721Props {
  isOpenConfirmAddLiquidity: boolean;
  tokenAddress: string;
  inputToken: string;
  nftAddress: string;
  idNFT: string;
  isOpenTransaction: boolean;
  inputNFT: number[];
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIdNFT: React.Dispatch<React.SetStateAction<number[]>>;
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
  inputToken,
  isOpenTransaction,
  inputNFT,
  setIsOpenTransaction,
  setIdNFT,
  setIsOpenConfirmAddLiquidity,
  setInputToken,
  setIsOpenLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
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
  const collectionAddress = useRouter().query.collection as string;

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

  useEffect(() => {
    let amountErcDesired;
    if (dmlToken !== "0x0000000000000000000000000000000000000000" && inputNFT) {
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
        "18"
      );
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true);
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [inputToken, reserveToken, reserveNFT, dmlToken]);
  const queryClient = useQueryClient();
  const addLiquidity = async () => {
    if (!isSufficientToken && Math.floor(amountErcDesired) !== 0) {
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
        const check = await result.wait();
        setIsOpenTransaction(false);
        setInputToken("");
        setAmountErcDesiredToDec("");
        setIdNFT([]);
        setIsOpenConfirmAddLiquidity(false);
        if (setIsOpenLiquidity) {
          setIsOpenLiquidity(false);
        }
        if (check.status === 1) {
          setIsOpenSuccess(true);
        } else {
          setIsOpenError(true);
        }
        queryClient.refetchQueries(["collectionNFTBUY"]);
        queryClient.refetchQueries(["collectionNFTSell"]);
        queryClient.refetchQueries(["detailCollection"]);
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
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <p className="title_modal">Create Pool</p>
          <div className="content_modal">
            <p>{inputNFT.length}</p>
            <div className="max-w-[60%]">
              <ModalDocument data="DM" />
            </div>
          </div>
          <div className="flex justify-center mx-auto text-xl font-semibold text-shader_600">
            +
          </div>
          <div className="content_modal">
            <FormatNumber number={amountErcDesiredToDec} />
            <p>ETH</p>
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
            <div className="flex items-center justify-between p-4 mt-8 font-semibold text-white rounded-lg bg-primary_400">
              <p className="text-xs">Price Updated</p>
              <Button
                disabled={isLoadingInforDML}
                primary
                className="px-6 py-2 bg-primary_400"
                onClick={() => {
                  setUpdatePrice(!updatePrice);
                  setPreFetch(false);
                }}
              >
                Accept
              </Button>
            </div>
          )}
          <div className="flex justify-between mt-8 text-lg font-semibold text-primary_500">
            <p>Slippage tolerance</p>
            <p>{slippage}%</p>
          </div>
          <p className="mt-2 mb-6 text-sm text-shader_600">
            Output is estimated. You will receive at least {inputNFT.length} NFT
            or the transaction will revert
          </p>
          <div className="flex flex-col items-center mt-6">
            <Button
              disabled={
                isLoadingInforDML ||
                preFectch ||
                Math.floor(amountErcDesired) === 0
              }
              primary={
                !isLoadingInforDML &&
                !preFectch &&
                Math.floor(amountErcDesired) > 0
              }
              className="w-[144px] py-2"
              active={
                isLoadingInforDML ||
                preFectch ||
                Math.floor(amountErcDesired) === 0
              }
              onClick={addLiquidity}
            >
              CREATE POOL
              {isLoadingInforDML && (
                <BiLoaderAlt className="ml-1 text-white animate-spin" />
              )}
            </Button>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red text-white" />
        </button>
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </Wrapper>
  );
};

export default memo(ModalConfirmAddLiquidityERC721);
