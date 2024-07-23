import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NoteIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import { useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { memo, useContext, useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
interface ModalSellNFTProps {
  tokenAddress: string;
  data: DataBase;
  dataSell: DataSell;
  isFetching: boolean;
  inputNFT: string;
  nftAddress: string;
  idNFT: string | number[];
  isOpenTransaction: boolean;
  routerAddress: string;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSellNFT: React.Dispatch<React.SetStateAction<boolean>>;
  setInputNFT: any;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalSellNFT: React.FunctionComponent<ModalSellNFTProps> = ({
  tokenAddress,
  data,
  dataSell,
  isFetching,
  inputNFT,
  nftAddress,
  idNFT,
  isOpenTransaction,
  routerAddress,
  setIsOpenTransaction,
  setIsOpenSellNFT,
  setInputNFT,
  setIsOpenError,
  setIsOpenSuccess,
  setHash,
}) => {
  const { demask, account, wallet, slippage, txDeadline, updateBalance } =
    useContext(AccountContext);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [seeDetail, setSeeDetail] = useState<boolean>(false);
  const balanceNFT = useNFTBalance(
    account,
    nftAddress,
    idNFT,
    wallet,
    isOpenTransaction
  );
  useEffect(() => {
    const checkReservesNFT = () => {
      if (inputNFT === "") {
        setIsSufficientNFT(true);
      } else {
        if (Number(inputNFT) <= Number(balanceNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      }
    };
    checkReservesNFT();
  }, [inputNFT, account, balanceNFT]);

  const queryClient = useQueryClient();

  const handleSellNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!account) {
      return;
    }
    if (
      isSufficientNFT &&
      Number(dataSell?.reserveNFT) > 0 &&
      Number(dataSell?.reserveToken) > 0 &&
      Math.floor(dataSell.minAmountDecimals) > 0
    ) {
      try {
        let result;
        setIsOpenTransaction(true);
        if (inputNFT) {
          result = await erc1155Contract.sellERC20ERC1155(
            wallet,
            nftAddress,
            tokenAddress,
            idNFT,
            routerAddress,
            dataSell.minAmountDecimals,
            inputNFT,
            account,
            txDeadline
          );
        } else {
          result = await ercContract721.sellERC20ERC721(
            wallet,
            nftAddress,
            tokenAddress,
            idNFT,
            routerAddress,
            dataSell.minAmountDecimals,
            account,
            txDeadline
          );
        }
        setHash(result.hash);
        const check = await result.wait();
        setIsOpenTransaction(false);
        setIsOpenSellNFT(false);
        if (check.status === 1) {
          setIsOpenSuccess(true);
        } else {
          setIsOpenError(true);
        }
        setInputNFT("");
        queryClient.refetchQueries(["collectionNFTBUY"]);
        queryClient.refetchQueries(["collectionNFTSell"]);
        queryClient.refetchQueries(["detailCollection"]);
        queryClient.refetchQueries(["1155TradingSell"]);
        await updateBalance();
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };

  return (
    <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative bg_main">
      <div className="px-4 pt-4">
        <p className="title_modal">Confirm Sell</p>
      </div>
      <div className="p-4 text-sm text-shader_200">
        <div className="flex items-center pb-4 border-b gap-x-3 border-shader_500">
          <div className="w-[65px] h-[65px] overflow-hidden rounded-lg">
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
              <FormatNumber number={dataSell.price} />

              <p>
                <EtherIcon width={14} height={14} />
              </p>
            </div>
          </div>
          <div className="flex justify-between ">
            <p>Minximum amount</p>
            <div className="flex gap-x-1">
              <div className="flex items-center font-bold text-white gap-x-1">
                <FormatNumber number={dataSell.minAmount} />
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
          <div
            className="flex justify-between cursor-pointer group "
            onClick={() => setSeeDetail(!seeDetail)}
          >
            <div className="flex items-center gap-x-1">
              <p>Total fee</p>
              <div
                className={`p-1  rounded-lg transition-all duration-100 ease-linear ${
                  seeDetail ? "rotate-90" : ""
                }`}
              >
                <FaChevronRight />
              </div>
            </div>
            <div className="flex items-center font-bold text-white gap-x-1">
              <FormatNumber number={dataSell.totalFee} />
              <EtherIcon width={14} height={14} />
            </div>
          </div>
          <div
            className={`overflow-hidden flex justify-between will-change-[height] ${
              seeDetail ? "h-[100px] opacity-100" : "h-0 opacity-0"
            } transition-all duration-100 ease-linear`}
          >
            <div className="flex flex-col gap-y-[6px]">
              <p>Protocol Fee</p>
              <p>Referral Fee</p>
              <p>Pool Fee</p>
              <p>Royalty Fee</p>
            </div>
            <div className="flex flex-col gap-y-1 items-end">
              {dataSell.fees.slice(0, 4).map((fee, index) => (
                <div
                  className="flex items-center font-bold text-white gap-x-1"
                  key={index}
                >
                  <FormatNumber number={fee} />
                  <EtherIcon width={14} height={14} />
                </div>
              ))}
            </div>
          </div>
          {!isSufficientNFT && dataSell.reserveNFT && (
            <p className="text-xs text-red" key="NFTbalance">
              Insufficient NFT balance
            </p>
          )}
          <div className="flex justify-between p-3 rounded-lg bg-primary_500 bg-opacity-10 mt-2 font-semibold">
            <p className="text-primary_200">Total Receipts</p>
            <div className="flex items-center font-bold text-white gap-x-1">
              <FormatNumber number={dataSell.minAmount} />
              <EtherIcon width={14} height={14} />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Button
            disabled={isFetching}
            primary={!isFetching}
            className="px-8 py-3"
            active={isFetching}
            isLoadingBtn={isFetching}
            onClick={handleSellNFT}
          >
            Confirm
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

export default memo(ModalSellNFT);
