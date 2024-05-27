import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { DownIcon, EtherIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationDML from "@/hooks/useInformationDML";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { FaChevronRight } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import useFee from "@/hooks/useFee";
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { demask, tokenDefault, account, wallet, slippage, txDeadline } =
    useContext(AccountContext);
  const { RPC: rpc } = demask;
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [preFectch, setPreFetch] = useState<boolean>(false);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  console.log(amountTokenSell, amountSellDec, slippage, totalFee);

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
  console.log(data);

  useEffect(() => {
    if (data && amountTokenSell) {
      setIsLoading(true);
      setAmountSellDec((amountTokenSell - totalFee) * (1 - slippage / 100));
      setIsLoading(false);
    } else {
      setAmountSellDec(0);
    }
  }, [data, slippage, amountTokenSell, totalFee]);
  const queryClient = useQueryClient();
  console.log({
    amountSellDec,
    amountTokenSell,
    totalFee,
  });

  useEffect(() => {
    const load = setInterval(() => {
      if (isOpenSellNFT) {
        setPreFetch(true);
      } else {
        setPreFetch(false);
      }
    }, 20000);
    return () => {
      clearInterval(load);
    };
  }, [isOpenSellNFT, preFectch]);
  const handleSellNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
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
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <p className="title_modal">Confirm Sell</p>
          <div className="content_modal">
            {inputNFT ? <p>{inputNFT}</p> : <p>{idNFT.length}</p>}
            <p>{data?.metadata?.symbol}</p>
          </div>
          <div>
            <DownIcon
              width={24}
              height={24}
              className="mx-auto cursor-pointer hover:fill-primary_400"
            />
          </div>
          <div className="content_modal">
            <p>ETH</p>
          </div>
          {preFectch && (
            <div className="flex items-center justify-between p-4 mt-8 font-semibold text-white rounded-lg bg-primary_400">
              <p className="text-xs">Price Updated</p>
              <Button
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
          <div className="flex flex-wrap mt-2 mb-6 text-sm text-shader_600 gap-x-1">
            <span>Output is estimated. You will receive at least</span>
            <span className="flex gap-x-1">{data.metadata?.symbol}</span>
            <span> or the transaction will revert</span>
          </div>
          <div className="flex flex-col p-4 rounded-lg bg-shader_500 gap-y-3 bg-shader_700 border-shader_700 text-shader_700 dark:text-shader_500">
            <div className="flex justify-between text-sm ">
              <p>Price</p>
              <div className="flex items-center">
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
                  <EtherIcon
                    width={14}
                    height={14}
                    className="fill-shader_600"
                  />
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm ">
              <p>Minimum received</p>
              <div className="flex items-center">
                <FormatNumber
                  number={divideByDecimal(
                    amountSellDec.toString(),
                    data.tokenDecimals
                  )}
                />
                <p>
                  <EtherIcon
                    width={14}
                    height={14}
                    className="fill-shader_600"
                  />
                </p>
              </div>
            </div>
            <div
              className="flex justify-between pt-2 text-sm border-t cursor-pointer group border-shader_500 text-shader_700 dark:text-shader_500"
              onClick={() => setSeeDetail(!seeDetail)}
            >
              <div className="flex items-center gap-x-1">
                <p>Total fee</p>
                <div
                  className={`p-1 text-sm rounded-lg transition-all duration-100 ease-linear ${
                    seeDetail ? "rotate-90" : ""
                  }`}
                >
                  <FaChevronRight />
                </div>
              </div>
              <div className="flex items-center">
                {/* <FormatNumber
                  number={divideByDecimal(
                    (+feeTradingSell + +royaltiesFeeSell).toString(),
                    data.tokenDecimals
                  ).toString()}
                /> */}
                <p>
                  <EtherIcon
                    width={14}
                    height={14}
                    className="fill-shader_600"
                  />
                </p>
              </div>
            </div>
            <div
              className={`overflow-hidden ${
                seeDetail ? "h-[56px] opacity-100" : "h-0 opacity-0"
              } transition-all duration-100 ease-linear`}
            >
              <div className="flex justify-between mb-4 text-sm text-shader_700">
                <p>Trading fee</p>
                <div className="flex items-center">
                  {/* <FormatNumber
                    number={divideByDecimal(
                      feeTradingSell.toString(),
                      data.tokenDecimals
                    )}
                  /> */}
                  <p>
                    <EtherIcon
                      width={14}
                      height={14}
                      className="fill-shader_600"
                    />
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-shader_700">
                <p>Royalties Fee</p>
                <div className="flex items-center">
                  {/* <FormatNumber number={(royaltiesFeeSell / 1e18).toString()} /> */}
                  12
                  <p>
                    <EtherIcon
                      width={14}
                      height={14}
                      className="fill-shader_600"
                    />
                  </p>
                </div>
              </div>
            </div>
            {!isSufficientNFT && reserveNFT && (
              <p className="text-xs text-red" key="NFTbalance">
                Insufficient NFT balance
              </p>
            )}
            {Math.floor(amountSellDec) === 0 && inputNFT && (
              <p className="text-xs text-red">Can't sell</p>
            )}
          </div>
          <div className="flex flex-col items-center mt-6">
            <Button
              disabled={isLoading || preFectch}
              primary={!isLoading && !preFectch}
              className="w-[144px] py-2"
              active={isLoading || preFectch}
              onClick={handleSellNFT}
            >
              SELL NFT
              {isLoading && (
                <BiLoaderAlt className="ml-1 text-white animate-spin" />
              )}
            </Button>
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
    </Wrapper>
  );
};

export default memo(ModalSellNFT);
