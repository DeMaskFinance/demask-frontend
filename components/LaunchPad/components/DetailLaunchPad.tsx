import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { Button } from "@/components/Buttons";
import CountdownTime from "@/components/Common/CountdownTime";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon, LaunchpadStatus } from "@/components/Icons";
import { LogoIconTable } from "@/components/Logo/Logo";
import ModalClaimLaunchpad from "@/components/Modal/ModalClaimLaunchpad/ModalClaimLaunchpad";
import ModalLaunchPad from "@/components/Modal/ModalLaunchPad";
import ModalLaunchPadProfile from "@/components/Modal/ModalLaunchpadProfile";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { ModalError, ModalSuccess } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { LaunchPadAPI } from "@/libs/service/launchpadService";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Box from "./Box";
import ProgressBar from "./ProgessLaunchPad";
import Rule from "./Rule";
import Timeline from "./Timeline";

export default function DetailLaunchPad() {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isMaxBuy, setIsMaxBuy] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalRefund, setIsOpenModalRefund] = useState<boolean>(false);
  const [status, setStatus] = useQueryParam(
    "status",
    withDefault(StringParam, "rule")
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputNFT, setInpuNFT] = useState<any>(1);
  const [amountLeave, setAmountLeave] = useState(0);
  const [amount, setAmount] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [isOpenSuccessRefund, setIsOpenSuccessRefund] =
    useState<boolean>(false);
  const [isOpenErrorRefund, setIsOpenErrorRefund] = useState<boolean>(false);
  const [isOpenConfirmClaim, setIsOpenConfirmClaim] = useState(false);
  const { account, wallet, chainId, demask } = useContext(AccountContext);
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

  const { balanceToken } = useInformationToken(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );

  const currentTime = Math.floor(new Date().getTime() / 1000);
  const startTime = data?.startTime;
  const endTime = data?.endTime;

  useEffect(() => {
    if (data && data?.price) {
      setInpuNFT(+amount * (data?.price / 1e18));
    }
  }, [amount, data]);

  const checkTime = currentTime > startTime && currentTime < endTime;

  useEffect(() => {
    if (currentTime < startTime) {
      setErrors("Comming soon");
    } else if (!checkTime) {
      setErrors("Sold out");
    } else if (+totalSold + +amount * data.price >= parseInt(hardcap)) {
      setErrors("Sold out");
    } else if (inputNFT > balanceToken) {
      setErrors("Insufficient Token balance");
    } else if (inputNFT > data?.purchaseLimit / 1e18) {
      setErrors("Amount express");
    } else {
      setErrors("");
    }
  }, [startTime, endTime, inputNFT, amount]);

  const TABS = [
    {
      title: "Rule Introduction",
      panel: () => <Rule data={data} />,
      key: "rule",
    },
    {
      title: "Box Information",
      panel: () => <Box data={data} />,
      key: "box",
    },
    {
      title: "Timeline",
      panel: () => <Timeline />,
      key: "timeline",
    },
  ];

  const handleBuyNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!account) {
      setIsOpen(true);
      return;
    }

    const providerChoice = await getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(tokenLaunchpad, abiLaunchPad, signer);
    try {
      let result;
      setIsOpenTransaction(true);
      const estimatedGas = await contract.estimateGas.buy(
        exponentialToDecimal(+amount),
        {
          value: exponentialToDecimal(
            Math.floor(Number(data.price) * Number(amount))
          ),
        }
      );
      result = await contract.buy(exponentialToDecimal(+amount), {
        gasLimit: estimatedGas,
        value: exponentialToDecimal(
          Math.floor(Number(data.price) * Number(amount))
        ),
      });
      setHash(result.hash);
      const check = await result.wait();
      setIsOpenTransaction(false);
      setIsOpenModal(false);
      refetch();

      if (check.status === 1) {
        setIsOpenSuccessBuy(true);
      } else {
        setIsOpenErrorBuy(true);
      }

      setAmount("");
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
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
                  <h1 className="text-2xl font-medium text-dark0">
                    Detail Launchpad
                  </h1>
                  <div className="flex justify-between datas-center gap-x-1">
                    <CountdownTime
                      query={data.status}
                      blockNumber={blockNumber}
                      isSuccess={data.isSuccess}
                    />
                  </div>
                </div>
                <div className="block p-4 border rounded-lg lg:flex gap-x-8 shadow-swiper">
                  <div className="w-full lg:w-[50%] relative">
                    <MediaNFT data={data} isControls />
                    <div className="absolute top-0 right-0 ">
                      <LaunchpadStatus
                        width={100}
                        height={80}
                        className={`${
                          data.status === "Active"
                            ? "fill-secondary5"
                            : data.status === "Upcoming"
                            ? "fill-dark3"
                            : data.isSuccess
                            ? "fill-green"
                            : "fill-red"
                        }`}
                      />
                      <p className="absolute top-[50%] right-[50%] translate-x-[50%] text-sm -translate-y-[80%] text-white font-semibold">
                        {data.status === "Active"
                          ? "Sale"
                          : data.status === "Upcoming"
                          ? "Soon"
                          : data.isSuccess
                          ? "Success"
                          : "Failed"}
                      </p>
                    </div>
                  </div>
                  <div className=" w-full lg:w-[50%] mt-4 lg:mt-0">
                    <div className="relative max-w-full text-2xl font-semibold text-dark1">
                      <ModalDocument data={data.metadata.name} />
                    </div>
                    <div className="flex items-center text-3xl font-semibold datas-center text-secondary3">
                      <FormatNumber number={(data.price / 1e18).toString()} />
                      <EtherIcon
                        width={20}
                        height={20}
                        className="mb-2 fill-secondary3"
                      />
                    </div>
                    {account && (
                      <div className="p-2 border rounded-lg text-dark1 border-dark2 w-fit">
                        <p className="mb-2 font-normal">Your NFT Balance</p>
                        <p className="font-semibold">{data?.amount}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 my-3 lg:grid-cols-4 text-dark1">
                      <div>
                        <p>Supported</p>
                        <div className="flex justify-start">
                          <LogoIconTable
                            width={18}
                            height={18}
                            chainId={chainId}
                            className="float-left mt-1 gap-x-1"
                          />
                        </div>
                      </div>
                      <div>
                        <p>Total raise</p>
                        <div className="flex items-center mt-1 font-semibold gap-x-1">
                          <FormatNumber
                            number={(data.totalSold / 1e18).toString()}
                          />
                          <EtherIcon
                            width={16}
                            height={16}
                            className="mb-1 fill-dark1"
                          />
                        </div>
                      </div>
                      <div>
                        <p>Soft Cap</p>
                        <div className="flex items-center mt-1 font-semibold gap-x-1">
                          <FormatNumber
                            number={(data.softcap / 1e18).toString()}
                          />
                          <EtherIcon
                            width={16}
                            height={16}
                            className="mb-1 fill-dark1"
                          />
                        </div>
                      </div>
                      <div>
                        <p>Hard Cap</p>
                        <div className="flex items-center mt-1 font-semibold gap-x-1">
                          <FormatNumber
                            number={(data.hardcap / 1e18).toString()}
                          />
                          <EtherIcon
                            width={16}
                            height={16}
                            className="mb-1 fill-dark1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full lg:w-[80%]">
                      <p className="mb-2">Type</p>
                      <div className="flex justify-between p-2 rounded-lg datas-center bg-dark4">
                        <div className="flex item-center gap-x-2">
                          <div className="w-8 h-8">
                            <MediaNFT data={data} isControls launchpad={true} />
                          </div>
                          <div className="relative font-semibold text-dark1 max-w-[250px] flex items-center">
                            <ModalDocument data={data.metadata.name} />
                          </div>
                        </div>
                        <div className="flex items-center text-sm font-semibold text-secondary4">
                          <FormatNumber
                            number={(data.totalSold / 1e18).toString()}
                          />
                          /
                          <FormatNumber
                            number={(data.hardcap / 1e18).toString()}
                          />
                        </div>
                      </div>
                      <div className="my-3">
                        <p className="mb-4">Progress</p>
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
                            {data.status === "Ended" ? (
                              <div>
                                <p className="mb-2">
                                  Claiming & Refunding Phase
                                </p>
                                <div className="flex gap-x-2">
                                  {data.isClaim ? (
                                    <button
                                      // disabled={data.status === null ? true : !data.status}
                                      className={`border ${
                                        !data.status
                                          ? "text-white  bg-dark4"
                                          : "border-green bg-green hover:border-green hover:text-green hover:bg-white text-white"
                                      } px-6 py-2 rounded-lg transition-all text-sm font-medium`}
                                      onClick={() => {
                                        setIsOpenConfirmClaim(true);
                                      }}
                                    >
                                      Claim
                                    </button>
                                  ) : (
                                    <button
                                      // disabled={data.status === null ? true : data.status}
                                      className={`${
                                        Number(data.amount) >=
                                        Number(data.softcap)
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
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="mb-4 gap-x-4">
                                <div className="flex items-center">
                                  <p className="">Buying Phase</p>
                                  <div className="flex items-center text-xs">
                                    (
                                    {inputNFT ? (
                                      <FormatNumber
                                        number={inputNFT.toString()}
                                      />
                                    ) : (
                                      0
                                    )}
                                    <EtherIcon
                                      width={12}
                                      height={12}
                                      className="mb-[2px] fill-gray-600"
                                    />
                                    )
                                  </div>
                                </div>
                                <div className="text-dark2 text-[10px] font-medium mb-2 flex items-center">
                                  The maximum number of Tokens you can buy is{" "}
                                  <span className="ml-1 text-xs font-semibold text-secondary5">
                                    {Number(data.purchaseLimit) / 1e18}
                                  </span>
                                  <EtherIcon
                                    width={12}
                                    height={12}
                                    className=" fill-secondary3"
                                  />
                                </div>
                                <input
                                  onChange={(e) => {
                                    setAmount(e.target.value);
                                    if (
                                      Number(e.target.value) >
                                      Number(data.purchaseLimit - data.amount)
                                    ) {
                                      setIsMaxBuy(true);
                                    } else {
                                      setIsMaxBuy(false);
                                    }
                                  }}
                                  inputMode="numeric"
                                  onKeyDown={(event) => {
                                    if (
                                      !(event.key >= "0" && event.key <= "9") &&
                                      event.key !== "Backspace" &&
                                      event.key !== "ArrowLeft" &&
                                      event.key !== "ArrowRight"
                                    ) {
                                      event.preventDefault();
                                    }
                                  }}
                                  min="1"
                                  type="number"
                                  // disabled={errors !== "" ? true : false}
                                  className="px-2 py-2 mb-2 border rounded-md outline-none"
                                  value={amount}
                                />
                                <br />
                                {isMaxBuy && (
                                  <p
                                    className="mt-0 mb-2 ml-2 text-xs text-red"
                                    key="maxBuy"
                                  >
                                    Exceed the quantity that can be purchased(
                                    {Number(data.purchaseLimit - data.amount)})
                                  </p>
                                )}
                                <button
                                  disabled={
                                    errors !== "" || !amount || +amount < 1 ? true : false
                                  }
                                  onClick={() => {
                                    setIsOpenModal(!isOpenModal);
                                  }}
                                  className={`px-6 py-2 rounded-md text-sm text-white  ${
                                    errors !== "" || !amount || +amount < 1
                                      ? "bg-slate-400"
                                      : "bg-secondary2 text-white font-medium hover:bg-white hover:text-secondary5 border boder-white hover:border-secondary5 rounded-lg transition-all duration-150 ease-linear"
                                  }`}
                                >
                                  Buy
                                </button>
                                {amount && (
                                  <p className="mt-2 text-xs text-red">
                                    {errors}
                                  </p>
                                )}
                              </div>
                            )}
                            <ModalLaunchPad
                              setIsOpenTransaction={setIsOpenTransaction}
                              isOpenTransation={isOpenTransaction}
                              setIsOpenModal={setIsOpenModal}
                              isOpenModal={isOpenModal}
                              inputNFT={inputNFT}
                              handleBuyNFT={handleBuyNFT}
                              data={data}
                            />
                            <ModalClaimLaunchpad
                              data={data}
                              isOpenConfirmClaim={isOpenConfirmClaim}
                              setIsOpenConfirmClaim={setIsOpenConfirmClaim}
                              setHash={setHash}
                              setIsOpenSuccess={setIsOpenSuccess}
                              setIsOpenError={setIsOpenError}
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
        <ModalSuccess
          isOpenSuccess={isOpenSuccess}
          transactionHash={hash}
          type="Claim NFT Success"
          setIsOpenSuccess={setIsOpenSuccess}
        />
        <ModalError
          isOpenError={isOpenError}
          transactionHash={hash}
          type="Claim NFT Failed"
          setIsOpenError={setIsOpenError}
        />
        <ModalSuccess
          isOpenSuccess={isOpenSuccessBuy}
          transactionHash={hash}
          type="Buy NFT Success"
          setIsOpenSuccess={setIsOpenSuccessBuy}
        />
        <ModalError
          isOpenError={isOpenErrorBuy}
          transactionHash={hash}
          type="Buy NFT Failed"
          setIsOpenError={setIsOpenErrorBuy}
        />
        <ModalSuccess
          isOpenSuccess={isOpenSuccessRefund}
          transactionHash={hash}
          type="Refund NFT Success"
          setIsOpenSuccess={setIsOpenSuccessRefund}
        />
        <ModalError
          isOpenError={isOpenErrorRefund}
          transactionHash={hash}
          type="Refund NFT Failed"
          setIsOpenError={setIsOpenErrorRefund}
        />
        <ModalLaunchPadProfile
          isOpenModal={isOpenModalRefund}
          setIsOpenModal={setIsOpenModalRefund}
          isOpenTransation={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
          amount={+amount}
          setAmount={setAmount}
          setAmountLeave={setAmountLeave}
          amountLeave={amountLeave}
          tokenLaunchpad={tokenLaunchpad}
          refetch={refetch}
          setHash={setHash}
          setIsOpenSuccess={setIsOpenSuccessRefund}
          setIsOpenError={setIsOpenErrorRefund}
        />
      </div>
      <div className="p-4 mt-4 mb-16 border rounded-lg shadow-swiper lg:mb-0">
        <ul className="flex p-2 mx-auto text-sm text-white rounded-lg lg:gap-4 bg-dark3 w-fit">
          {TABS.map((data, index) => (
            <li
              key={index}
              onClick={() => setStatus(data.key)}
              className={`cursor-pointer p-2 ${
                status === data.key ? "rounded-lg bg-secondary5" : ""
              } `}
            >
              <h2 className="font-semibold">{data.title}</h2>
            </li>
          ))}
        </ul>
        {isLoading ? (
          <div>
            <BiLoaderAlt className="animate-spin text-secondary5" />
          </div>
        ) : (
          isSuccess &&
          data && (
            <div className="mt-5 lg:pb-0">
              {selectedTab ? selectedTab.panel() : null}
            </div>
          )
        )}
      </div>
    </div>
  );
}
