import { Button } from "@/components/Buttons";
import ChartTradingViewSwap from "@/components/Charts/ChartTradingViewSwap";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { ActiveIcon, BackIcon, EtherIcon, NFTIcon, PoolIcon, RefetchIcon, SettingIcon } from "@/components/Icons";
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
import { useCallback, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import { SEO } from '../../next-seo.config';
import Tippy from "@tippyjs/react";
const styles = {
  inputItem: "w-full py-2 pl-2 mb-2 border rounded-lg border-dark3 block placeholder:text-sm",
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
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const { account, wallet, chainId, demask, tokenDefault, slippage, txDeadline } = useContext(AccountContext);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const [royaltiesFeeBuy, setRoyaltiesFeeBuy] = useState<number>(0);
  const [royaltiesFeeSell, setRoyaltiesFeeSell] = useState<number>(0);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>('');
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
  usePreventUserFromErasingContent(checkExit);

  useEffect(() => {
    if (slug) {
      setNftAddress(slug[0]);
      setTokenAddress(slug[1]);
      setIdNFT(slug[2]);
      setInputNFT("");
    }
  }, [slug]);

  // useEffect(() => {
  //   console.log('123yyy');
    
  //   if (router.query.chain === '280') {
  //     router.replace('0x59620b99146C56785b067f84237fa80D89588228/0x20b28b1e4665fff290650586ad76e977eab90c5d/581234443?chain=280');
  //   } else {
  //     router.replace('0x6c216DFAFc944C46582a34D9f87532D00080C61a/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6/22451713?chain=5');
  //   }
  // }, [router.query.chain, router.isReady]);
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

  useEffect(() => {
    if (inputNFT && data && amountTokenBuy && amountTokenSell) {
      setAmountBuyDec(amountTokenBuy * (1 + (slippage / 100)) + amountTokenBuy * Number(data.royaltyFee) / 100);
      setAmountSellDec(amountTokenSell * (1 - (slippage / 100)) - amountTokenSell * Number(data.royaltyFee) / 100);
      setTotalProcessBuy(Number(amountTokenBuy) + (amountTokenBuy * Number(data.royaltyFee) / 100));
      setTotalProcessSell(amountTokenSell - amountTokenSell * Number(data.royaltyFee) / 100);
      setRoyaltiesFeeBuy(amountTokenBuy * Number(data.royaltyFee) / 100);
      setRoyaltiesFeeSell(amountTokenSell * Number(data.royaltyFee) / 100);
    } else {
      setAmountBuyDec(0);
      setAmountSellDec(0);
      setRoyaltiesFeeBuy(0);
      setRoyaltiesFeeSell(0);
      setTotalProcessBuy(0);
      setTotalProcessSell(0);
    }
  }, [inputNFT, slippage, amountTokenBuy, amountTokenSell, activeChoice])

  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "BUY") {
        if (data && Number(inputNFT) <= Number(data.reserveNFT)) {
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
    setInputNFT('');
    setActiveChoiceNFT('');
  }, [activeChoice])
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
    else if (isSufficientNFT && isSufficientTokenBuy && data.dmlAddress !== null && Math.floor(amountBuyDec) !== 0) {
      setIsOpenBuyNFT(true);
      document.body.style.overflowY = "hidden";
    }
  };
  const handleSell = () => {
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else if (isSufficientNFT && isSufficientTokenSell && data.dmlAddress !== null && Math.floor(amountSellDec) !== 0) {
      setIsOpenSellNFT(true);
      document.body.style.overflowY = "hidden";
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
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const actions = [
    { icon: <RefetchIcon width={24} height={24} className="cursor-pointer hover:fill-secondary5" />, content: 'Refetch', onClick: () => refetch() },
    { icon: <PoolIcon width={24} height={24} className="group-hover:fill-secondary3" />, content: 'Pool', link: `/add/${nftAddress}/${tokenAddress}/${idNFT}` },
    { icon: <SettingIcon width={24} height={24} className="cursor-pointer hover:rotate-90 hover:fill-secondary5" />, content: 'Setting', onClick: () => setIsOpenSetting(true) },
  ];
  const activeNFTPercent = [
    { text: '25%', percent: 0.25 },
    { text: '50%', percent: 0.5 },
    { text: '75%', percent: 0.75 },
    { text: 'MAX', percent: 1 },]
  return (
    <div className="py-8 mx-auto max-w-screen-3xl swap">
      <NextSeo {...updateMeta} />
      {(isLoading || isFetching) ? (
        <SkeletonReels />
      ) : isSuccess ? (
        <div className="min-h-[80vh]">
          <div className="flex items-center mb-6 text-xl font-semibold gap-x-2 text-dark0">
            <div onClick={() => router.back()}>
              <BackIcon width={30} height={30} className="cursor-pointer hover:fill-secondary5" />
            </div>
            <div className="w-[30px] h-[30px]">
              <MediaNFT data={data} isControls={false} />
            </div>
            <p>{data?.metadata?.name}</p>
            <p>({data?.metadata?.symbol}/ETH)</p>
          </div>
          <div className="flex flex-col-reverse gap-x-10 md:flex-row">
            <div className="lg:w-[62%] md:w-2/4 w-full flex flex-col items-center mb-4 ">
              <div className="w-full">
                {data && (
                  <div>
                    <ChartTradingViewSwap dataSwap={data} />
                  </div>
                )}
              </div>
              <HistorySwap data={data} />
            </div>
            <div className="lg:w-[40%] md:w-2/4 w-full h-fit flex gap-y-1 lg:gap-y-12">
              <div className="w-full p-6 border rounded-lg shadow-home">
                <div className="flex justify-between gap-4 mb-2 text-dark1">
                  <div className="flex flex-col items-center ">
                    <TabGroups
                      choices={["BUY", "SELL"]}
                      activeChoice={activeChoice}
                      onChoiceChange={handleChoiceChange}
                    />
                  </div>
                  <div className="flex items-center gap-x-2">
                    {actions.map((action, index) => (
                      <Tippy key={index} content={<div className="text-xs">{action.content}</div>} theme='dark' placement="bottom">
                        {action.link ? (
                          <Link href={action.link} className="group">
                            {action.icon}
                          </Link>
                        ) : (
                          <div onClick={action.onClick}>{action.icon}</div>
                        )}
                      </Tippy>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center my-6">
                  <div className="mx-auto w-40 3xl:w-[320px] ">
                    <MediaNFT data={data} isControls={true} />
                  </div>
                  <p
                    className="mx-auto mt-1 text-xs cursor-pointer text-dark3 hover:text-secondary3"
                    onClick={handleShowDetail}
                  >
                    Show detail
                  </p>
                </div>
                <form className="mt-5">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        {account && activeChoice === "BUY" && (
                          <div className="flex items-center text-sm text-dark1">
                            <p className="mr-1">Your balance:</p>
                            {formatNumber(balanceToken)}
                            <EtherIcon width={16} height={16} className="fill-dark2" />
                          </div>
                        )}
                        {account && activeChoice === "SELL" && (
                          <div className="flex items-center text-sm text-dark1">
                            <p className="mr-1">Your balance:</p>
                            <p>{formatNumber(balanceNFT)}</p>
                            <NFTIcon width={24} height={24} className="fill-dark1 ml-[2px]" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-dark1">
                        <div className="flex items-center mr-2">
                          <span className="mr-1">LP:</span>
                          <FormatNumber number={data.reserveNFT} />
                          <NFTIcon width={24} height={24} className="fill-dark1 ml-[2px]" />
                        </div>
                        <FormatNumber number={data.reserveToken} />
                        <span><EtherIcon width={20} height={20} className="fill-dark1 ml-[-1px]" /></span>
                      </div>
                    </div>
                    <div className={`relative p-2 border rounded-lg border-dark3 ${showRequiredMessage && 'border-red'}`}>
                      <div className="relative">
                        <input
                          type="number"
                          name="amountNFT"
                          id="amountNFT"
                          autoComplete="off"
                          placeholder="Input amount NFT"
                          className="font-semibold border-none outline-none text-lg text-dark3 placeholder:font-semibold"
                          value={inputNFT}
                          onChange={(e) => {
                            setInputNFT(e.target.value);
                            setShowRequiredMessage(false);
                            setActiveChoiceNFT('');
                            setCheckExit(true);
                          }}
                        />
                        <div
                          className="absolute min-h-[80%] px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                          onClick={handleSearchNFT}
                        >
                          <div className="w-16 text-center">
                            <h2 className="truncate">{data.metadata?.symbol ? data.metadata?.symbol : data.metadata?.name}</h2>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end mt-8">
                        {activeNFTPercent.map((item, index) => (
                          <button type="button" className={`ml-3 text-[12px] font-semibold text-dark3 p-1 border-dark3 border rounded-lg ${item.text === activeChoiceNFT && 'bg-secondary5 text-white'}`} key={index}
                            onClick={() => {
                              if (activeChoice === "BUY") {
                                setInputNFT((Math.floor(item.percent * data.reserveNFT)).toString())
                              } else {
                                setInputNFT((Math.floor(item.percent * Number(balanceNFT))).toString())
                              }
                              setShowRequiredMessage(false);
                              setActiveChoiceNFT(item.text);
                            }}
                          >{item.text}</button>
                        ))}
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

                  <div className="mt-4">
                    <div className="flex justify-between mb-4">
                      <div className="text-sm text-dark1">
                        Total Proceeds:
                      </div>
                      <div className="">
                        <label htmlFor="data.royaltyFee" className=' text-dark1'>
                          <div className="flex text-sm">
                            <p className="mr-1">Royalties Fee: </p>
                            {activeChoice === "BUY" ? (
                              <FormatNumber number={(royaltiesFeeBuy / 1e18).toString()} />
                            ) : (
                              <FormatNumber number={(royaltiesFeeSell / 1e18).toString()} />
                            )}
                            <p>({data?.royaltyFee}%)</p>
                          </div>
                        </label>
                      </div>
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
                  {activeChoice === "BUY" && account && (
                    <button
                      type="button"
                      className="py-2 w-[144px] bg-green hover:text-green hover:bg-white hover:border-green border rounded-lg text-sm text-white"
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
            </div>
          </div>
        </div>
      ) : (
        <SkeletonReels />
      )}
      <ModalSearchNFTSwap
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
        setActiveChoiceNFT={setActiveChoiceNFT}
      />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {data?.metadata && (
        <ModalDetail
          data={data}
          idNFT={idNFT}
          nftAddress={nftAddress}
          setIsOpenDetail={setIsOpenDetail}
          isOpenDetail={isOpenDetail}
        />
      )}
      <ModalSearchToken
        setIsOpenSearchToken={setIsOpenSearchToken}
        isOpenSearchToken={isOpenSearchToken}
      />
      {data && account && (
        <ModalBuyNFT isOpenBuyNFT={isOpenBuyNFT} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} tokenAddress={tokenAddress} nftAddress={nftAddress} idNFT={idNFT} data={data} setIsOpenBuyNFT={setIsOpenBuyNFT} inputNFT={inputNFT} setInputNFT={setInputNFT} setHash={setHash} setIsOpenSuccess={setIsOpenSuccessBuy} setIsOpenError={setIsOpenErrorBuy} />
      )}
      {data && account && (
        <ModalSellNFT isOpenSellNFT={isOpenSellNFT} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} tokenAddress={tokenAddress} nftAddress={nftAddress} idNFT={idNFT} data={data} setIsOpenSellNFT={setIsOpenSellNFT} inputNFT={inputNFT} setInputNFT={setInputNFT} setHash={setHash} setIsOpenSuccess={setIsOpenSuccessSell} setIsOpenError={setIsOpenErrorSell} />
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
