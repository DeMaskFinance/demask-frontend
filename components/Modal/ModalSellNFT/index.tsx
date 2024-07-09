import { Button } from "@/components/Buttons";
import Copy from "@/components/Common/Copy";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NoteIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useFee from "@/hooks/useFee";
import useInformationDML from "@/hooks/useInformationDML";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import { useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalSellNFTProps {
  isOpenSellNFT: boolean;
  tokenAddress: string;
  data: DataBase;
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
  isOpenSellNFT,
  tokenAddress,
  data,
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
  const { demask, account, wallet, slippage, txDeadline } =
    useContext(AccountContext);
  const { RPC: rpc } = demask;
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [totalPay, setTotalPay] = useState<number>(0);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [seeDetail, setSeeDetail] = useState<boolean>(false);

  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSellNFT(false);
  };
  const { reserveNFT, reserveToken, isLoadingInforDML } = useInformationDML(
    data.dmlAddress,
    wallet,
    account,
    isOpenTransaction,
    false,
    isOpenSellNFT,
    true,
    true,
    updatePrice
  );
  const { amountTokenSell } = useAmountOutMin(
    inputNFT,
    data.dmlAddress,
    tokenAddress,
    nftAddress,
    idNFT,
    wallet,
    account,
    rpc,
    routerAddress,
    updatePrice
  );
  const { totalFee } = useFee(
    amountTokenSell,
    data.dmlAddress,
    wallet,
    account,
    rpc,
    demask.FEE_MANAGER,
    updatePrice
  );
  const { feeSell } = useFee(
    amountTokenSell,
    data.dmlAddress,
    wallet,
    account,
    rpc,
    demask.FEE_MANAGER,
    updatePrice
  );
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
  }, [inputNFT, account, amountSellDec]);

  useEffect(() => {
    if (data && amountTokenSell) {
      setAmountSellDec((amountTokenSell - totalFee) * (1 - slippage / 100));
      setTotalPay(amountTokenSell - totalFee);
    } else {
      setAmountSellDec(0);
      setTotalPay(0);
    }
  }, [data, slippage, amountTokenSell, totalFee]);
  const queryClient = useQueryClient();
  console.log(totalPay);

  useEffect(() => {
    const load = setInterval(() => {
      if (isOpenSellNFT) {
        setUpdatePrice(!updatePrice);
      }
    }, 20000);
    return () => {
      clearInterval(load);
    };
  }, [isOpenSellNFT]);
  const handleSellNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!account) {
      return;
    }
    if (
      isSufficientNFT &&
      Number(reserveNFT) > 0 &&
      Number(reserveToken) > 0 &&
      Math.floor(amountSellDec) > 0
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
            amountSellDec,
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
            amountSellDec,
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
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };

  return (
    <Wrapper isOpen={isOpenSellNFT} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative">
          <div className="px-4 pt-4">
            <div className="flex justify-between text-primary_200 border-shader_500">
              <p className="title_modal">Confirm Sell</p>
              <div onClick={handleClose}>
                <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
              </div>
            </div>
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
                  <FormatNumber
                    number={(
                      Number(
                        divideByDecimal(
                          amountTokenSell.toString(),
                          data.tokenDecimals
                        )
                      ) / (inputNFT ? Number(inputNFT) : idNFT.length)
                    ).toString()}
                  />

                  <p>
                    <EtherIcon width={14} height={14} />
                  </p>
                </div>
              </div>
              <div className="flex justify-between ">
                <p>Minximum amount</p>
                <div className="flex gap-x-1">
                  <div className="flex items-center font-bold text-white gap-x-1">
                    <FormatNumber
                      number={Number(
                        divideByDecimal(
                          amountSellDec.toString(),
                          data.tokenDecimals
                        )
                      ).toString()}
                    />
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
                  {totalFee ? (
                    <FormatNumber
                      number={divideByDecimal(
                        totalFee.toString(),
                        data.tokenDecimals
                      )}
                    />
                  ) : (
                    0
                  )}
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
                  {feeSell.slice(0, 4).map((fee, index) => (
                    <div
                      className="flex items-center font-bold text-white gap-x-1"
                      key={index}
                    >
                      <FormatNumber
                        number={divideByDecimal(
                          fee[1].toString(),
                          data.tokenDecimals
                        )}
                      />
                      <EtherIcon width={14} height={14} />
                    </div>
                  ))}
                </div>
              </div>
              {!isSufficientNFT && reserveNFT && (
                <p className="text-xs text-red" key="NFTbalance">
                  Insufficient NFT balance
                </p>
              )}
              <div className="flex justify-between p-3 rounded-lg bg-primary_500 bg-opacity-10 mt-2 font-semibold">
                <p className="text-primary_200">Total Receipts</p>
                <div className="flex items-center font-bold text-white gap-x-1">
                  <FormatNumber
                    number={divideByDecimal(totalPay, data.tokenDecimals)}
                  />
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
                onClick={handleSellNFT}
              >
                Confirm
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

export default memo(ModalSellNFT);
