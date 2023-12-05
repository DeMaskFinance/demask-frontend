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
import { EtherIcon, LaunchpadStatus, ZkSyncIconTable } from "@/components/Icons";
import Rule from "./Rule";
import Box from "./Box";
import Timeline from "./Timeline";
import FormatNumber from "@/components/Common/FormatNumber";
import { Button } from "@/components/Buttons";
import CountdownTime from "@/components/Common/CountdownTime";
import { BiLoaderAlt } from "react-icons/bi";
import Link from "next/link";
import handleReleaseLaunchPad from "@/libs/utils/handleReleaseLaunchPad";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import ModalLaunchPadProfile from "@/components/Modal/ModalLaunchpadProfile";

export default function DetailLaunchPad() {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isMaxBuy, setIsMaxBuy] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalRefund, setIsOpenModalRefund] = useState<boolean>(false);
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
  const router = useRouter();
  const { detail } = router.query;

  useEffect(() => {
    if (detail) {
      setTokenAddress(detail[0]);
    }
  }, [detail]);
  const { isLoading, data, isRefetching, isSuccess, refetch } = useQuery({
    queryKey: ["launchPad", tokenAddress, chainId, account],
    queryFn: async () => {
      const res = await LaunchPadAPI(
        tokenAddress.toLocaleLowerCase(),
        chainId,
        account
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
    else if (amount > (data?.purchaseLimit - data.amount)) {
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
        <Rule data={data} />
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
      // const valueToSend = tokenAddress === nativeAddress ? exponentialToDecimal(Math.floor(Number(data.price) * Number(amount))) : 0;
      // console.log({
      //   amount,
      //   valueToSend
      // });
      setIsOpenTransaction(true);
      // const estimatedGas = await contract.estimateGas.buy(150, { value: exponentialToDecimal(Math.floor(Number(data.price) * Number(amount))) });
      // console.log(estimatedGas);

      result = await contract.buy(exponentialToDecimal(amount), { gasLimit: 8000000, value: exponentialToDecimal(Math.floor(Number(data.price) * Number(amount))) });

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
  console.log(isMaxBuy);

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
                  <div className="w-full lg:w-[50%] relative">
                    <MediaNFT data={data} isControls />
                    <div className="absolute top-0 right-0 ">
                      <LaunchpadStatus width={100} height={80} className={`${data.status === "Active" ? 'fill-secondary5' : data.status === "Upcoming" ? 'fill-dark3' : 'fill-green'}`} />
                      <p className="absolute top-[50%] right-[50%] translate-x-[50%] text-sm -translate-y-[80%] text-white font-semibold">
                        {data.status === "Active" ? 'Sale' : data.status === "Upcoming" ? 'Soon' : 'Failed'}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full lg:w-[50%] mt-4 lg:mt-0">
                    <div className="relative text-2xl font-semibold text-dark1">
                      <ModalDocument data={data.metadata.name} />
                    </div>
                    <div className="flex items-center text-3xl font-semibold datas-center text-secondary3">
                      <FormatNumber number={(data.price / 1e18).toString()} />
                      <EtherIcon width={20} height={20} className="mb-2 fill-secondary3" />
                    </div>
                    <div className="p-2 border rounded-lg text-dark1 border-dark2 w-fit">
                      <p className="mb-2 font-normal">Your NFT Balance</p>
                      <p className="font-semibold">{data?.amount}</p>
                    </div>
                    <div className="grid grid-cols-2 my-3 lg:grid-cols-4 text-dark1">
                      <div>
                        <p>Supported</p>
                        <ZkSyncIconTable width={14} height={14} className="float-left mt-1 gap-x-1" />
                      </div>
                      <div>
                        <p>Total raise</p>
                        <div className="flex items-center mt-1 font-semibold gap-x-1">
                          <FormatNumber number={(data.price / 1e18 * data.totalSold).toString()} />
                          <EtherIcon width={16} height={16} className="mb-1 fill-dark1" />
                        </div>
                      </div>
                      <div>
                        <p>Soft Cap</p>
                        <div className="flex items-center mt-1 font-semibold gap-x-1">
                          <FormatNumber number={(data.softcap / 1e18).toString()} />
                          <EtherIcon width={16} height={16} className="mb-1 fill-dark1" />
                        </div>
                      </div>
                      <div>
                        <p>Hard Cap</p>
                        <div className="flex items-center mt-1 font-semibold gap-x-1">
                          <FormatNumber number={(data.hardcap / 1e18).toString()} />
                          <EtherIcon width={16} height={16} className="mb-1 fill-dark1" />
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[80%]">
                      <p className="mb-2">Type</p>
                      <div className="flex justify-between p-2 rounded-lg datas-center bg-dark4">
                        <div className="flex item-center gap-x-2">
                          <div className="w-8 h-8">
                            <MediaNFT data={data} isControls launchpad={true}/>
                          </div>
                          <div className="relative font-semibold text-dark1 max-w-[250px] flex items-center">
                            <ModalDocument data={data.metadata.name} />
                          </div>
                        </div>
                        <div className="flex items-center text-sm font-semibold text-secondary4">
                          <FormatNumber number={(data.price / 1e18 * data.totalSold).toString()} />/<FormatNumber number={(data.hardcap / 1e18).toString()} />
                        </div>
                      </div>
                      <div className="my-3">
                        <p className="mb-2">Progress</p>
                        <ProgressBar
                          softcap={softcap}
                          hardcap={hardcap}
                          amount={totalSold * data.price}
                          isRefetching={isRefetching}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="">
                        {account ? (
                          <>
                            <div className="mb-4 gap-x-4">
                              <p className="">Buying Phase</p>
                              <p className="text-dark2 text-[10px] font-medium mb-2">The maximum amount of NFTs you can buy is <span className="text-xs font-semibold text-secondary5">{Number(data.purchaseLimit - data.amount)}</span></p>
                              <input
                                onChange={(e) => {
                                  setAmount(parseFloat(e.target.value))
                                  if (Number(e.target.value) > Number(data.purchaseLimit - data.amount)) {
                                    setIsMaxBuy(true);
                                  } else {
                                    setIsMaxBuy(false);
                                  }
                                }}
                                type="number"
                                // disabled={errors !== "" ? true : false}
                                className="px-2 mb-2 border rounded-md outline-none"
                                value={amount}
                              /><br />
                              {isMaxBuy && (
                                <p
                                  className="mt-0 mb-2 ml-2 text-xs text-red"
                                  key="maxBuy"
                                >
                                  Exceed the quantity that can be purchased({Number(data.purchaseLimit - data.amount)})
                                </p>
                              )}
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
                            {data.status === 'Ended' && (
                              <div >
                                <p className="mb-2">Claiming & Refunding Phase</p>
                                <div className="flex gap-x-2">
                                  {
                                    Number(data.amount) < Number(data.softcap) && (
                                      <button
                                        // disabled={data.status === null ? true : data.status}
                                        className={`${Number(data.amount) >= Number(data.softcap)
                                          ? "text-white  bg-dark4"
                                          : "text-red border border-red hover:border-red hover:text-white hover:bg-red"
                                          }  px-6 py-2 rounded-lg transition-all text-sm font-medium`}
                                        onClick={() => {
                                          setIsOpenModalRefund(true);
                                          setAmount(data?.amount);
                                          setAmountLeave(data?.amount);
                                        }}
                                      >
                                        Refund
                                      </button>
                                    )
                                  }
                                  {data.isClaim && (
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
                                  )}
                                </div>
                              </div>
                            )}
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
                              data={data}
                            />
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

        <ModalLaunchPadProfile
          isOpenModal={isOpenModalRefund}
          setIsOpenModal={setIsOpenModalRefund}
          isOpenTransation={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
          amount={amount}
          setAmount={setAmount}
          setAmountLeave={setAmountLeave}
          amountLeave={amountLeave}
          tokenLaunchpad={tokenLaunchpad}
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
