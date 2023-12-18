import { Button } from "@/components/Buttons";
import ChartTradingViewSwap from "@/components/Charts/ChartTradingViewSwap";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { ActiveIcon, BackIcon, EtherIcon, PoolIcon, SettingIcon } from "@/components/Icons";
import ModalBuyNFT from "@/components/Modal/ModalBuyNFT";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { ModalSearchNFTSwap } from "@/components/Modal/ModalSearchNFT";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import ModalSetting from "@/components/Modal/ModalSetting";
import { ModalError, ModalSuccess, ModalTransation } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { TabGroups } from "@/components/NavChoice";
import { SkeletonReels } from "@/components/Skeleton";
import HistorySwap from "@/components/Swap/History";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationToken from "@/hooks/useInformationToken";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import useRoyalty from "@/hooks/useRoyalty";
import { swapAPI } from "@/libs/service";
import approveNFT from "@/libs/utils/approveNFT";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import { SEO } from '../../next-seo.config';
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
  const [totalProcessBuy, setTotalProcessBuy] = useState<number>(0);
  const [totalProcessSell, setTotalProcessSell] = useState<number>(0);
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [isOpenSearchToken, setIsOpenSearchToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenBuyNFT, setIsOpenBuyNFT] = useState<boolean>(false);
  const [isOpenSellNFT, setIsOpenSellNFT] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [isOpenSuccessSell, setIsOpenSuccessSell] = useState<boolean>(false);
  const [isOpenErrorSell, setIsOpenErrorSell] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const [isSufficientTokenSell, setIsSufficientTokenSell] =
    useState<boolean>(false);
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [showRequiredRoyalties, setShowRequiredRoyalties] = useState(false);
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const { account, wallet, chainId, demask, tokenDefault, slippage, txDeadline } = useContext(AccountContext);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const [royaltiesPercent, setRoyaltiesPercent] = useState<number | null>(null);
  const [royaltiesFeeBuy, setRoyaltiesFeeBuy] = useState<number>(0);
  const [royaltiesFeeSell, setRoyaltiesFeeSell] = useState<number>(0);
  const [validFee, setValidFee] = useState<boolean>(false);
  const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction);
  const royaltyView = useRoyalty(account, nftAddress, idNFT, wallet, '5', demask.ROYALTY);

  const { slug } = router.query;
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["swap", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      const res = await swapAPI(tokenAddress.toLocaleLowerCase(), chainId, nftAddress.toLowerCase(), idNFT);
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

  const { amountTokenBuy, feeTradingBuy, isLoadingBuy } = useAmountInMax(inputNFT, data?.dmlAddress, tokenAddress, nftAddress, idNFT, wallet, account, rpc, routerAddress, true);
  const { amountTokenSell, isLoadingSell, feeTradingSell } = useAmountOutMin(inputNFT, data?.dmlAddress, tokenAddress, nftAddress, idNFT, wallet, account, rpc, routerAddress, true);
  console.log(data);
  
  useEffect(() => {
    if (inputNFT && data && amountTokenBuy && amountTokenSell && royaltiesPercent) {
      setAmountBuyDec(amountTokenBuy * (1 + (slippage / 100)) + amountTokenBuy * Number(royaltiesPercent) / 100);
      setAmountSellDec(amountTokenSell * (1 - (slippage / 100)) - amountTokenSell * Number(royaltiesPercent) / 100);
      setTotalProcessBuy(Number(amountTokenBuy) + (amountTokenBuy * Number(royaltiesPercent) / 100));
      setTotalProcessSell(amountTokenSell - amountTokenSell * Number(royaltiesPercent) / 100);
      setRoyaltiesFeeBuy(amountTokenBuy * Number(royaltiesPercent) / 100);
      setRoyaltiesFeeSell(amountTokenSell * Number(royaltiesPercent) / 100);
    } else {
      setAmountBuyDec(0);
      setAmountSellDec(0);
      setRoyaltiesFeeBuy(0);
      setRoyaltiesFeeSell(0);
      setTotalProcessBuy(0);
      setTotalProcessSell(0);
    }
  }, [inputNFT, slippage, amountTokenBuy, amountTokenSell, activeChoice, royaltiesPercent])

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
  const handleChangeRoyalFee = (e: any) => {
    if (royaltyView === "0x0000000000000000") {
      setRoyaltiesPercent(0.5);
    } else {
      setRoyaltiesPercent(Number(e.target.value));
    }
    setShowRequiredRoyalties(false);
    setCheckExit(true);
    if (e.target.value < 0.5 || e.target.value > 100) {
      setValidFee(true);
    } else {
      setValidFee(false);
    }
  }
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
    }
    if (royaltiesPercent === 0) {
      setShowRequiredRoyalties(true);
    } else if (isSufficientNFT && isSufficientTokenBuy && data.dmlAddress !== null && Math.floor(amountBuyDec) !== 0) {
      setIsOpenBuyNFT(true);
    }
  };
  const handleSell = () => {
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else if (isSufficientNFT && isSufficientTokenSell && data.dmlAddress !== null && Math.floor(amountSellDec) !== 0) {
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
      <NextSeo
        title={`${data?.metadata?.name}`}
        description={`${data?.metadata?.name}`}
        openGraph={{
          images: [
            {
              url: data?.metadata?.image || "https://demask.infura-ipfs.io/ipfs/QmfAAXAgAWFqkAovUa4u8iwtr4zYCCdqs35Fu3kAt2n4DH",
            },
          ],
        }}
      />
      {(isLoading || isFetching) ? (
        <SkeletonReels />
      ) : isSuccess ? (
        <div>
          <div className="flex mb-6 gap-x-2">
            <div onClick={() => router.back()}>
              <BackIcon width={30} height={30} className="cursor-pointer hover:fill-secondary5" />
            </div>
            <h1 className="text-xl font-semibold text-dark0">Detail Swap</h1>
          </div>
          <div className="flex flex-col-reverse gap-x-10 md:flex-row">
            <div className="lg:w-[62%] md:w-2/4 w-full flex flex-col items-center mb-4 ">
              <div className="w-full">
                {data && (
                  <div>
                    <ChartTradingViewSwap dmlAddress={data.dmlAddress} />
                  </div>
                )}
              </div>
              <HistorySwap data={data} />
            </div>
            <div className="lg:w-[40%] md:w-2/4 w-full flex-col-reverse lg:flex-col flex gap-y-1 lg:gap-y-12">
              <div className="p-6 border rounded-lg shadow-home">
                <div className="flex justify-between gap-4 mb-2 text-dark1">
                  <div className="flex flex-col items-center ">
                    <TabGroups
                      choices={["BUY", "SELL"]}
                      activeChoice={activeChoice}
                      onChoiceChange={handleChoiceChange}
                    />
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Link
                      href={`/add/${nftAddress}/${tokenAddress}/${idNFT}`}
                      className="flex justify-end px-4 py-2 font-medium transition-all duration-150 ease-linear rounded-lg bg-dark4 text-dark2 group"
                    >
                      <PoolIcon
                        width={24}
                        height={24}
                        className="group-hover:fill-secondary3"
                      />
                      <p className="group-hover:text-secondary3">Pool</p>
                    </Link>
                    <div onClick={() => setIsOpenSetting(true)}>
                      <SettingIcon width={20} height={20} className="w-5 h-5 cursor-pointer hover:rotate-90 hover:fill-secondary5" />
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
                      <div className="flex items-center text-dark2">
                        Balance:{formatNumber(balanceToken)}
                        <span className="mb-1 ml-1">
                          <EtherIcon width={16} height={16} className="fill-dark2" />
                        </span>
                      </div>
                    )}
                    {account && activeChoice === "SELL" && (
                      <p className="text-dark2">
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

                <form className="mt-5">
                  <div>
                    <div className="flex justify-between">
                      {data.reserveNFT ? (
                        <p className="mb-1 text-sm text-dark3">
                          Reverse NFT:{formatNumber(data.reserveNFT)}
                        </p>
                      ) : (
                        <div className="w-24 h-5 mb-4 rounded-full animate-pulse bg-slate-200"></div>
                      )}
                      {data.reserveToken ? (
                        <div className="flex mb-1 text-sm text-dark3">
                          <p>Reverse Token:</p>
                          <FormatNumber number={data.reserveToken} />
                        </div>
                      ) : (
                        <div className="self-end w-24 h-5 mb-4 rounded-full animate-pulse bg-slate-200"></div>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        name="amountNFT"
                        id="amountNFT"
                        autoComplete="off"
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
                          <h2 className="truncate">{data.metadata?.symbol ? data.metadata?.symbol : data.metadata?.name}</h2>
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
                    <label htmlFor="royaltiesPercent" className='mb-1 text-dark3'>
                      <div className="flex mb-1 text-sm">Royalties Fee:
                        {activeChoice === "BUY" ? (
                          <FormatNumber number={(royaltiesFeeBuy / 1e18).toString()} />
                        ) : (
                          <FormatNumber number={(royaltiesFeeSell / 1e18).toString()} />
                        )}
                      </div>
                    </label>
                    <div className="relative">
                      <input
                        placeholder="0.5"
                        type="number"
                        id="royaltiesPercent"
                        autoComplete="off"
                        value={royaltiesPercent || ""}
                        className={
                          showRequiredRoyalties
                            ? "w-full py-2 pl-2 mb-2 rounded-lg border-2 border-red"
                            : styles.inputItem
                        }
                        onChange={(e) => handleChangeRoyalFee(e)}
                      />
                      <div
                        className="absolute px-2 py-1 text-sm transition duration-150 ease-out border rounded-lg cursor-pointer text-dark3 bg-dark4 hover:text-white hover:bg-secondary5 active:bg-secondary3 right-1 top-1 border-dark4 "
                      >
                        %
                      </div>
                    </div>
                    {showRequiredRoyalties && (
                      <p
                        className="mt-0 mb-2 ml-3 text-xs text-red"
                        key="emptyRoyalties"
                      >
                        Required
                      </p>
                    )}
                    {validFee && (
                      <p className="mb-2 ml-2 -mt-1 text-xs text-red" key="initial">
                        Royalty fee must be greater than 0.5% and less than or equal to 100%
                      </p>
                    )}
                  </div>
                  <div className="">
                    <div className="mb-1 text-sm text-dark3">
                      Total Proceeds:
                    </div>
                    <div className="relative">
                      {activeChoice === "BUY" ? (
                        <div className='block w-full py-2 pl-2 mb-2 border rounded-lg border-dark4 text-dark1 bg-dark4'>
                          <FormatNumber number={divideByDecimal(totalProcessBuy.toString(), data.tokenDecimals)} />
                        </div>
                      ) : (
                        <div className='block w-full py-2 pl-2 mb-2 border rounded-lg border-dark4 text-dark1 bg-dark4'>
                          <FormatNumber number={divideByDecimal(totalProcessSell.toString(), data.tokenDecimals)} />
                        </div>
                      )}
                      <div
                        className="absolute px-2 py-1 right-1 top-2"
                      >
                        <EtherIcon width={16} height={16} className="fill-dark2" />
                      </div>
                    </div>
                  </div>

                </form>
                {(inputNFT && activeChoice === "BUY") && royaltiesPercent ? (
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
                {(inputNFT && activeChoice === "SELL") && royaltiesPercent ? (
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
                  {activeChoice === "BUY" && account && (
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
                  {!isApprovedNFT && account && activeChoice === "SELL" && (
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
              <div className="flex flex-col justify-center ">
                <MediaNFT data={data} isControls={true} />
                <p
                  className="mx-auto mt-1 mb-5 cursor-pointer text-secondary5 hover:text-secondary3"
                  onClick={handleShowDetail}
                >
                  See detail
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SkeletonReels />
      )}
      <ModalSearchNFTSwap
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
        <ModalBuyNFT isOpenBuyNFT={isOpenBuyNFT} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} tokenAddress={tokenAddress} nftAddress={nftAddress} idNFT={idNFT} data={data} setIsOpenBuyNFT={setIsOpenBuyNFT} inputNFT={inputNFT} symbolToken={symbolToken} setInputNFT={setInputNFT} royaltiesPercent={royaltiesPercent} setHash={setHash} setIsOpenSuccess={setIsOpenSuccessBuy} setIsOpenError={setIsOpenErrorBuy} setRoyaltiesPercent={setRoyaltiesPercent} />
      )}
      {data && account && (
        <ModalSellNFT isOpenSellNFT={isOpenSellNFT} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} tokenAddress={tokenAddress} nftAddress={nftAddress} idNFT={idNFT} data={data} setIsOpenSellNFT={setIsOpenSellNFT} inputNFT={inputNFT} symbolToken={symbolToken} setInputNFT={setInputNFT} royaltiesPercent={royaltiesPercent} setHash={setHash} setIsOpenSuccess={setIsOpenSuccessSell} setIsOpenError={setIsOpenErrorSell} setRoyaltiesPercent={setRoyaltiesPercent} />
      )}
      <ModalSetting isOpenSetting={isOpenSetting} setIsOpenSetting={setIsOpenSetting} />
      <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
      <ModalSuccess isOpenSuccess={isOpenSuccessBuy} transactionHash={hash} type="Buy NFT Success" setIsOpenSuccess={setIsOpenSuccessBuy} />
      <ModalError isOpenError={isOpenErrorBuy} transactionHash={hash} type="Buy NFT Failed" setIsOpenError={setIsOpenErrorBuy} />
      <ModalSuccess isOpenSuccess={isOpenSuccessSell} transactionHash={hash} type="Sell NFT Success" setIsOpenSuccess={setIsOpenSuccessSell} />
      <ModalError isOpenError={isOpenErrorSell} transactionHash={hash} type="Sell NFT Failed" setIsOpenError={setIsOpenErrorSell} />
    </div>
  );
};

export default Swap;
