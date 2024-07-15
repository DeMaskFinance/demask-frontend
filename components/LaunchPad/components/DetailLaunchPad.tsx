import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { BackgroundDefault } from "@/components/Backgrounds";
import { ModalError } from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import TabQuery from "@/components/NavChoice/TabQuery";
import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { LaunchPadAPI } from "@/libs/service/launchpadService";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Box from "./Box";
import Rule from "./Rule";
import Timeline from "./Timeline";

export default function DetailLaunchPad() {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [inputNFT, setInpuNFT] = useState<any>(1);
  const [amount, setAmount] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const [isOpenSuccessBuy, setIsOpenSuccessBuy] = useState<boolean>(false);
  const [isOpenErrorBuy, setIsOpenErrorBuy] = useState<boolean>(false);
  const [isOpenSuccessRefund, setIsOpenSuccessRefund] =
    useState<boolean>(false);
  const [isOpenErrorRefund, setIsOpenErrorRefund] = useState<boolean>(false);
  const { account, wallet, chainId, demask } = useContext(AccountContext);
  const [errors, setErrors] = useState<string>("");
  const router = useRouter();
  const [tab] = useQueryParam("tab", withDefault(StringParam, "rule"));
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

  const currentTime = Math.floor(new Date().getTime() / 1000);
  const startTime = data?.startTime;
  const endTime = data?.endTime;

  useEffect(() => {
    if (data && data?.price) {
      setInpuNFT(+amount * (data?.price / 1e18));
    }
  }, [amount, data]);

  const checkTime = currentTime > startTime && currentTime < endTime;

  // useEffect(() => {
  //   if (currentTime < startTime) {
  //     setErrors("Comming soon");
  //   } else if (!checkTime) {
  //     setErrors("Sold out");
  //   } else if (+totalSold + +amount * data.price >= parseInt(hardcap)) {
  //     setErrors("Sold out");
  //   } else if (inputNFT > balanceToken) {
  //     setErrors("Insufficient Token balance");
  //   } else if (inputNFT > data?.purchaseLimit / 1e18) {
  //     setErrors("Amount express");
  //   } else {
  //     setErrors("");
  //   }
  // }, [startTime, endTime, inputNFT, amount]);

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
  const indexChoice = TABS.findIndex((item) => item.key === tab);
  const handleBuyNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!account) {
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
  const selectedTab = TABS.find((data) => data.key === tab);
  const blockNumber =
    data?.status === "Upcoming"
      ? data.startTime
      : data?.status === "Active"
      ? data.endTime
      : "";

  return (
    <div className="max-w-5xl px-4 relative mx-auto">
      <BackgroundDefault>
        <div className="">
          {isLoading ? (
            <div className="h-[600px]">
              <div className="flex gap-8">
                <div className="h-[600px] bg-slate-700  lg:w-full animate-pulse rounded-lg"></div>
              </div>
            </div>
          ) : (
            data && (
              <div>
                <div>
                  <Image
                    src=""
                    width={1000}
                    height={1000}
                    alt="img_launchpad"
                  />
                </div>
              </div>
            )
          )}
        </div>
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
        <div className="p-4 mt-4 mb-16 border rounded-lg shadow-swiper lg:mb-0 ">
          <div className="flex justify-center">
            <TabQuery
              TABS={TABS}
              initialItem="rule"
              indexChoice={indexChoice}
              isDefault
            />
          </div>
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin text-primary_400" />
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
      </BackgroundDefault>
    </div>
  );
}
