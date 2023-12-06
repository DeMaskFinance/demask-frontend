import { Button } from "@/components/Buttons";
import { ChartLoading } from "@/components/Charts";
import ChartNoTransfers from "@/components/Charts/ChartNoTransfers";
import ChartSwap from "@/components/Charts/ChartSwap";
import MediaNFT from "@/components/Common/MediaNFT";
import { ActiveIcon, EtherIcon, PoolIcon } from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import ModalSetting from "@/components/Modal/ModalSetting";
import { ModalError, ModalSuccess, ModalTransation } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { TabGroups } from "@/components/NavChoice";
import { SkeletonReels } from "@/components/Skeleton";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationToken from "@/hooks/useInformationToken";
import { swapAPI } from "@/libs/service";
import approveNFT from "@/libs/utils/approveNFT";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import { getBuyPrice, getSellPrice } from "@/libs/utils/getPrice";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import { SEO } from '../../next-seo.config';
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import useAmountInMax from "@/hooks/useAmountInMax";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import { swapChartAPI } from "@/libs/service/swapService";
import FormatNumber from "@/components/Common/FormatNumber";
import { BiLoaderAlt } from "react-icons/bi";
import ChartKline from "@/components/Charts/ChartSwapKLine";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import HistoryItem from "@/components/Swap/History/HistoryItem";
import HistorySwap from "@/components/Swap/History";
const styles = {
  inputItem: "w-full py-2 pl-2 mb-2 border rounded-lg border-dark3 block",
  btnActive: "rounded-full bg-base2",
};
const updateMeta = {
  ...SEO,
  title: 'Swap',
};
const Swap: React.FC = () => {
  const router = useRouter();
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [symbolToken, setSymbolToken] = useState<string>('');
  const [idNFT, setIdNFT] = useState<string>("");
  const [inputNFT, setInputNFT] = useState<string>("");
  const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [isOpenSearchToken, setIsOpenSearchToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenSellNFT, setIsOpenSellNFT] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const [isSufficientTokenSell, setIsSufficientTokenSell] =
    useState<boolean>(false);
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { account, wallet, chainId, demask, tokenDefault, slippage, txDeadline } = useContext(AccountContext);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction);

  const { slug } = router.query;
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["swap", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      const res = await swapAPI(tokenAddress.toLocaleLowerCase(), chainId, nftAddress.toLowerCase(), idNFT);
      return res;
    },
    keepPreviousData: true,
  });
  const { isLoading: isLoadingChart, data: dataChart, isFetching: isFetchingChart, isSuccess: isSuccessChart } = useQuery({
    queryKey: ["swapChart", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      const res = await swapChartAPI(tokenAddress.toLocaleLowerCase(), chainId, nftAddress.toLowerCase(), idNFT);
      return res;
    },
    keepPreviousData: true,
  });
  usePreventUserFromErasingContent(checkExit);

  useEffect(() => {
    if (slug) {
      setNftAddress(slug[0]);
      setTokenAddress(slug[1]);
      setIdNFT(slug[2]);
      setInputNFT("");
    }
  }, [slug]);
  useEffect(() => {
    if (tokenDefault && data) {
      if (data.tokenSymbol !== tokenDefault[0].symbolNative) {
        setSymbolToken(data.tokenSymbol)
      } else {
        setSymbolToken(tokenDefault[0].symbol)
      }
    }
  }, [data, slug, tokenDefault])

  const balanceNFT = useNFTBalance(account, nftAddress, idNFT, wallet, isOpenTransaction);

  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(account, wallet, nftAddress, routerAddress);
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, nftAddress, wallet, isOpenTransaction]);

  const { amountTokenBuy, feeTradingBuy, isLoadingBuy } = useAmountInMax(inputNFT, data?.dmlAddress, tokenAddress, nftAddress, idNFT, wallet, account, rpc, routerAddress);
  const { amountTokenSell, isLoadingSell, feeTradingSell } = useAmountOutMin(inputNFT, data?.dmlAddress, tokenAddress, nftAddress, idNFT, wallet, account, rpc, routerAddress);
  console.log(amountTokenBuy);
  console.log(amountTokenSell);
  console.log(data);

  useEffect(() => {
    if (inputNFT && data && amountTokenBuy && amountTokenSell) {
      setAmountBuyDec(amountTokenBuy * (1 + (slippage / 100)));
      setAmountSellDec(amountTokenSell * (1 - (slippage / 100)));
    } else {
      setAmountBuyDec(0);
      setAmountSellDec(0);
    }
  }, [inputNFT, slippage, amountTokenBuy, amountTokenSell, activeChoice])

  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "BUY") {
        if (data && Number(inputNFT) < Number(data.reserveNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      } else {
        if (Number(inputNFT) <= Number(balanceNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      }
    };
    checkReservesNFT();
    if (Number(amountBuyDec.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
    if (Number(amountSellDec.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenSell(false);
    } else {
      setIsSufficientTokenSell(true);
    }
  }, [inputNFT, activeChoice, account, amountBuyDec, amountSellDec, data]);
  useEffect(() => {
    if (inputNFT === "") {
      setIsSufficientNFT(true);
    }
  }, []);
  useEffect(() => {
    if (inputNFT) {
      setCheckExit(true)
    } else {
      setCheckExit(false)
    }
  }, [inputNFT])

  const handleBuy = () => {
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else if (isSufficientNFT && isSufficientTokenBuy && data.dmlAddress !== null) {
      setIsOpenBuyNFT(true);
    }
  };
  const handleSell = () => {
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else if (isSufficientNFT && isSufficientTokenSell && data.dmlAddress !== null) {
      setIsOpenSellNFT(true);
    }
  };
  const handleSearchNFT = () => {
    setIsOpenSearchNFT(true);
    document.body.style.overflowY = "hidden";
  };
  const handleShowDetail = () => {
    setIsOpenDetail(true);
    document.body.style.overflowY = "hidden";
  };
  const handleSearchToken = () => {
    setIsOpenSearchToken(true);
    document.body.style.overflowY = "hidden";
  };
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  return (
    <div className="py-8 mx-auto max-w-screen-3xl swap">
      <NextSeo {...updateMeta} />
      {(isLoading || isFetching) ? (
        <SkeletonReels />
      ) : isSuccess ? (
        <div className="flex flex-col-reverse gap-x-10 md:flex-row">
          <div className="lg:w-[62%] md:w-2/4 w-full flex flex-col items-center mb-4 ">
            <div className="w-full">
              {data && (
                <ChartKline dmlAddress={data.dmlAddress} />
              )}
            </div>
            <HistorySwap data={data} />
          </div>
          <div className="lg:w-[40%] md:w-2/4 w-full flex-col-reverse lg:flex-col flex">
            <div className="px-2 py-2 border rounded-lg border-dark3">
              <div className="flex justify-between gap-4 mb-2 text-dark1">
                <div className="flex flex-col items-center ">
                  <TabGroups
                    choices={["BUY", "SELL"]}
                    activeChoice={activeChoice}
                    onChoiceChange={handleChoiceChange}
                  />
                </div>
                <div className="flex items-center gap-x-2">
                  {data.dmlAddress ? (
                    <a
                      href={`https://goerli.explorer.zksync.io/address/${data.dmlAddress}`}
                      target="_blank"
                      className="flex justify-end font-medium transition-all duration-150 ease-linear text-dark2 group"
                    >
                      <PoolIcon
                        width={24}
                        height={24}
                        className="group-hover:fill-secondary3"
                      />
                      <p className="group-hover:text-secondary3">Pool</p>
                    </a>
                  ) : (
                    <div className="self-end w-10 h-5 mb-2 rounded-full animate-pulse bg-slate-200"></div>
                  )}
                  <div onClick={() => setIsOpenSetting(true)}>
                    <AiFillSetting className="w-5 h-5 cursor-pointer hover:rotate-90 hover:fill-secondary5" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  <div className="flex text-xl text-dark1">
                    {symbolToken && isSuccess ? (
                      <div className="relative flex items-center">
                        {data.metadata?.symbol ? (
                          <div className="max-w-[96px]">
                            <ModalDocument data={data.metadata?.symbol} />
                          </div>
                        ) : (
                          <span>{idNFT}</span>
                        )}
                        <span className="block overflow-hidden leading-4">/</span>
                        <span>{symbolToken}</span>
                      </div>
                    ) : (
                      <div className="w-20 h-5 rounded-full animate-pulse bg-slate-200"></div>
                    )}
                    <span className="ml-1">
                      <ActiveIcon
                        width={24}
                        height={24}
                        className={
                          data.dmlAddress ===
                            null
                            ? "fill-red"
                            : ""
                        }
                      />
                    </span>
                  </div>
                  {account && activeChoice === "BUY" && (
                    <div className="flex items-center text-secondary3">
                      Balance:{formatNumber(balanceToken)}
                      <span className="mb-1 ml-1">
                        <EtherIcon width={16} height={16} className="fill-secondary4" />
                      </span>
                    </div>
                  )}
                  {account && activeChoice === "SELL" && (
                    <p className="text-secondary3">
                      Balance:{formatNumber(balanceNFT)} NFT
                    </p>
                  )}
                </div>
                <div className="">
                  {activeChoice === "BUY" && (
                    <div className="flex items-center text-lg font-semibold lg:text-3xl text-secondary3">
                      {inputNFT ? (
                        <FormatNumber number={divideByDecimal(amountTokenBuy.toString(), data.tokenDecimals)} />
                      ) : (
                        <span>0</span>
                      )}
                      <span className="mb-1 ml-2">
                        <EtherIcon width={20} height={20} className="fill-secondary4" />
                      </span>
                    </div>
                  )}
                  {activeChoice === "SELL" && (
                    <div className="flex items-center text-lg font-semibold lg:text-3xl text-secondary3">
                      {inputNFT ? (
                        <FormatNumber number={divideByDecimal(amountTokenSell.toString(), data.tokenDecimals)} />
                      ) : (
                        <span>0</span>
                      )}
                      <span className="mb-1 ml-2">
                        <EtherIcon width={20} height={20} className="fill-secondary4" />
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <form className="mt-1">
                <div>
                  {data.reserveNFT ? (
                    <p className="mb-1 text-dark3">
                      Reverse NFT:{formatNumber(data.reserveNFT)}
                    </p>
                  ) : (
                    <div className="w-24 h-5 mb-4 rounded-full animate-pulse bg-slate-200"></div>
                  )}
                  <div className="relative">
                    <input
                      type="number"
                      name="amountNFT"
                      id="amountNFT"
                      placeholder="Input amount NFT"
                      className={
                        showRequiredMessage
                          ? "w-full py-2 pl-2 mb-2 rounded-lg border-2 border-red"
                          : styles.inputItem
                      }
                      value={inputNFT}
                      onChange={(e) => {
                        setInputNFT(e.target.value);
                        setShowRequiredMessage(false);
                        setCheckExit(true);
                      }}
                    />
                    <div
                      className="absolute px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                      onClick={handleSearchNFT}
                    >
                      <div className="w-16 text-center">
                        <h2 className="truncate">{data.metadata?.symbol}</h2>
                      </div>
                    </div>
                  </div>
                  {data.dmlAddress !== null &&
                    !isSufficientNFT &&
                    balanceNFT &&
                    data.reserveNFT &&
                    account && (
                      <p
                        className="mt-0 mb-2 ml-3 text-xs text-red"
                        key="NFTbalance"
                      >
                        Insufficient NFT balance
                      </p>
                    )}
                  {data.dmlAddress !== null &&
                    ((!isSufficientTokenBuy &&
                      activeChoice === "BUY" &&
                      account &&
                      data.reserveToken) ||
                      (!isSufficientTokenSell &&
                        activeChoice === "SELL" &&
                        account &&
                        data.reserveToken)) && (
                      <p
                        className="mt-0 mb-2 ml-3 text-xs text-red"
                        key="Tokenbalance"
                      >
                        Insufficient Token balance
                      </p>
                    )}
                  {data.dmlAddress === null && (
                    <p className="mt-0 mb-2 ml-3 text-xs text-red">
                      DML Token doesn't exist yet
                    </p>
                  )}
                  {showRequiredMessage && (
                    <p
                      className="mt-0 mb-2 ml-3 text-xs text-red"
                      key="emptyNFT"
                    >
                      Required
                    </p>
                  )}
                </div>

                <div className="">
                  {data.reserveToken ? (
                    <div className="flex mb-1 text-dark3">
                      <p>Reverse Token:</p>
                      <FormatNumber number={data.reserveToken} />
                    </div>
                  ) : (
                    <div className="self-end w-24 h-5 mb-4 rounded-full animate-pulse bg-slate-200"></div>
                  )}
                  <div className="relative">
                    {activeChoice === "BUY" ? (
                      <div className={styles.inputItem}>
                        <FormatNumber number={divideByDecimal(amountTokenBuy.toString(), data.tokenDecimals)} />
                      </div>
                    ) : (
                      <div className={styles.inputItem}>
                        <FormatNumber number={divideByDecimal(amountTokenSell.toString(), data.tokenDecimals)} />
                      </div>
                    )}
                    <div
                      className="absolute px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                      onClick={handleSearchToken}
                    >
                      {symbolToken}
                    </div>
                  </div>
                </div>
              </form>
              {(inputNFT && activeChoice === "BUY") ? (
                !isLoadingBuy ? (
                  Math.floor(amountBuyDec) === 0 ? (
                    <p className="mt-0 mb-2 ml-3 text-xs text-red">
                      Can't buy
                    </p>
                  ) : (
                    null
                  )
                ) : (
                  <BiLoaderAlt className="animate-spin text-secondary5" />
                )
              ) : null}
              {(inputNFT && activeChoice === "SELL") ? (
                !isLoadingSell ? (
                  Math.floor(amountSellDec) === 0 ? (
                    <p className="mt-0 mb-2 ml-3 text-xs text-red">
                      Can't sell
                    </p>
                  ) : (
                    null
                  )
                ) : (
                  <BiLoaderAlt className="animate-spin text-secondary5" />
                )
              ) : null}
              <div className="flex justify-center w-full">
                {isApprovedNFT && activeChoice === "BUY" && account && (
                  <button
                    type="button"
                    className="py-2 w-[144px] bg-green rounded-lg text-sm text-white"
                    onClick={handleBuy}
                  >
                    BUY NFT
                  </button>
                )}
                {isApprovedNFT && activeChoice === "SELL" && account && (
                  <button
                    type="button"
                    className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
                    onClick={handleSell}
                  >
                    SELL NFT
                  </button>
                )}
                {!isApprovedNFT && account && (
                  <Button
                    className="w-[126px] py-2"
                    primary
                    onClick={() =>
                      handleApproveNFT(
                        account,
                        wallet,
                        nftAddress,
                        setIsOpen,
                        setIsOpenTransaction,
                        routerAddress
                      )
                    }
                  >
                    APPROVE NFT
                  </Button>
                )}
                {
                  !account && (
                    <Button
                      className="w-[144px] py-2"
                      primary
                      onClick={handleOpen}
                    >
                      CONNECT WALLET
                    </Button>
                  )
                }
              </div>
            </div>
            {/* <div className="py-1 mt-4 overflow-hidden border rounded-lg border-dark3">
              {isLoadingChart ? (
                <div className="h-[355px]">
                  <ChartLoading />
                </div>
              ) : dataChart && dataChart?.data?.length > 0 ? (
                <div className="">
                  <ChartSwap dataChart={dataChart?.data} />
                </div>
              ) : (
                <div className="h-[355px]">
                  <ChartNoTransfers />
                </div>
              )}
            </div> */}
            <div className="flex flex-col justify-center mt-6 max-w-[500px] max-h-[500px] h-[500px]">
              <MediaNFT data={data} isControls={true} />
              <p
                className="mx-auto mt-1 cursor-pointer text-secondary5 hover:text-secondary3"
                onClick={handleShowDetail}
              >
                See detail
              </p>
            </div>
          </div>
        </div>
      ) : (
        <SkeletonReels />
      )}
      <ModalSearchNFT
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
      />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {data?.metadata && (
        <ModalDetail
          nameNFT={data.metadata.name}
          symbolNFT={data.metadata.symbol}
          category={data.metadata.category}
          attributes={data.metadata.attributes}
          description={data.metadata.description}
          setIsOpenDetail={setIsOpenDetail}
          uri={data.uri}
          isOpenDetail={isOpenDetail}
        />
      )}
      <ModalSearchToken
        setIsOpenSearchToken={setIsOpenSearchToken}
        isOpenSearchToken={isOpenSearchToken}
      />
      {data && account && (
        <ModalBuyNFT isOpenBuyNFT={isOpenBuyNFT} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} tokenAddress={tokenAddress} nftAddress={nftAddress} idNFT={idNFT} data={data} setIsOpenBuyNFT={setIsOpenBuyNFT} inputNFT={inputNFT} symbolToken={symbolToken} setInputNFT={setInputNFT} />
      )}
      {data && account && (
        <ModalSellNFT isOpenSellNFT={isOpenSellNFT} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} tokenAddress={tokenAddress} nftAddress={nftAddress} idNFT={idNFT} data={data} setIsOpenSellNFT={setIsOpenSellNFT} inputNFT={inputNFT} symbolToken={symbolToken} setInputNFT={setInputNFT} />
      )}
      <ModalSetting isOpenSetting={isOpenSetting} setIsOpenSetting={setIsOpenSetting} />
      <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
      {/* <ModalSuccess isOpenSuccess={true} setIsOpenSuccess={setIsOpen} type="Buy NFT Success" transactionHash="123"/> */}
      {/* <ModalError isOpenError={true} setIsOpenError={setIsOpen} type="Buy NFT" transactionHash="123"/> */}
    </div>
  );
};

export default Swap;
