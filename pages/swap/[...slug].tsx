import abiErc1155 from "@/abi/abiErc1155.json";
import abiErc20 from "@/abi/abiErc20.json";
import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import { ChartLoading } from "@/components/Charts";
import ChartNoTransfers from "@/components/Charts/ChartNoTransfers";
import ChartSwap from "@/components/Charts/ChartSwap";
import { ActiveIcon, PoolIcon } from "@/components/Icons";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import { ModalSearchToken } from "@/components/Modal/ModalSearchToken";
import { ModalTransation } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { TabGroups } from "@/components/NavChoice";
import TransitionURL from "@/components/Toast/TransionURL";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useFetchReservesDML from "@/hooks/useFetchReservesDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { swapAPI } from "@/libs/service";
import approveNFT from "@/libs/utils/approveNFT";
import approveToken from "@/libs/utils/approveToken";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
import { getBuyPrice, getSellPrice } from "@/libs/utils/getPrice";
import { SkeletonReels } from "@/components/Skeleton";
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
  const [isOpenSearchToken, setIsOpenSearchToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
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
  const { account, wallet, chainId, demask, tokenDefault } = useContext(AccountContext);
  const [checkApproveNFT, setCheckApproveNFT] = useState<boolean>(false);
  const [checkApproveToken, setCheckApproveToken] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [amountBuy, setAmountBuy] = useState<number>(0);
  const [amountSell, setAmountSell] = useState<number>(0);
  const [amountBuyDec, setAmountBuyDec] = useState<number>(0);
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformationToken(account, tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction);
  console.log(balanceToken);

  const { slug } = router.query;
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["swap", idNFT, nftAddress, chainId, tokenAddress],
    queryFn: async () => {
      console.log("123test");
      console.log(idNFT);
      console.log(tokenAddress);

      const res = await swapAPI(tokenAddress.toLocaleLowerCase(), chainId, nftAddress.toLowerCase(), idNFT);
      return res;
    },
    keepPreviousData: true,
  });
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

  useEffect(() => {
    setTimeout(() => {
      console.log('time');

      refetch();
    }, 5000);

    // return () => clearTimeout(timer);
  }, [isOpenTransaction]);
  const balanceNFT = useNFTBalance(account, nftAddress, idNFT, wallet, isOpenTransaction);
  console.log(data);

  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(account, wallet, nftAddress, routerAddress);
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, nftAddress, wallet, checkApproveNFT]);
  console.log(isApprovedNFT);

  const handleApproveNFT = async () => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftAddress, abiErc1155, signer);
      try {
        const result = await contract.setApprovalForAll(routerAddress, true);
        await provider.waitForTransaction(result.hash);
        setCheckApproveNFT(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  useEffect(() => {
    if (inputNFT && data) {
      setAmountBuy(getBuyPrice(data.reserveNFT, data.reserveToken, +(inputNFT)))
      setAmountSell(getSellPrice(data.reserveNFT, data.reserveToken, +(inputNFT)))
      setAmountBuyDec(getBuyPrice(data.reserveNFT, data.reserveTokenDecimals, Number(inputNFT)) * Number(inputNFT) * 1.05)
      setAmountSellDec(getSellPrice(data.reserveNFT, data.reserveTokenDecimals, +(inputNFT)) * Number(inputNFT) * 0.95)
    } else {
      setAmountBuy(0);
      setAmountSell(0);
    }
  }, [inputNFT, data])
  // console.log(amountSell);
  // console.log(amountSellDec);
  // console.log(allowanceToken);
  // console.log(amountBuyDec);

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
    const checkApproveToken = async () => {
      if (tokenAddress !== nativeAddress) {
        if (Number(allowanceToken) < Number(amountBuyDec)) {
          setIsApprovedToken(false);
        } else {
          setIsApprovedToken(true);
        }
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, data, inputNFT, amountBuyDec, checkApproveToken, tokenAddress, allowanceToken]);

  const handleApproveToken = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (account && wallet) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
      try {
        const result = await contract.approve(routerAddress, amountBuyDec.toFixed(0));
        await provider.waitForTransaction(result.hash);
        setCheckApproveToken(true);
        setInputNFT("");
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  const handleBuyNFT = async (e: any) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else {
      setShowRequiredMessage(false);
      if (
        isSufficientNFT &&
        isSufficientTokenBuy &&
        Number(data.reserveNFT) > 1 &&
        Number(data.reserveToken) > 0 &&
        Math.floor(amountBuyDec) > 0
      ) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);
        try {
          let result;
          setIsOpenTransaction(true);
          if (tokenAddress === nativeAddress) {

            result = await contract.buyETH(
              nftAddress,
              idNFT,
              inputNFT,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000, value: Math.floor(amountBuyDec).toString() }
            );
          } else {
            result = await contract.buy(
              tokenAddress,
              nftAddress,
              idNFT,
              inputNFT,
              Math.floor(amountBuyDec).toString(),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          }
          await provider.waitForTransaction(result.hash);
          setIsOpenTransaction(false);
          toast.success(
            <TransitionURL type={"Buy NFT"} transactionHash={result.hash} />,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );

          setInputNFT("");
        } catch (error) {
          setIsOpenTransaction(false);
          console.error(error);
        }
      }
    }
  };
  const handleSellNFT = async (e: any) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (inputNFT === "") {
      setShowRequiredMessage(true);
    } else {
      setShowRequiredMessage(false);
      if (
        isSufficientNFT &&
        isSufficientTokenSell &&
        Number(data.reserveNFT) > 0 &&
        Number(data.reserveToken) > 0 &&
        Math.floor(amountSellDec) > 0
      ) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);


        try {
          let result;
          setIsOpenTransaction(true);
          if (tokenAddress === nativeAddress) {
            result = await contract.sellETH(
              nftAddress,
              idNFT,
              inputNFT,
              Math.floor(amountSellDec).toString(),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          } else {
            result = await contract.sell(
              tokenAddress,
              nftAddress,
              idNFT,
              inputNFT,
              Math.floor(amountSellDec).toString(),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          }
          await provider.waitForTransaction(result.hash);
          setIsOpenTransaction(false);
          toast.success(
            <TransitionURL type={"Sell NFT"} transactionHash={result.hash} />,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          setInputNFT("");
        } catch (error) {
          setIsOpenTransaction(false);
          console.error(error);
        }
      }
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
  return (
    <div className="py-8 mx-auto swap max-w-[1592px]">
      <NextSeo {...updateMeta} />
      {isSuccess && (
        <div className="flex flex-col gap-x-10 lg:flex-row md:flex-row">
          <div className="lg:w-[60%] md:w-2/4 w-full flex flex-col max-w-[760px] max-h-[760px] items-center mb-4 ">
            <>
              {data?.metadata && (
                <div className="flex flex-col items-center">
                  <div className="">
                    {data.metadata?.image && (
                      <Image
                        src={data.metadata.image}
                        alt="test"
                        width={680}
                        height={576}
                        sizes="(max-width: 770px) 100vw"
                        className="w-full rounded-lg lg:max-h-[80vh]"
                        style={{
                          objectFit: "contain",
                        }}
                      />
                    )}
                    {!data.metadata?.image && data.metadata?.animation_url && (
                      <video
                        src={data.metadata.animation_url}
                        autoPlay
                        loop
                        muted
                        controls
                        className="w-full rounded-lg lg:h-[calc(100vh-326px)]"
                      />
                    )}
                    {data.metadata?.image && data.metadata?.animation_url && (
                      <audio
                        autoPlay
                        loop
                        muted
                        controls
                        src={data.metadata.animation_url}
                        className="mt-4 mb-2"
                      >
                        Your browser does not support the
                        <code>audio</code> element.
                      </audio>
                    )}
                  </div>
                  <p
                    className="mt-1 text-sm cursor-pointer text-secondary5 hover:text-secondary3"
                    onClick={handleShowDetail}
                  >
                    See detail
                  </p>
                </div>
              )}</>

          </div>
          <div className="lg:w-[40%] md:w-2/4 w-full">
            <div className="px-2 py-2 border rounded-lg border-dark3">
              <div className="flex justify-between gap-4 mb-2 text-dark1">
                <div className="flex flex-col items-center ">
                  <TabGroups
                    choices={["BUY", "SELL"]}
                    activeChoice={activeChoice}
                    onChoiceChange={handleChoiceChange}
                  />
                </div>
                <div className="flex flex-col ">
                  {data.dmlAddress ? (
                    <a
                      href={`https://mumbai.polygonscan.com/address/${data.dmlAddress}`}
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
                    <p className="text-secondary3">
                      Balance:{formatNumber(balanceToken)} {symbolToken}
                    </p>
                  )}
                  {account && activeChoice === "SELL" && (
                    <p className="text-secondary3">
                      Balance:{formatNumber(balanceNFT)} NFT
                    </p>
                  )}
                </div>
                <div className="">
                  {activeChoice === "BUY" && (
                    <div className="text-lg font-semibold lg:text-3xl text-secondary3">
                      {inputNFT ? (
                        <span>
                          {formatNumber(
                            amountBuy.toString()
                          )}
                        </span>
                      ) : (
                        <span>0</span>
                      )}
                      <span className="ml-2">{symbolToken}</span>
                    </div>
                  )}
                  {activeChoice === "SELL" && (
                    <div className="text-4xl text-secondary3">
                      {inputNFT ? (
                        <span>
                          {formatNumber(
                            amountSell.toString()
                          )}
                        </span>
                      ) : (
                        <span>0</span>
                      )}
                      <span className="ml-2">{symbolToken}</span>
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
                    account &&
                    data.reserveNFT && (
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
                      data.reserveToken &&
                      account) ||
                      (!isSufficientTokenSell &&
                        activeChoice === "SELL" &&
                        data.reserveToken &&
                        account)) && (
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
                    <p className="mb-1 text-dark3">
                      Reverse Token:
                      {formatNumber(
                        divideByDecimal(data.reserveToken, data.tokenDecimals)
                      )}
                    </p>
                  ) : (
                    <div className="self-end w-24 h-5 mb-4 rounded-full animate-pulse bg-slate-200"></div>
                  )}
                  <div className="relative">
                    {activeChoice === "BUY" ? (
                      <div className={styles.inputItem}>
                        {formatNumber(
                          amountBuy.toString()
                        )}
                      </div>
                    ) : (
                      <div className={styles.inputItem}>
                        {formatNumber(
                          amountSell.toFixed()
                        )}
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
              {activeChoice === "BUY" && Math.floor(amountBuyDec) === 0 && inputNFT && (
                  <p className="mt-0 mb-2 ml-3 text-xs text-red">
                    Can't buy
                  </p>
                )}
                {activeChoice === "SELL" && Math.floor(amountSellDec) === 0 && inputNFT && (
                  <p className="mt-0 mb-2 ml-3 text-xs text-red">
                    Can't sell
                  </p>
                )}
              <div className="flex justify-center w-full">
                {isApprovedToken && activeChoice === "BUY" && (
                  <button
                    type="button"
                    className="py-2 w-[144px] bg-green rounded-lg text-sm text-white"
                    onClick={handleBuyNFT}
                  >
                    BUY NFT
                  </button>
                )}
                {isApprovedNFT && activeChoice === "SELL" && (
                  <button
                    type="button"
                    className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
                    onClick={handleSellNFT}
                  >
                    SELL NFT
                  </button>
                )}
                {!isApprovedNFT && activeChoice === "SELL" && (
                  <Button
                    className="w-[126px] py-2"
                    primary
                    onClick={handleApproveNFT}
                  >
                    APPROVE NFT
                  </Button>
                )}
                {!isApprovedToken &&
                  tokenAddress !== nativeAddress &&
                  activeChoice === "BUY" && (
                    <Button
                      className="w-[126px] py-2"
                      type="button"
                      primary
                      onClick={handleApproveToken}
                    >
                      APPROVE TOKEN
                    </Button>
                  )}
              </div>
            </div>
            <div className="py-1 mt-4 overflow-hidden border rounded-lg border-dark3">
              {isLoading ? (
                <div className="h-[355px]">
                  <ChartLoading />
                </div>
              ) : data && data?.mergedResults?.length > 0 ? (
                <div className="">
                  <ChartSwap dataChart={data.mergedResults} />
                </div>
              ) : (
                <div className="h-[355px]">
                  <ChartNoTransfers />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isLoading && !isSuccess && (
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
      <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
      <ToastContainer />
    </div>
  );
};

export default Swap;
