import AccountContext from "@/context/AccountContext";
import { LaunchPadAPI } from "@/libs/service/launchpadService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import abiLaunchPad from "@/abi/abiLaunchPad.json";
import ModalLaunchPad from "@/components/Modal/ModalLaunchPad";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import TransitionURL from "@/components/Toast/TransionURL";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import ProgressBar from "./ProgessLaunchPad";
import { IoReloadOutline } from "react-icons/io5";
import ModalAddAdminLaunchpad from "@/components/Modal/ModalLaunchpadProfile/ModalAddAdminLaunchpad";
import DetailLaunchPadInfo from "./DetailLaunchPadInfo";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import MediaNFT from "@/components/Common/MediaNFT";
import { AvatarUser } from "@/components/Avatars";
import { EtherIcon, ZkSyncIconTable } from "@/components/Icons";
import Rule from "./Rule";
import Box from "./Box";
import Timeline from "./Timeline";
import FormatNumber from "@/components/Common/FormatNumber";
import { Button } from "@/components/Buttons";
import CountdownTime from "@/components/Common/CountdownTime";
import { BiLoaderAlt } from "react-icons/bi";

export default function DetailLaunchPad() {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [status, setStatus] = useQueryParam("status", withDefault(StringParam, "rule"));
  const [amountBuyDec, setAmountBuyDec] = useState<number>(1);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checkApproveToken, setCheckApproveToken] = useState<boolean>(false);
  const [inputNFT, setInpuNFT] = useState<any>(1);

  const [openModalWhitelist, setOpenModalWhitelist] = useState<boolean>(false);
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);
  const [errors, setErrors] = useState<string>("");
  const { isLoading, data, isRefetching, isSuccess, refetch } = useQuery({
    queryKey: ["launchPad", tokenAddress, chainId],
    queryFn: async () => {
      const res = await LaunchPadAPI(
        tokenAddress.toLocaleLowerCase(),
        chainId,
      );
      return res;
    },
  });

  console.log(data);
  console.log(tokenAddress);
  const { isLoading: isLoadingToken, data: dataToken } = useQuery({
    queryKey: ["tokenPayment", tokenAddress, chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `/token?chainId=${chainId}&tokenAddress=${tokenAddress}`
      );
      return res;
    },

    refetchInterval: 60000,
  });

  useEffect(() => { }, [dataToken]);

  const softcap = data?.softcap;
  const hardcap = data?.hardcap;
  const totalSold = data?.totalSold;


  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;

  const tokenLaunchpad = data?.launchpad;

  const { balanceToken, bigNumberBalance, allowanceToken, isLoadingApprove } =
    useInformationToken(
      account,
      tokenAddress,
      wallet,
      tokenLaunchpad,
      // routerAddress,
      rpc,
      nativeAddress,
      isOpenTransaction
    );

  const currentTime = Math.floor(new Date().getTime() / 1000);
  const startTime = data?.startTime;
  const endTime = data?.endTime;

  const router = useRouter();
  const { detail } = router.query;

  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (detail) {
      setTokenAddress(detail[0]);
    }
  }, [detail]);
  
  useEffect(() => {
    if (data && data?.price) {
      setAmountBuyDec((data?.price / 1e18) * amount);
      setInpuNFT(amount * (data?.price / 1e18));
    }
  }, [amount, data]);

  const checkTime = currentTime > startTime && currentTime < endTime;

  const checkBalance =
    parseFloat(balanceToken) + amount <= parseFloat(data?.maxbuy);

  useEffect(() => {
    if (currentTime < startTime) {
      setErrors("Comming soon");
    } else if (!checkTime) {
      setErrors("Sold out");
    } else if (parseInt(totalSold) >= parseInt(hardcap)) {
      setErrors("Sold out");
    }
    // else if (!checkBalance) {
    //   setErrors("Expire date");
    // }
    else if (amount > data?.maxbuy) {
      setErrors("Amount express");
    } else {
      setErrors("");
    }
  }, [amount, startTime, endTime]);

  useEffect(() => {
    const checkApproveToken = async () => {
      if (tokenAddress !== nativeAddress) {
        if (parseFloat(allowanceToken) < amountBuyDec) {
          setIsApprovedToken(false);
        } else {
          setIsApprovedToken(true);
        }
      } else {
        setIsApprovedToken(true);
      }
    };
    checkApproveToken();
  }, [isApprovedToken, allowanceToken]);
  const TABS = [
    {
      title: "Rule Introduction",
      panel: () => (
        <Rule />
      ),
      key: "rule",
    },
    {
      title: "Box Information",
      panel: () => (
        <Box data={data} />
      ),
      key: "box",
    },
    {
      title: "Timeline",
      panel: () => (
        <Timeline />
      ),
      key: "timeline",
    }
  ];
  const handleBuyNFT = async (e: any) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }

    const providerChoice = getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(tokenLaunchpad, abiLaunchPad, signer);
    try {
      let result;

      if (tokenAddress === nativeAddress) {
        setIsOpenTransaction(true);
        result = await contract.buyETH(amount, { gasLimit: 8000000, value: exponentialToDecimal(Number(data.price) * Number(amount)) });
      } else {
        setIsOpenTransaction(true);
        result = await contract.buy(amount, { gasLimit: 8000000 });
      }

      const check = await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
      setIsOpenModal(false);
      refetch();

      if (check.status === 1) {
        toast.success(
          <TransitionURL type={"Buy NFT success"} transactionHash={result.hash} />,
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
      } else {
        toast.error(
          <TransitionURL type={"Buy NFT failed"} transactionHash={result.hash} />,
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
      }

      setAmount(0);
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const listInfo = DetailLaunchPadInfo(data);
  const selectedTab = TABS.find((item) => item.key === status);
  const blockNumber =
    data?.status === "Upcoming"
      ? data.startTime
      : data?.status === "Active"
        ? data.endTime
        : "";

  return (
    <div>
      <div className="">
        <div className="p-4 border rounded-lg shadow-swiper">
          {isLoading ? (
            <div className="h-[800px]">
              <div className="flex gap-8">
                <div className="h-[600px] bg-slate-200 lg:w-full animate-pulse rounded-lg"></div>
              </div>
            </div>
          ) : (
            data &&
            data?.metadata && (
              <>
                <div className="flex justify-between mb-6">
                  <h1 className="text-2xl font-medium text-dark0">Detail Launchpad</h1>
                  <CountdownTime query={data.status} blockNumber={blockNumber} />
                </div>
                <div className="block lg:flex gap-x-8">
                  <div className="w-full lg:w-[50%]">
                    <MediaNFT data={data} isControls />
                  </div>
                  <div className=" w-full lg:w-[50%] mt-4 lg:mt-0">
                    <h1 className="text-2xl font-semibold text-dark1">{data.metadata.name}</h1>
                    <div className="flex items-center my-3 font-semibold text-dark3">
                      <AvatarUser width={32} height={32} />
                      <p>{`${data.creator.slice(0, 4)}...${data.creator.slice(-4)}`}</p>
                    </div>
                    <div className="flex items-center text-3xl font-semibold text-secondary3">
                      <FormatNumber number={(data.price / 1e18).toString()} />
                      <EtherIcon width={20} height={20} className="mb-2 fill-secondary3" />
                    </div>
                    <div className="grid grid-cols-2 my-3 lg:grid-cols-4 text-dark1">
                      <div>
                        <p>Supported</p>
                        <ZkSyncIconTable className="float-left mt-1" />
                      </div>
                      <div>
                        <p>Total sales</p>
                        <div className="mt-1 font-semibold">
                          <FormatNumber number={data.totalSold} />
                        </div>
                      </div>
                      <div>
                        <p>Soft Cap</p>
                        <div className="mt-1 font-semibold">
                          <FormatNumber number={data.softcap} />
                        </div>
                      </div>
                      <div>
                        <p>Hard Cap</p>
                        <div className="mt-1 font-semibold">
                          <FormatNumber number={data.hardcap} />
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[80%]">
                      <p className="mb-2">Type</p>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-dark4">
                        <div className="flex items-center gap-x-2">
                          <div className="w-8 h-8">
                            <MediaNFT data={data} isControls />
                          </div>
                          <p className="font-semibold text-dark1">{data.metadata.name}</p>
                        </div>
                        <div className="text-sm font-semibold text-secondary4">
                          {data.totalSold}/{data.hardcap}
                        </div>
                      </div>
                      <div className="my-3">
                        <p className="mb-2">Progress</p>
                        <ProgressBar
                          softcap={softcap}
                          hardcap={hardcap}
                          amount={totalSold}
                          isRefetching={isRefetching}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="mb-4">Buying Phase</p>
                      <div className="">
                        {account ? (
                          <>
                            <div className="flex mb-4 gap-x-4">
                              <button
                                disabled={errors !== "" ? true : false}
                                onClick={() => {
                                  setIsOpenModal(!isOpenModal);
                                }}
                                className={`px-4 py-1 rounded-md text-white  ${errors !== "" ? "bg-slate-400" : "bg-secondary2 text-white font-medium hover:bg-white hover:text-secondary5 border boder-white hover:border-secondary5 rounded-lg transition-all duration-150 ease-linear"
                                  }`}
                              >
                                Buy
                              </button>
                              <input
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                type="number"
                                // disabled={errors !== "" ? true : false}
                                className="px-2 border rounded-md outline-none"
                                value={amount}
                              />

                            </div>
                            {/* {(data?.isAdmin || data?.creator === account) &&
                              !data?.whiteList && (
                                <button
                                  onClick={() => {
                                    setOpenModalWhitelist(!openModalWhitelist);
                                  }}
                                  className={`px-4 py-1 rounded-md text-white  ${"bg-secondary3"}`}
                                >
                                  Add Whitelist
                                </button>
                              )} */}
                          </>
                        ) : (
                          <Button
                            className="w-[144px] py-2"
                            primary
                            onClick={handleOpen}
                          >
                            CONNECT WALLET
                          </Button>
                        )}

                        <ModalAddAdminLaunchpad
                          isOpenTransation={isOpenTransaction}
                          isOpenModal={openModalWhitelist}
                          setIsOpenModal={setOpenModalWhitelist}
                          setIsOpenTransaction={setIsOpenTransaction}
                          tokenLaunchpad={tokenLaunchpad}
                          action={"whitelist"}
                        />

                        <ModalLaunchPad
                          setIsOpenTransaction={setIsOpenTransaction}
                          isOpenTransation={isOpenTransaction}
                          setIsOpenModal={setIsOpenModal}
                          isOpenModal={isOpenModal}
                          account={account}
                          wallet={wallet}
                          tokenAddress={tokenAddress}
                          inputNFT={inputNFT}
                          routerAddress={tokenLaunchpad}
                          setIsOpen={setIsOpen}
                          checkApproveToken={isApprovedToken}
                          setCheckApproveToken={setIsApprovedToken}
                          nativeAddress={nativeAddress}
                          handleBuyNFT={handleBuyNFT}
                          isLoadingApprove={isLoadingApprove}
                          refetch={refetch}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </>
            )
          )}
        </div>
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="p-4 mt-4 mb-16 border rounded-lg shadow-swiper lg:mb-0">
        <ul className='flex gap-4 p-2 mx-auto text-sm text-white rounded-lg bg-dark3 w-fit'>
          {TABS.map((item, index) => (
            <li key={index} onClick={() => setStatus(item.key)} className={`cursor-pointer p-2 ${status === item.key ? "rounded-lg bg-secondary5" : ""} `}>
              <h2 className='font-semibold'>{item.title}</h2>
            </li>
          )
          )}
        </ul>
        {isLoading ? (
          <div><BiLoaderAlt className="animate-spin text-secondary5" /></div>
        ) : (isSuccess && data) && (
          <div className='mt-5 lg:pb-0'>
            {selectedTab ? selectedTab.panel() : null}
          </div>
        )}
      </div>
    </div>
  );
}
