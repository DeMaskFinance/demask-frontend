
import abiErc1155 from "@/abi/abiErc1155.json";
import abiErc20 from "@/abi/abiErc20.json";
import abiRouter from "@/abi/abiRouter.json";
import ModalNumber from "@/components/Modal/ModalLength/ModalNumber";
import { ModalTransation } from "@/components/Modal/ModalTransation";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { amountNFT } from "@/libs/constants";
import approveNFT from "@/libs/utils/approveNFT";
import formatNumber from "@/libs/utils/formatNumer";
import { getBuyPrice, getSellPrice } from "@/libs/utils/getPrice";
import { ethers } from "ethers";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineDoubleLeft } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";
import { Mousewheel, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { AvatarUser } from "../../Avatars";
import { Button } from "../../Buttons";
import { PoolIcon } from "../../Icons";
import { ModalWallet } from "../../Modal/ModalWallet";
import { TabGroups } from "../../NavChoice";
import TransitionURL from "../../Toast/TransionURL";
import NFTItem from "./NFTItem";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";

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
  const { account, wallet, demask, chainId, tokenDefault } = useContext(AccountContext);
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
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [symbolToken, setSymbolToken] = useState<string>('');
  const [activeMobile, setActiveMobile] = useState(false);
  const [activeDetail, setActiveDetail] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;

  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const handleSlideChange = (swiper: any) => {
    setActiveSlideIndex(swiper.activeIndex);
    setShowMore(true);
  };
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const { ref, inView } = useInView();

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
  console.log(filter);

  useEffect(() => {
    if (selectedCategory === "CUSTOM") {
      setAmountNFTSubmit(inputNFT);
    } else {
      setAmountNFTSubmit(selectedCategory);
    }
  }, [inputNFT, selectedCategory, activeSlideIndex, activeChoice]);

  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(account, wallet, filter.nft, routerAddress);
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, filter, wallet, isOpenTransaction]);
  const balanceNFT = useNFTBalance(account, filter.nft, filter.FactoryContract_id, wallet, isOpenTransaction);

  useEffect(() => {
    if (tokenDefault && filter) {
      if (filter.tokenSymbol !== tokenDefault[0].symbolNative) {
        setSymbolToken(filter.tokenSymbol)
      } else {
        setSymbolToken(tokenDefault[0].symbol)
      }
    }
  }, [filter, tokenDefault])

  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformationToken(account, filter.erc, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction);
  const amountBuy = getBuyPrice(filter.reserveNFT, filter.reserveToken, +(amountNFTSubmit));
  const amountSell = getSellPrice(filter.reserveNFT, filter.reserveToken, +(amountNFTSubmit));
  const amountBuyDec = getBuyPrice(filter.reserveNFT, filter.reserveTokenDecimals, Number(amountNFTSubmit)) * Number(amountNFTSubmit) * 1.05;
  const amountSellDec = getSellPrice(filter.reserveNFT, filter.reserveTokenDecimals, +(amountNFTSubmit)) * Number(amountNFTSubmit) * 0.95;
  // console.log(bigNumberBalance);
  // console.log(Number(amountBuyDec.toFixed()));
  
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    const checkReservesNFT = () => {
      if (activeChoice === "BUY") {
        if (filter.reserveNFT && Number(amountNFTSubmit) < Number(filter.reserveNFT)) {
          setIsSufficientNFT(true);
        } else {
          setIsSufficientNFT(false);
        }
      } else {
        if (Number(amountNFTSubmit) <= Number(balanceNFT)) {
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
  }, [amountNFTSubmit, activeChoice, account, activeSlideIndex, amountBuyDec, amountBuyDec, balanceToken]);
  useEffect(() => {
    if (amountNFTSubmit === "") {
      setIsSufficientNFT(true);
    }
  }, []);
  useEffect(() => {
    const checkApproveToken = async () => {
      if (filter.erc !== nativeAddress) {
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
  }, [account, wallet, amountNFTSubmit, amountBuyDec, isOpenTransaction, filter.erc, allowanceToken]);

  const handleApproveToken = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (account && wallet) {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        filter.erc,
        abiErc20,
        signer
      );
      try {
        setIsOpenTransaction(true);
        const result = await contract.approve(routerAddress, Math.floor(amountBuyDec).toString());
        await provider.waitForTransaction(result.hash);
        setInputNFT("");
        setIsOpenTransaction(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleBuyNFT = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
        Number(filter.reserveNFT) > 1 &&
        Number(filter.reserveToken) > 0
      ) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);
        try {
          let result;
          setIsOpenTransaction(true);
          if (filter.erc === nativeAddress) {
            result = await contract.buyETH(
              filter.nft,
              filter.FactoryContract_id,
              amountNFTSubmit,
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000, value: exponentialToDecimal(Math.floor(amountBuyDec)) }
            );
          } else {
            console.log(Math.floor(amountBuyDec).toString());
            result = await contract.buy(
              filter.erc,
              filter.nft,
              filter.FactoryContract_id,
              amountNFTSubmit,
              exponentialToDecimal(Math.floor(amountBuyDec)),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          }
          await provider.waitForTransaction(result.hash);
          setIsOpenTransaction(false);
          if (result.hash) {
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
                toastId: 'success1',
                theme: "light",
              }
            );
          }
          setInputNFT("");
        } catch (error) {
          setIsOpenTransaction(false);
          console.error(error);
        }
      }
    }
  };

  const handleSellNFT = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
        Number(filter.reserveNFT) > 1 &&
        Number(filter.reserveToken) > 0
      ) {
        const providerChoice = getProvider(wallet);
        const provider = new ethers.providers.Web3Provider(providerChoice);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(routerAddress, abiRouter, signer);
        console.log(Math.floor(amountSellDec).toString());

        try {
          let result;
          setIsOpenTransaction(true);
          if (filter.erc === nativeAddress) {
            result = await contract.sellETH(
              filter.nft,
              filter.FactoryContract_id,
              amountNFTSubmit,
              exponentialToDecimal(Math.floor(amountSellDec)),
              account,
              Math.floor((new Date().getTime() + 20 * 60000) / 1000),
              { gasLimit: 8000000 }
            );
          } else {
            console.log(Math.floor(amountSellDec).toString());
            console.log(amountNFTSubmit);
            result = await contract.sell(
              filter.erc,
              filter.nft,
              filter.FactoryContract_id,
              amountNFTSubmit,
              exponentialToDecimal(Math.floor(amountSellDec)),
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
  const formattedDescription = filter.metadata?.description
    ? filter.metadata.description.split("\\n").map((line: any, index: number) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))
    : null;
  console.log(balanceToken);

  return (
    <div className="gap-4 lg:h-fit h-[82vh]">
      {isSuccess && (
        <div className="lg:h-[calc(100vh-130px)] overflow-hidden h-[80vh] w-full sticky px top-8">
          <>
            <Swiper
              direction={"vertical"}
              slidesPerView={1}
              mousewheel={true}
              modules={[Mousewheel, Pagination]}
              className="h-full mySwiper !p-0"
              onSlideChange={handleSlideChange}
            >
              {isSuccess &&
                data?.pages.map((page: any, index: number) => (
                  <div key={index}>
                    {page.records.map((nftItem: any, index: number) => (
                      <SwiperSlide key={`${nftItem.FactoryContract_id}-${index}`}>
                        <NFTItem nftItem={nftItem} filter={filter} setShowMore={setShowMore} showMore={showMore} />
                        <div ref={ref} style={{ height: "1px" }} />
                      </SwiperSlide>
                    ))}
                  </div>
                ))}
            </Swiper>

            <div
              onClick={() => {
                setActiveMobile(false);
              }}
              className={`${activeMobile ? "block" : "hidden"
                } absolute h-full bottom-0 modal-buy lg:hidden transition-all z-10 w-full px-4 opacity-30 bg-black pr-8 pl-2`}
            >
              <div className="w-full pt-4 lg:hidden">
                <AiOutlineClose
                  className="ml-auto text-2xl"
                  onClick={() => {
                    setActiveMobile(false);
                  }}
                />
              </div>
            </div>

            <div
              className="absolute lg:hidden  top-[86%] -translate-y-[80%] right-0 md:right-4 z-50 bg-transparent"
              onClick={() => {
                setActiveMobile(!activeMobile);
              }}
            >
              <button className="p-2 text-white border border-white">
                <AiOutlineDoubleLeft />
              </button>
            </div>

            <div
              className={`${activeMobile ? "translate-y-0" : "translate-y-full"
                } absolute h-[400px] overflow-y-auto bottom-0 modal-buy pb-4 transition-all lg:hidden bg-white w-full mx-auto z-20 pr-8 pl-2`}
            >
              <div className="w-full pt-4 lg:hidden">
                <div className="flex items-center justify-between">
                  <div className="!text-xs">
                    <TabGroups
                      choices={["BUY", "SELL"]}
                      activeChoice={activeChoice}
                      onChoiceChange={handleChoiceChange}
                    />
                  </div>

                  <AiOutlineClose
                    className="text-2xl"
                    onClick={() => {
                      setActiveMobile(false);
                    }}
                  />
                </div>

                {/* Phần cần Optimize */}

                {isSuccess && filter && (
                  <div className="mt-8 Optimize lg:hidden">
                    <div className="flex flex-wrap items-center justify-center mt-8 mb-2 text-dark2">
                      <AvatarUser
                        activeSlideIndex={activeSlideIndex}
                        width={32}
                        height={32}
                      />
                      <p className="font-medium text-dark2">{`${filter?.creator?.slice(
                        0,
                        4
                      )}...${filter?.creator?.slice(-5)}`}</p>
                      <p className="-translate-y-[4px] mx-1">.</p>
                      <p className="text-xs first-letter:uppercase">
                        {filter?.blockTimestamp}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      {amountNFTSubmit ? (
                        <div className="text-center">
                          {activeChoice === "BUY" &&
                            (!amountBuyDec ? (
                              <p className="w-40 h-[36px] rounded-full animate-pulse bg-slate-200"></p>
                            ) : (
                              <div className="text-3xl text-secondary3">
                                {amountNFTSubmit ? (
                                  <span>
                                    {formatNumber(
                                      divideByDecimal(amountBuyDec.toString(), filter.tokenDecimals)
                                    )}
                                  </span>
                                ) : (
                                  <span>0</span>
                                )}
                                <span className="ml-2">{symbolToken}</span>
                              </div>
                            ))}
                          {activeChoice === "SELL" &&
                            (!amountSellDec ? (
                              <p className="w-40 h-6 rounded-full animate-pulse bg-slate-200"></p>
                            ) : (
                              <div className="text-4xl text-secondary3">
                                {amountNFTSubmit ? (
                                  <span>
                                    {formatNumber(
                                      divideByDecimal(amountSellDec.toString(), filter.tokenDecimals)
                                    )}
                                  </span>
                                ) : (
                                  <span>0</span>
                                )}
                                <span className="ml-2">{symbolToken}</span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <h3 className="text-4xl text-secondary3">
                          0 {symbolToken}
                        </h3>
                      )}
                      <div className="flex mt-4 mb-4 font-normal text-secondary4 gap-x-8">
                        <p className="flex flex-col items-center gap-2 mb-4 text-secondary4">
                          <span className="flex-shrink-0">Reserve NFT:</span>
                          {filter.reserveNFT ? (
                            <span className="block">
                              {formatNumber(filter.reserveNFT)}
                            </span>
                          ) : (
                            <span className="block">
                              {formatNumber(filter.reserveNFT)}
                            </span>
                          )}
                        </p>

                        <p className="flex flex-col items-center gap-2 mb-4 text-secondary4">
                          <span className="flex-shrink-0">Reserve Token:</span>

                          {!filter.reserveToken ? (
                            <span className="block w-20 h-6 rounded-xl animate-pulse bg-slate-200"></span>
                          ) : (
                            <span className="block">
                              {formatNumber(
                                filter.reserveToken
                              )}
                            </span>
                          )}
                        </p>
                      </div>
                      {account && activeChoice === "BUY" && (
                        <p className="mb-4 -mt-4 text-secondary3">
                          Balance:{formatNumber(balanceToken)} {symbolToken}
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
                          className="min-w-[32px] px-2 h-[32px] ml-4 text-sm font-medium leading-normal text-dark3"
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
                      <div className="w-[60%]  mx-auto">
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
                    {!isSufficientNFT && balanceNFT && account && filter.reserveNFT && (
                      <p
                        className="mt-4 mb-2 ml-3 text-xs text-center text-red"
                        key="NFTbalance"
                      >
                        Insufficient NFT balance
                      </p>
                    )}
                    {((!isSufficientTokenBuy &&
                      activeChoice === "BUY" &&
                      filter.reserveToken &&
                      account) ||
                      (!isSufficientTokenSell &&
                        activeChoice === "SELL" &&
                        filter.reserveToken &&
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
                            onClick={() =>
                              handleApproveNFT(
                                account,
                                wallet,
                                filter.nft,
                                setIsOpen,
                                setIsOpenTransaction,
                                routerAddress
                              )
                            }
                          >
                            APPROVE NFT
                          </Button>
                        )}
                      {!isApprovedToken &&
                        account &&
                        isSufficientTokenBuy &&
                        filter.erc !== nativeAddress &&
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
                        <Button
                          className="w-[140px] py-2"
                          primary
                          onClick={handleOpen}
                        >
                          CONNECT WALLET
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>

          {isSuccess && filter && (
            <div className="h-[80%] items-center right-20 z-10 absolute mr-14 justify-start w-full  pt-4  top-8 lg:w-[35%] lg:flex hidden md:w-2/5">
              <div className="relative px-6 py-6 overflow-hidden border rounded-lg h-fit border-dark3">
                <div
                  className={`${activeDetail ? "translate-x-0" : "translate-x-[100%]"
                    } bg-white flex flex-col justify-between  items-center p-2 transition-all absolute w-full h-full top-0 left-0 right-0 z-20 rounded-lg`}
                >
                  <button
                    onClick={() => {
                      setActiveDetail(false);
                    }}
                    className="absolute top-0 right-0 p-1 mx-6 mt-8 text-xl transition-all rounded-lg hover:text-white hover:bg-secondary5 text-dark2"
                  >
                    <AiOutlineClose className="" />
                  </button>

                  {activeDetail && (
                    <div className="w-full flex justify-center text-center items-center h-[10%] pb-4 pt-8 text-xl font-medium text-dark1">
                      <span className="mx-2 break-words">{filter.metadata.name}</span>
                    </div>
                  )}
                  <div className="max-h-[300px] font-light overflow-scroll text-justify h-[70%] px-2  mx-2 rounded-lg">
                    {formattedDescription}
                  </div>

                  <div className="">
                    {filter.metadata.attributes && (
                      <div className="flex flex-wrap justify-start w-full gap-4 p-2 overflow-hidden">
                        {filter.metadata.attributes.map(
                          (item: any, index: number) => (
                            <div key={index} className="">
                              {item.value && item.trait_type && (
                                <ul className="px-2 border rounded-lg border-dark3 w-max min-h-[40px] min-w-[120px]">
                                  <li className="text-base font-medium text-dark2">
                                    {item.trait_type}
                                  </li>
                                  <li className="text-sm text-dark3">
                                    {item.value}
                                  </li>
                                </ul>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between gap-4 mb-3 text-dark1">
                  <div className="w-[30%]">
                    <TabGroups
                      choices={["BUY", "SELL"]}
                      activeChoice={activeChoice}
                      onChoiceChange={handleChoiceChange}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="">
                      <a
                        href={`https://mumbai.polygonscan.com/address/${filter.dmlToken}`}
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

                    <button
                      onClick={() => {
                        setActiveDetail(true);
                      }}
                      className="px-1 py-1 transition-all rounded-lg hover:bg-secondary5 hover:text-white"
                    >
                      <BiDotsVerticalRounded />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center mt-8 mb-2 text-dark2">
                  <div className="">
                    <div className="flex justify-center text-xl font-medium text-dark1">
                      <span className="mr-4 truncate line-clamp-1 lg:max-w-[250px] block text-center">
                        {filter.metadata.name}
                      </span>
                    </div>
                  </div>
                  <AvatarUser
                    activeSlideIndex={activeSlideIndex}
                    width={24}
                    height={24}
                  />
                  <p className="font-medium text-dark2">{`${filter.creator.slice(
                    0,
                    4
                  )}...${filter.creator.slice(-5)}`}</p>
                  <p className="-translate-y-[4px] mx-1">.</p>
                  <p className="text-xs first-letter:uppercase">
                    {filter.blockTimestamp}
                  </p>
                </div>
                <div className="mx-auto mb-2 w-fit">
                  {filter.metadata.category?.map((item: any, index: number) => (
                    <Link
                      href={`/category/${item.toLowerCase()}`}
                      key={index}
                      className="p-2 py-1 mr-2 text-sm uppercase transition-all border rounded-lg w-fit hover:bg-secondary5 hover:text-white bg-dark4 text-dark1"
                    >
                      {item}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col items-center">
                  {amountNFTSubmit ? (
                    <div className="text-center">
                      {activeChoice === "BUY" &&
                        (!amountBuyDec ? (
                          <p className="w-40 h-[36px] rounded-full animate-pulse bg-slate-200"></p>
                        ) : (
                          <div className="text-3xl text-secondary3">
                            {amountNFTSubmit ? (
                              <span>
                                {formatNumber(
                                  divideByDecimal(amountBuyDec.toString(), filter.tokenDecimals)
                                )}
                              </span>
                            ) : (
                              <span>0</span>
                            )}
                            <span className="ml-2">{symbolToken}</span>
                          </div>
                        ))}
                      {activeChoice === "SELL" &&
                        (!amountSellDec ? (
                          <p className="w-40 h-6 rounded-full animate-pulse bg-slate-200"></p>
                        ) : (
                          <div className="text-4xl text-secondary3">
                            {amountNFTSubmit ? (
                              <span>
                                {formatNumber(
                                  divideByDecimal(amountSellDec.toString(), filter.tokenDecimals)
                                )}
                              </span>
                            ) : (
                              <span>0</span>
                            )}
                            <span className="ml-2">{symbolToken}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <h3 className="text-4xl text-secondary3">
                      0 {symbolToken}
                    </h3>
                  )}
                  <div className="flex mt-4 mb-4 font-normal text-secondary4 gap-x-8">
                    <p className="flex items-center gap-2 mb-4 text-secondary4">
                      <span className="flex-shrink-0">Reserve NFT:</span>
                      {filter.reserveNFT ? (
                        <ModalNumber data={filter.reserveNFT} />
                      ) : (
                        <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                      )}
                    </p>
                    <p className="flex items-center gap-2 mb-4 text-secondary4">
                      <span className="flex-shrink-0">Reserve Token:</span>
                      {filter.reserveToken ? (
                        <span className="block">
                          {formatNumber(
                            filter.reserveToken
                          )}
                        </span>
                      ) : (
                        <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                      )}
                    </p>
                  </div>
                  {account && activeChoice === "BUY" && (
                    <p className="mb-4 -mt-4 text-secondary3">
                      Balance:{formatNumber(balanceToken)} {symbolToken}
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
                      className="min-w-[32px] px-2 h-[32px] ml-4 text-sm font-medium leading-normal text-dark3"
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
                  <div className="w-[40%]  mx-auto">
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

                {!isSufficientNFT && balanceNFT && account && filter.reserveNFT && (
                  <p
                    className="mt-4 mb-2 ml-3 text-xs text-center text-red"
                    key="NFTbalance"
                  >
                    Insufficient NFT balance
                  </p>
                )}
                {((!isSufficientTokenBuy &&
                  activeChoice === "BUY" &&
                  filter.reserveToken &&
                  account) ||
                  (!isSufficientTokenSell &&
                    activeChoice === "SELL" &&
                    filter.reserveToken &&
                    account)) && (
                    <p
                      className="mt-4 ml-3 text-xs text-center text-red"
                      key="Tokenbalance"
                    >
                      Insufficient Token balance
                    </p>
                  )}
                {activeChoice === "BUY" && Math.floor(amountBuyDec) === 0 && amountNFTSubmit && (
                  <p className="mt-4 ml-3 text-xs text-center text-red">
                    Can't buy
                  </p>
                )}
                {activeChoice === "SELL" && Math.floor(amountSellDec) === 0 && amountNFTSubmit && (
                  <p className="mt-4 ml-3 text-xs text-center text-red">
                    Can't sell
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
                        onClick={() =>
                          handleApproveNFT(
                            account,
                            wallet,
                            filter.nft,
                            setIsOpen,
                            setIsOpenTransaction,
                            routerAddress
                          )
                        }
                      >
                        APPROVE NFT
                      </Button>
                    )}
                  {!isApprovedToken &&
                    account &&
                    isSufficientTokenBuy &&
                    filter.erc !== nativeAddress &&
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
                    <Button
                      className="w-[140px] py-2"
                      primary
                      onClick={handleOpen}
                    >
                      CONNECT WALLET
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
    </div>
  );
};

export default Reels;
