import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NoteIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import erc721Contract from "@/libs/utils/erc/erc721.contract";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/router";
import { Fragment, memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { BiLoaderAlt } from "react-icons/bi";
import { MediaCollection } from "@/components/Common/Media";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
interface ModalConfirmAddLiquidityERC721Props {
  data: any;
  tokenAddress: string;
  inputToken: string;
  nftAddress: string;
  idNFT: string;
  isOpenTransaction: boolean;
  inputNFT: number[];
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIdNFT: React.Dispatch<React.SetStateAction<number[]>>;
  setInputToken: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalConfirmAddLiquidityERC721: React.FunctionComponent<
  ModalConfirmAddLiquidityERC721Props
> = ({
  data,
  tokenAddress,
  inputToken,
  isOpenTransaction,
  inputNFT,
  setIsOpenTransaction,
  setIdNFT,
  setInputToken,
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
  } = demask;
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [preFectch, setPreFetch] = useState<boolean>(false);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";

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
    isOpenTransaction
  );

  useEffect(() => {
    const load = setInterval(() => {
      setUpdatePrice(!updatePrice);
    }, 20000);
    return () => {
      clearInterval(load);
    };
  }, []);
  const { reserveNFT, reserveToken, isLoadingInforDML } = useInformationDML(
    dmlToken,
    wallet,
    account,
    isOpenTransaction,
    false,
    false,
    true,
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
    }
  }, [inputToken, reserveToken, reserveNFT, dmlToken]);
  const queryClient = useQueryClient();
  const addLiquidity = async () => {
    if (Math.floor(amountErcDesired) !== 0) {
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
        // setIsOpenConfirmAddLiquidity(false);
        // if (setIsOpenLiquidity) {
        //   setIsOpenLiquidity(false);
        // }
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
  console.log(data);

  return (
    <Fragment>
      <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative">
        <div className="px-4 pt-4">
          <div className="flex justify-between text-primary_200 border-shader_500">
            <p className="title_modal">Create Pool</p>
          </div>
        </div>
        <div className="text-sm text-shader_200">
          <div className="flex items-center pb-4 border-b gap-x-3 border-shader_500">
            <div className="w-[65px] h-[65px] rounded-lg overflow-hidden">
              <MediaCollection avatar={formatLinkIPFS(data?.avatar)} />
            </div>
            <div>
              <p className="text-base title">{data?.name}</p>
              <div className="flex items-center gap-x-1">
                <a
                  href={`${demask.urltxHash}address/${collectionAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${collectionAddress.slice(
                    0,
                    8
                  )}...${collectionAddress.slice(-8)}`}
                </a>
                <Copy content={collectionAddress} />
              </div>
            </div>
          </div>
          <div className="flex flex-col py-4 gap-y-2">
            <div className="flex justify-between ">
              <p>NFT quantity</p>
              <div className="flex items-center font-bold text-white gap-x-1">
                {inputNFT.length}
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
                      Output is estimated. You will receive at least {inputNFT}{" "}
                      NFT or the transaction will revert
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
            <p className="text-primary_300 text-sm">
              Output is estimated. You will receive at least {inputNFT.length}
               NFT or the transaction will revert
            </p>
            <div className="flex justify-between p-3 rounded-lg bg-primary_500 bg-opacity-10 mt-2 font-semibold">
              <p className="text-primary_200">Total Pay</p>
              <div className="flex items-center font-bold text-white gap-x-1">
                <FormatNumber number={amountErcDesiredToDec} />
                <EtherIcon width={14} height={14} />
              </div>
            </div>
          </div>
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
              Create pool
              {isLoadingInforDML && (
                <BiLoaderAlt className="ml-1 text-white animate-spin" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </Fragment>
  );
};

export default memo(ModalConfirmAddLiquidityERC721);
