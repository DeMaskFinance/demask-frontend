import abiRouter from "@/abi/abiRouter.json";
import FormatNumber from "@/components/Common/FormatNumber";
import { DownIcon, EtherIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import { Button } from "@/components/Buttons";
import { BiLoaderAlt } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract721 from "@/libs/utils/erc/erc721.contract";
import { useQueryClient } from "@tanstack/react-query";
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
  const { RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [totalProcessSell, setTotalProcessSell] = useState<number>(0);
  const [preFectch, setPreFetch] = useState<boolean>(false);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [royaltiesFeeSell, setRoyaltiesFeeSell] = useState<number>(0);
  const [seeDetail, setSeeDetail] = useState<boolean>(false);
  const [isSufficientTokenSell, setIsSufficientTokenSell] =
    useState<boolean>(false);
  const { bigNumberBalance } = useInformationToken(
    account,
    tokenAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction,
    isOpenSellNFT
  );

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
  const { amountTokenSell, isLoadingSell, feeTradingSell } = useAmountOutMin(
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
    if (Number(amountSellDec.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenSell(false);
    } else {
      setIsSufficientTokenSell(true);
    }
  }, [inputNFT, account, amountSellDec]);
  useEffect(() => {
    if (data && amountTokenSell) {
      setAmountSellDec(
        amountTokenSell * (1 - slippage / 100) -
          (amountTokenSell * Number(data.royaltyFee)) / 100
      );
      setTotalProcessSell(
        amountTokenSell - (amountTokenSell * Number(data.royaltyFee)) / 100
      );
      setRoyaltiesFeeSell((amountTokenSell * Number(data.royaltyFee)) / 100);
    } else {
      setAmountSellDec(0);
      setTotalProcessSell(0);
      setRoyaltiesFeeSell(0);
    }
  }, [data, slippage, amountTokenSell, data.royaltyFee]);
  const queryClient = useQueryClient();

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
      isSufficientTokenSell &&
      Number(reserveNFT) > 0 &&
      Number(reserveToken) > 0 &&
      Math.floor(amountSellDec) > 0
    ) {
      const fee = data.royaltyFee === 0 ? 5000 : data.royaltyFee! * 10000;
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
            fee,
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
            fee,
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
        queryClient.refetchQueries(['collectionNFTBUY'])
        queryClient.refetchQueries(['collectionNFTSell'])
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };
  return (
    <Wrapper isOpen={isOpenSellNFT} onClick={handleClose}>
      <div className="container_modal">
        <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
            Confirm Sell
          </p>
          <div className="flex justify-between text-lg font-semibold text-dark2">
            {inputNFT ? <p>{inputNFT}</p> : <p>{idNFT.length}</p>}
            <p>{data?.metadata?.symbol}</p>
          </div>
          <div>
            <DownIcon
              width={24}
              height={24}
              className="mx-auto cursor-pointer hover:fill-secondary5"
            />
          </div>
          <div className="flex justify-between text-lg font-semibold text-dark2">
            <FormatNumber
              number={divideByDecimal(
                totalProcessSell.toString(),
                data.tokenDecimals
              )}
            />
            <p>ETH</p>
          </div>
          {preFectch && (
            <div className="flex items-center justify-between p-4 mt-8 font-semibold text-white rounded-lg bg-secondary5">
              <p className="text-xs">Price Updated</p>
              <Button
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
          <div className="flex flex-wrap mt-2 mb-6 text-sm text-dark2 gap-x-1">
            <span>Output is estimated. You will receive at least</span>
            <span className="flex gap-x-1">
              <FormatNumber
                number={divideByDecimal(
                  totalProcessSell.toString(),
                  data.tokenDecimals
                )}
              />{" "}
              {data.metadata?.symbol}
            </span>
            <span> or the transaction will revert</span>
          </div>
          <div className="flex flex-col p-4 rounded-lg bg-dark4 gap-y-3">
            <div className="flex justify-between text-sm text-dark1">
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
                  <EtherIcon width={14} height={14} className="fill-dark2" />
                </p>
              </div>
            </div>
            <div className="flex justify-between text-sm text-dark1">
              <p>Minimum received</p>
              <div className="flex items-center">
                <FormatNumber
                  number={divideByDecimal(
                    amountSellDec.toString(),
                    data.tokenDecimals
                  )}
                />
                <p>
                  <EtherIcon width={14} height={14} className="fill-dark2" />
                </p>
              </div>
            </div>
            <div
              className="flex justify-between pt-2 text-sm border-t cursor-pointer group border-dark3 text-dark1"
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
                <FormatNumber
                  number={divideByDecimal(
                    (+feeTradingSell + +royaltiesFeeSell).toString(),
                    data.tokenDecimals
                  ).toString()}
                />
                <p>
                  <EtherIcon width={14} height={14} className="fill-dark2" />
                </p>
              </div>
            </div>
            <div
              className={`overflow-hidden ${
                seeDetail ? "h-[56px] opacity-100" : "h-0 opacity-0"
              } transition-all duration-100 ease-linear`}
            >
              <div className="flex justify-between mb-4 text-sm text-dark1">
                <p>Trading fee</p>
                <div className="flex items-center">
                  <FormatNumber
                    number={divideByDecimal(
                      feeTradingSell.toString(),
                      data.tokenDecimals
                    )}
                  />
                  <p>
                    <EtherIcon width={14} height={14} className="fill-dark2" />
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-dark1">
                <p>Royalties Fee</p>
                <div className="flex items-center">
                  <FormatNumber number={(royaltiesFeeSell / 1e18).toString()} />
                  <p>
                    <EtherIcon width={14} height={14} className="fill-dark2" />
                  </p>
                </div>
              </div>
            </div>
            {!isSufficientNFT && reserveNFT && (
              <p className="text-xs text-red" key="NFTbalance">
                Insufficient NFT balance
              </p>
            )}
            {!isSufficientTokenSell && reserveToken && (
              <p className="text-xs text-red" key="Tokenbalance">
                Insufficient Token balance
              </p>
            )}
            {Math.floor(amountSellDec) === 0 && inputNFT && (
              <p className="text-xs text-red">Can't sell</p>
            )}
          </div>
          <div className="flex flex-col items-center mt-6">
            <button
              type="button"
              disabled={isLoadingInforDML || preFectch}
              className={`py-2 flex justify-center items-center gap-x-1 w-[144px] hover:bg-white border hover:text-secondary5 hover:border-secondary5 ${
                isLoadingInforDML || preFectch ? "bg-dark4" : "bg-secondary5"
              } rounded-lg text-sm text-white mx-auto block`}
              onClick={handleSellNFT}
            >
              SELL NFT
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
    </Wrapper>
  );
};

export default memo(ModalSellNFT);
