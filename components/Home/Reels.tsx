import images from "@/public/images";
import Image from "next/image";
import { TwoTab } from "../NavChoice";
import React, { useContext, useEffect, useState } from "react";
import AccountContext from "@/context/AccountContext";
import formatNumber from "@/libs/utils/formatNumer";
import { PoolIcon } from "../Icons";
import { Button } from "../Buttons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { useInView } from "react-intersection-observer";
import { GetServerSideProps } from "next";
import useInformationDML from "@/hooks/useInformationDML";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationToken from "@/hooks/useInformationToken";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { ModalWallet } from "../Modal/ModalWallet";
import { amountNFT } from "@/libs/constants";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useAmountInMax from "@/hooks/useAmountInMax";
import BigNumber from "bignumber.js";
import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiErc20 from "@/abi/abiErc20.json";
import abiErc1155 from "@/abi/abiErc1155.json";
import abiRouter from "@/abi/abiRouter.json";
import TransitionURL from "../Toast/TransionURL";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import approveToken from "@/libs/utils/approveToken";
import { AvatarUser } from "../Avatars";
import Link from "next/link";
import { SkeletonReels } from "../Skeleton";
import approveNFT from "@/libs/utils/approveNFT";
interface ReelsProps {
  data: any;
  isSuccess: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: any;
  isFetching: boolean;
}
const styles = {
  inputItem:
    "w-full mt-4 py-2 pl-2 mb-6 border rounded-lg mx-auto border-dark3 block",
  btnActive: "rounded-full bg-base2",
};

