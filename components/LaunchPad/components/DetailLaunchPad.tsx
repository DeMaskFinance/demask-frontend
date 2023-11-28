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
import Link from "next/link";
import handleReleaseLaunchPad from "@/libs/utils/handleReleaseLaunchPad";

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
  const [amountLeave, setAmountLeave] = useState(0);
  const [amount, setAmount] = useState(1);
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
  const selectedTab = TABS.find((data) => data.key === status);
  const blockNumber =
    data?.status === "Upcoming"
      ? data.startTime
      : data?.status === "Active"
        ? data.endTime
        : "";

  return (
    <div>
      <div className="">
        <div className="">
          {isLoading ? (
            <div className="h-[600px]">
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
                  <div className="flex justify-between datas-center gap-x-1">
                    <div className="text-[10px] border border-secondary2  text-secondary2 transition-all duration-150 hover:text-white hover:bg-secondary2 rounded-lg h-6 px-2 datas-end leading-6">
                      <Link href={`/launchpad?choice=${data.status}`}>
                        {data.status}
                      </Link>
                    </div>
                    <CountdownTime query={data.status} blockNumber={blockNumber} />
                  </div>
                </div>
                <div className="block p-4 border rounded-lg lg:flex gap-x-8 shadow-swiper">
                  <div className="w-full lg:w-[50%]">
                    <MediaNFT data={data} isControls />
                  </div>
                  <div className=" w-full lg:w-[50%] mt-4 lg:mt-0">
                    <h1 className="text-2xl font-semibold text-dark1">{data.metadata.name}</h1>
                    <div className="flex my-3 font-semibold datas-center text-dark3">
                      <AvatarUser width={32} height={32} />
                      <p>{`${data.creator.slice(0, 4)}...${data.creator.slice(-4)}`}</p>
                    </div>
                    <div className="flex items-center text-3xl font-semibold datas-center text-secondary3">
                      <FormatNumber number={(data.price / 1e18).toString()} />
                      <EtherIcon width={20} height={20} className="mb-2  fill-secondary3" />
                    </div>
                    <div className="grid grid-cols-2 my-3 lg:grid-cols-4 text-dark1">
                      <div>
                        <p>Supported</p>
                        <ZkSyncIconTable width={14} height={14} className="float-left mt-1 gap-x-1" />
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
                      <div className="flex justify-between p-2 rounded-lg datas-center bg-dark4">
                        <div className="flex datas-center gap-x-2">
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
                      <div className="">
                        {account ? (
                          <>
                            <div className="mb-4 gap-x-4">
                              <p className="mb-2">Buying Phase</p>
                              <input
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                type="number"
                                // disabled={errors !== "" ? true : false}
                                className="px-2 mb-2 border rounded-md outline-none"
                                value={amount}
                              /><br />
                              <button
                                disabled={errors !== "" ? true : false}
                                onClick={() => {
                                  setIsOpenModal(!isOpenModal);
                                }}
                                className={`px-6 py-2 rounded-md text-sm text-white  ${errors !== "" ? "bg-slate-400" : "bg-secondary2 text-white font-medium hover:bg-white hover:text-secondary5 border boder-white hover:border-secondary5 rounded-lg transition-all duration-150 ease-linear"
                                  }`}
                              >
                                Buy
                              </button>
                            </div>
                            <div >
                              <p className="mb-2">Claiming & Refunding Phase</p>
                              <div className="flex gap-x-2">
                                <button
                                  disabled={data.status === null ? true : data.status}
                                  className={`${data.status === null || data.status
                                    ? "text-white  bg-dark4"
                                    : "text-red border border-red hover:border-red hover:text-red hover:bg-white"
                                    }  px-6 py-2 rounded-lg transition-all text-sm font-medium`}
                                  onClick={() => {
                                    setIsOpenModal(true);
                                    setAmount(data?.amount);
                                    setAmountLeave(data?.amount);
                                  }}
                                >
                                  Leave
                                </button>
                                <button
                                  // disabled={data.status === null ? true : !data.status}
                                  className={`border ${!data.status
                                    ? "text-white  bg-dark4"
                                    : "border-green bg-green hover:border-green hover:text-green hover:bg-white text-white"
                                    } px-6 py-2 rounded-lg transition-all text-sm font-medium`}
                                  onClick={() => {
                                    handleReleaseLaunchPad(
                                      account,
                                      wallet,
                                      data.launchpad,
                                      setIsOpenModal,
                                      setIsOpenTransaction
                                    );
                                  }}
                                >
                                  Claim
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <Button
                            className="w-[144px] py-2 mt-2"
                            primary
                            onClick={handleOpen}
                          >
                            CONNECT WALLET
                          </Button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </>
            )
          )}
        </div>
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
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
      <div className="p-4 mt-4 mb-16 border rounded-lg shadow-swiper lg:mb-0">
        <ul className='flex gap-4 p-2 mx-auto text-sm text-white rounded-lg bg-dark3 w-fit'>
          {TABS.map((data, index) => (
            <li key={index} onClick={() => setStatus(data.key)} className={`cursor-pointer p-2 ${status === data.key ? "rounded-lg bg-secondary5" : ""} `}>
              <h2 className='font-semibold'>{data.title}</h2>
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
