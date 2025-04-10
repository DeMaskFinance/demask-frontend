import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NoteIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import { useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { useContext, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { ModalTransation } from "../ModalTransation";
import useInformationToken from "@/hooks/useInformationToken";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import handleApproveDML from "@/libs/utils/handleApproveDML";
import TokenIcon from "@/components/Logo/TokenIcon";
interface ModalBuyNFTProps {
  tokenAddress: string;
  data: DataBase;
  dataBuy: DataBuy;
  inputNFT: string;
  nftAddress: string;
  idNFT: string | number[];
  isFetching: boolean;
  routerAddress: string;
  isOpenTransaction: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenBuyNFT: React.Dispatch<React.SetStateAction<boolean>>;
  setInputNFT: any;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalBuyNFT: React.FunctionComponent<ModalBuyNFTProps> = ({
  tokenAddress,
  data,
  dataBuy,
  inputNFT,
  isFetching,
  nftAddress,
  idNFT,
  routerAddress,
  isOpenTransaction,
  setIsOpenTransaction,
  setIsOpenBuyNFT,
  setInputNFT,
  setIsOpenError,
  setIsOpenSuccess,
  setHash,
}) => {
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const [seeDetail, setSeeDetail] = useState<boolean>(false);
  const { demask, account, wallet, slippage, txDeadline, chainId } =
    useContext(AccountContext);
  const { bigNumberBalance } = useInformationToken(account, wallet, chainId);
  useEffect(() => {
    if (Number(inputNFT) < Number(dataBuy?.reserveNFT)) {
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
    if (Number(dataBuy.maxAmountDecimals) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
  }, [inputNFT, account, dataBuy, bigNumberBalance]);

  const queryClient = useQueryClient();

  const { buyERC20ERC1155 } = erc1155Contract();
  const { buyERC20ERC721 } = ercContract721();



  const { currentAllowance, refetch } = useAllowanceDML(
    account,
    tokenAddress,
    routerAddress || ""
  );
  const { approveDML } = handleApproveDML()

  const handleBuyNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!account) {
      return;
    }
    if (
      Number(dataBuy?.reserveNFT) > 1 &&
      Number(dataBuy?.reserveToken) > 0 &&
      Math.floor(dataBuy?.maxAmountDecimals) > 0 &&
      isSufficientNFT &&
      isSufficientTokenBuy
    ) {
      try {
        let result;
        setIsOpenTransaction(true);

        if (!dataBuy?.paymentToken?.isNative && ((currentAllowance / 1e18) <= Number(dataBuy.maxAmount))) {
          await approveDML(
            account,
            tokenAddress,
            String(dataBuy.maxAmount),
            setIsOpenTransaction,
            routerAddress,
            refetch
          );
        }

        if (inputNFT) {
          result = await buyERC20ERC1155(
            account,
            nftAddress,
            tokenAddress,
            idNFT,
            routerAddress,
            dataBuy.maxAmountDecimals,
            inputNFT,
            txDeadline,
            dataBuy?.paymentToken?.isNative
          );
        } else {
          result = await buyERC20ERC721(
            nftAddress,
            tokenAddress,
            idNFT,
            routerAddress,
            dataBuy.maxAmountDecimals,
            account,
            txDeadline,
            dataBuy?.paymentToken?.isNative
          );
        }
        setHash(result.transactionHash);

        if (result.status === "success") {
          setIsOpenTransaction(false);
          setIsOpenBuyNFT(false);
          setIsOpenSuccess(true);
        } else {
          setIsOpenTransaction(false);
          setIsOpenBuyNFT(false);
          setIsOpenError(false);
        }
        setInputNFT("");
        queryClient.refetchQueries({ queryKey: ["collectionNFTBUY"] });
        queryClient.refetchQueries({ queryKey: ["collectionNFTSell"] });
        queryClient.refetchQueries({ queryKey: ["detailCollection"] });
        queryClient.refetchQueries({ queryKey: ["1155TradingBuy"] });
        queryClient.refetchQueries({ queryKey: ["useBalanceToken"] });
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };



  return (
    <div className="h-fit w-full md:w-[400px] lg:w-[480px] rounded-lg relative bg_main">
      <div className="px-4 pt-4">
        <div className="flex justify-between text-primary_200 border-shader_500">
          <p className="title_modal">Confirm Buy</p>
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
            <p>Price</p>
            <div className="flex items-center font-bold text-white gap-x-1">
              <FormatNumber number={dataBuy.price} />

              <p>
                <TokenIcon token={dataBuy?.paymentToken?.symbol || ""} w={14} h={14} />
              </p>
            </div>
          </div>
          <div className="flex justify-between ">
            <p>Maximum amount</p>
            <div className="flex gap-x-1">
              <div className="flex items-center font-bold text-white gap-x-1">
                <FormatNumber number={dataBuy.maxAmount} />
                <TokenIcon token={dataBuy?.paymentToken?.symbol || ""} w={14} h={14} />
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
          <div
            className="flex justify-between cursor-pointer group "
            onClick={() => setSeeDetail(!seeDetail)}
          >
            <div className="flex items-center gap-x-1">
              <p>Total fee</p>
              <div
                className={`p-1  rounded-lg transition-all duration-100 ease-linear ${seeDetail ? "rotate-90" : ""
                  }`}
              >
                <FaChevronRight />
              </div>
            </div>
            <div className="flex items-center font-bold text-white gap-x-1">
              <FormatNumber number={dataBuy.totalFee} />
              <p>
                <TokenIcon token={dataBuy?.paymentToken?.symbol || ""} w={14} h={14} />
              </p>
            </div>
          </div>
          <div
            className={`overflow-hidden will-change-[height] flex justify-between ${seeDetail ? "h-[100px] opacity-100" : "h-0 opacity-0"
              } transition-all duration-100 ease-linear`}
          >
            <div className="flex flex-col gap-y-1">
              <p>Protocol Fee</p>
              <p>Referral Fee</p>
              <p>Pool Fee</p>
              <p>Royalty Fee</p>
            </div>
            <div className="flex flex-col items-end gap-y-1">
              {dataBuy.fees.map((fee, index) => (
                <div
                  className="flex items-center font-bold text-white gap-x-1"
                  key={index}
                >
                  <FormatNumber number={fee} />
                  <TokenIcon token={dataBuy?.paymentToken?.symbol || ""} w={14} h={14} />
                </div>
              ))}
            </div>
          </div>
          {!isSufficientNFT && dataBuy?.reserveNFT && (
            <p className="text-xs text-red" key="NFTbalance">
              Insufficient NFT balance
            </p>
          )}
          {!isSufficientTokenBuy && dataBuy?.reserveToken && (
            <p className="text-xs text-red" key="Tokenbalance">
              Insufficient Token balance
            </p>
          )}
          <div className="flex justify-between p-3 mt-2 font-semibold rounded-lg bg-primary_500 bg-opacity-10">
            <p className="text-primary_200">Total Pay</p>
            <div className="flex items-center font-bold text-white gap-x-1">
              <FormatNumber number={dataBuy.totalPay} />
              <TokenIcon token={dataBuy?.paymentToken?.symbol || ""} w={14} h={14} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Button
            disabled={isFetching}
            primary={!isFetching}
            className="px-8 py-3"
            isLoadingBtn={isFetching}
            onClick={handleBuyNFT}
          >
            {!dataBuy?.paymentToken?.isNative && (currentAllowance / 1e18) < Number(dataBuy?.maxAmount) ?
              "Approve Token" : " Confirm"
            }
          </Button>
        </div>
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </div>
  );
};

export default ModalBuyNFT;