const Reels: React.FC<ReelsProps> = ({
  data,
  isSuccess,
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
  isFetching,
}) => {
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [filter, setFilter] = useState<any>("");
  const { account, wallet } = useContext(AccountContext);
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputNFT, setInputNFT] = useState<string>("0");
  const [amountNFTSubmit, setAmountNFTSubmit] = useState("");
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientTokenBuy, setIsSufficientTokenBuy] =
    useState<boolean>(false);
  const [isSufficientTokenSell, setIsSufficientTokenSell] =
    useState<boolean>(false);
  const [priceBuy, setPriceBuy] = useState<number>(0);
  const [priceSell, setPriceSell] = useState<number>(0);
  const [tokenAddressSwap,setTokenAddressSwap] = useState<string>('');
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const handleSlideChange = (swiper: any) => {
    setActiveSlideIndex(swiper.activeIndex);
  };
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };

  const { ref, inView } = useInView();

  // useEffect(() => {
  //   if (
  //     data &&
  //     data.pages &&
  //     data.pages.length > 0 &&
  //     data.pages[0].records &&
  //     data.pages[0].records.length > 0
  //   ) {
  //     setFilter(data.pages[0].records[0]);
  //   }
  // }, [data]);
  // console.log(data.pages[0]);
  
  useEffect(() => {
    data?.pages.map((page: any, index: number) => {
      page.records.map((item: any) => {
        if (item.index === activeSlideIndex + 1) {
          setFilter(item);
          setInputNFT("");
          setSelectedCategory("1");
        }
      });
    });
  }, [activeSlideIndex]);
  console.log(activeSlideIndex);
  console.log(filter);
  
  useEffect(() => {
    if (selectedCategory === "CUSTOM") {
      setAmountNFTSubmit(inputNFT);
    } else {
      setAmountNFTSubmit(selectedCategory);
    }
  }, [inputNFT, selectedCategory, activeSlideIndex, activeChoice]);

  const {
    reserves,
    isLoadingInforDML,
  } = useInformationDML(filter.dmlAddress);
  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(account, wallet, filter.nft);
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, filter, wallet]);
  const balanceNFT = useNFTBalance(account, filter.nft, filter.tokenId, wallet);
  // console.log(isLoadingInforDML);
  // console.log(filter.nft);
  
  useEffect(()=>{
    if (filter.tokenAddress === "0x734aef51d427b2f745210ec4bf1062abd48eceb6") {
      setTokenAddressSwap("MATIC");
    } else {
      setTokenAddressSwap(filter.tokenAddress);
    }
  },[filter.tokenAddress])
  
  const { balanceToken, decimals, bigNumberBalance, symbolToken } =
    useInformationToken(account, tokenAddressSwap, wallet);
    
  const { amountTokenSell, isLoadingSell } = useAmountOutMin(
    amountNFTSubmit,
    filter.dmlAddress,
    filter.tokenAddress,
    filter.nft,
    filter.tokenId,
    wallet,
    activeChoice
  );
  
  const { amountTokenBuy, isLoadingBuy } = useAmountInMax(
    amountNFTSubmit,
    filter.dmlAddress,
    filter.tokenAddress,
    filter.nft,
    filter.tokenId,
    wallet,
    activeChoice
  );
  console.log(amountTokenBuy);
  console.log(isLoadingBuy);
  
  const amountBuy = new BigNumber(amountTokenBuy);
  const amountSell = new BigNumber(amountTokenSell);
  useEffect(() => {
    setPriceBuy(Number(amountBuy) / Number(amountNFTSubmit));
    setPriceSell(Number(amountSell) / Number(amountNFTSubmit));
  }, [activeSlideIndex, amountNFTSubmit, amountBuy]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  let symbolTokenSwap = "";
  if (symbolToken === "WETH") {
    symbolTokenSwap = "MATIC";
  } else {
    symbolTokenSwap = symbolToken;
  }

  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "BUY") {
        if (reserves && Number(amountNFTSubmit) < Number(reserves[1])) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      } else {
        console.log(amountNFTSubmit);
        console.log(balanceNFT);
        if (Number(amountNFTSubmit) <= Number(balanceNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      }
    };
    checkReservesNFT();
    if (Number(amountBuy.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenBuy(false);
    } else {
      setIsSufficientTokenBuy(true);
    }
    if (Number(amountSell.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenSell(false);
    } else {
      setIsSufficientTokenSell(true);
    }
  }, [amountNFTSubmit, activeChoice, account, amountBuy, amountSell]);
  useEffect(() => {
    if (amountNFTSubmit === "") {
      setIsSufficientNFT(true);
    }
  }, []);

  useEffect(() => {
    const checkApproveToken = async () => {
      if (tokenAddressSwap !== "MATIC") {
        const currentAllowance = await approveToken(
          account,
          wallet,
          filter.tokenAddress
        );
        if (Number(currentAllowance) < Number(amountTokenBuy)) {
          setIsApprovedToken(false);
        } else {
          setIsApprovedToken(true);
        }
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, filter.tokenAddress, amountNFTSubmit, amountTokenBuy]);

  const hanldeApproveNFT = async () => {
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(filter.nft, abiErc1155, signer);
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      try {
        await contract.setApprovalForAll(routerAddress, true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  const handleApproveToken = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (account) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(filter.tokenAddress, abiErc20, signer);
      const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
      try {
        await contract.approve(routerAddress, amountBuy.toFixed());
        setInputNFT("");
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleBuyNFT = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (amountNFTSubmit === "") {
      setShowRequiredMessage(true);
    } else {
      setShowRequiredMessage(false);
      if (
        isSufficientNFT &&
        isSufficientTokenBuy &&
        Number(reserves[1].toString()) > 1 &&
        Number(reserves[0].toString()) > 0
      ) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);
        try {
          let result;
          if (tokenAddressSwap === "MATIC") {
            result = await contract.buyETH(
              filter.nft,
              filter.tokenId,
              amountNFTSubmit,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000, value: amountBuy.toFixed(0) }
            );
          } else {
            result = await contract.buy(
              filter.tokenAddress,
              filter.nft,
              filter.tokenId,
              amountNFTSubmit,
              amountBuy.toFixed(0),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          }
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
          console.error(error);
        }
      }
    }
  };
  const handleSellNFT = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }
    if (amountNFTSubmit === "") {
      setShowRequiredMessage(true);
    } else {
      setShowRequiredMessage(false);
      if (
        isSufficientNFT &&
        isSufficientTokenSell &&
        Number(reserves[1].toString()) > 0 &&
        Number(reserves[0].toString()) > 0
      ) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const routerAddress = process.env.NEXT_PUBLIC_ROUTER || "";
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);

        try {
          let result;
          if (tokenAddressSwap === "MATIC") {
            result = await contract.sellETH(
              filter.nft,
              filter.tokenId,
              amountNFTSubmit,
              amountSell.toFixed(0),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          } else {
            result = await contract.sell(
              filter.tokenAddress,
              filter.nft,
              filter.tokenId,
              amountNFTSubmit,
              amountSell.toFixed(0),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          }
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
          console.error(error);
        }
      }
    }
  };
  return (
    <div className="">
      {isSuccess && (
        <div className="h-[790px]">
          <>
            <Swiper
              direction={"vertical"}
              slidesPerView={1}
              mousewheel={true}
              modules={[Mousewheel, Pagination]}
              className="h-full mySwiper swipper-swap"
              onSlideChange={handleSlideChange}
            >
              {isSuccess &&
                data?.pages.map((page: any, index: number) => (
                  <div key={index}>
                    {page.records.map((nftItem: any, index: number) => (
                      <SwiperSlide key={`${nftItem._id}-${index}`}>
                        <div className="relative flex items-center h-full w-fit">
                          {nftItem.metadata.image && (
                            <Image
                              width={760}
                              height={760}
                              src={nftItem.metadata.image}
                              alt="NFT Image"
                              style={{
                                objectFit: "contain",
                              }}
                              unoptimized
                              className="rounded-2xl max-w-[760px] max-h-[760px]"
                            />
                          )}
                          {nftItem.metadata.animation_url &&
                            !nftItem.metadata.image && (
                              <video
                                src={nftItem.metadata.animation_url}
                                autoPlay
                                loop
                                muted
                                controls
                                className=" rounded-2xl max-w-[760px] max-h-[760px]"
                              />
                            )}
                          {nftItem.metadata.image &&
                            nftItem.metadata.animation_url && (
                              <audio
                                autoPlay
                                loop
                                muted
                                controls
                                src={nftItem.metadata.animation_url}
                                className="absolute bottom-4 mx-auto mt-4 mb-2 translate-x-1/2 right-2/4 w-[80%]"
                              >
                                Your browser does not support the
                                <code>audio</code> element.
                              </audio>
                            )}
                        </div>
                        <div ref={ref} style={{ height: "1px" }} />
                      </SwiperSlide>
                    ))}
                  </div>
                ))}
            </Swiper>
          </>
        </div>
      )}
      {isSuccess && filter && (
        <div className="fixed flex flex-col justify-center w-[800px] right-[164px] top-[23%] z-10">
          <div className="px-4 py-6 border rounded-lg border-dark3">
            <div className="flex mb-3 text-dark1">
              <div className="flex basis-1/6">
                <TwoTab
                  firstChoice="BUY"
                  secondChoice="SELL"
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
              </div>
              <div className="basis-4/6">
                <div className="flex justify-center text-xl font-medium text-dark1">
                  <span className="mr-4">{filter.metadata.name}</span>
                  {filter.metadata.category.map((item: any, index: number) => (
                    <Link
                      href={`/category/${item.toLowerCase()}`}
                      key={index}
                      className="h-[30px] flex items-center px-2 mr-2 text-xs font-medium text-center border rounded-lg border-secondary5 text-dark1"
                    >
                      <p>{item}</p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="basis-1/6">
                <a
                  href={`https://mumbai.polygonscan.com/address/${filter.dmlAddress}`}
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
              </div>
            </div>
            <div className="flex items-center justify-center mb-2 text-dark2">
              <AvatarUser
                activeSlideIndex={activeSlideIndex}
                width={32}
                height={32}
              />
              <p className="font-medium text-dark2">{`${filter.creatorAddress.slice(
                0,
                4
              )}...${filter.creatorAddress.slice(-5)}`}</p>
              <p className="-translate-y-[4px] mx-1">.</p>
              <p className="text-xs first-letter:uppercase">
                {filter.blockTimestamp}
              </p>
            </div>
            <div className="mb-4 font-light text-center text-dark2 line-clamp-3">
              {filter.metadata.description}
            </div>
            {filter.metadata.attributes && (
              <div className="flex flex-wrap justify-center w-full my-4 gap-x-4">
                {filter.metadata.attributes.map((item: any, index: number) => (
                  <div key={index} className="">
                    {item.value && item.trait_type && (
                      <ul className="px-2 py-1 border rounded-lg border-dark3 w-max min-h-[46px] min-w-[120px]">
                        <li className="text-lg font-medium text-dark2">
                          {item.trait_type}
                        </li>
                        <li className="text-sm text-dark3">{item.value}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col items-center">
              {amountNFTSubmit ? (
                <div className="text-center">
                  {activeChoice === "BUY" &&
                    (!priceBuy || isLoadingBuy ? (
                      <p className="w-40 h-6 rounded-full animate-pulse bg-slate-200"></p>
                    ) : (
                      <div className="text-4xl text-secondary3">
                        {amountNFTSubmit ? (
                          <span>
                            {formatNumber(
                              divideByDecimal(priceBuy.toFixed(), decimals)
                            )}
                          </span>
                        ) : (
                          <span>0</span>
                        )}
                        <span className="ml-2">{symbolTokenSwap}</span>
                      </div>
                    ))}
                  {activeChoice === "SELL" &&
                    (!priceSell || isLoadingSell ? (
                      <p className="w-40 h-6 rounded-full animate-pulse bg-slate-200"></p>
                    ) : (
                      <div className="text-4xl text-secondary3">
                        {amountNFTSubmit ? (
                          <span>
                            {formatNumber(
                              divideByDecimal(priceSell.toFixed(), decimals)
                            )}
                          </span>
                        ) : (
                          <span>0</span>
                        )}
                        <span className="ml-2">{symbolTokenSwap}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <h3 className="text-4xl text-secondary3">
                  0 {symbolTokenSwap}
                </h3>
              )}
              <div className="flex mt-4 mb-4 font-normal text-secondary4 gap-x-8">
                {isLoadingInforDML ? (
                  <p className="w-32 h-4 rounded-full animate-pulse bg-slate-200"></p>
                ) : (
                  <p className="mb-4 text-secondary4">
                    Reserve NFT:{formatNumber(reserves[1])}
                  </p>
                )}
                {isLoadingInforDML ? (
                  <p className="w-32 h-4 rounded-full animate-pulse bg-slate-200"></p>
                ) : (
                  <p className="mb-4 text-secondary4 text-end">
                    Reserve Token:
                    {formatNumber(
                      divideByDecimal(reserves[0].toString(), decimals)
                    )}
                  </p>
                )}
              </div>
              {account && activeChoice === "BUY" && (
                <p className="mb-4 -mt-4 text-secondary3">
                  Balance:{formatNumber(balanceToken)} {symbolTokenSwap}
                </p>
              )}
              {account && activeChoice === "SELL" && (
                <p className="mb-4 -mt-4 text-secondary3">
                  Balance:{formatNumber(balanceNFT)} NFT
                </p>
              )}
            </div>
            <div className="flex justify-center">
              {amountNFT.map((item, index) => (
                <Button
                  key={index}
                  className="p-2 ml-4 text-sm font-medium leading-normal text-dark3"
                  type="button"
                  outline
                  active={selectedCategory === item.value}
                  onClick={() => setSelectedCategory(item.value)}
                >
                  {item.value}
                </Button>
              ))}
            </div>

            {selectedCategory === "CUSTOM" && (
              <div className="w-[40%] mx-auto">
                <input
                  type="number"
                  name="amountNFT"
                  id="amountNFT"
                  placeholder="Input amount NFT"
                  className={
                    showRequiredMessage
                      ? " mt-4 py-2 pl-2 mb-6 w-full rounded-lg border-2 border-red mx-auto block"
                      : styles.inputItem
                  }
                  value={inputNFT}
                  onChange={(e) => {
                    setInputNFT(e.target.value);
                    setShowRequiredMessage(false);
                  }}
                />
                {showRequiredMessage && (
                  <p
                    className="mx-auto ml-3 -mt-3 text-xs text-red"
                    key="emptyNFT"
                  >
                    Required
                  </p>
                )}
              </div>
            )}

            {!isSufficientNFT &&  balanceNFT && (
              <p
                className="mt-4 mb-2 ml-3 text-xs text-center text-red"
                key="NFTbalance"
              >
                Insufficient NFT balance
              </p>
            )}
            {((!isSufficientTokenBuy && activeChoice === "BUY" && account) ||
              (!isSufficientTokenSell &&
                activeChoice === "SELL" &&
                account)) && (
              <p
                className="mt-4 ml-3 text-xs text-center text-red"
                key="Tokenbalance"
              >
                Insufficient Token balance
              </p>
            )}
            <div className="flex justify-center w-full mt-6">
              {isApprovedToken && account && activeChoice === "BUY" && (
                <button
                  type="button"
                  className="py-2 w-[144px] bg-green rounded-lg text-sm text-white"
                  onClick={handleBuyNFT}
                >
                  BUY NFT
                </button>
              )}
              {isApprovedNFT && account && activeChoice === "SELL" && (
                <button
                  type="button"
                  className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
                  onClick={handleSellNFT}
                >
                  SELL NFT
                </button>
              )}
              {!isApprovedNFT &&
                account &&
                isSufficientTokenSell &&
                activeChoice === "SELL" && (
                  <Button
                    className="w-[126px] py-2"
                    primary
                    onClick={hanldeApproveNFT}
                  >
                    APPROVE NFT
                  </Button>
                )}
              {!isApprovedToken &&
                account &&
                isSufficientTokenBuy &&
                tokenAddressSwap !== "MATIC" &&
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
              {!account && (
                <Button className="w-[140px] py-2" primary onClick={handleOpen}>
                  CONNECT WALLET
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {(isLoading || isFetchingNextPage || isFetching) && <SkeletonReels />}
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ToastContainer />
    </div>
  );
};

export default Reels;
