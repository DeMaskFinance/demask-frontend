import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { BackgroundDefault } from "@/components/Backgrounds";
import Back from "@/components/Common/Back";
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
import Overview from "./Overview";
import Team from "./Team";
import SwiperCustom from "@/components/SwiperCustom";
import { SwiperSlide } from "swiper/react";
import { EtherIcon, RightIcon } from "@/components/Icons";
import { Button } from "@/components/Buttons";
import SaleLaunchPad from "./SaleLaunchPad";

export default function DetailLaunchPad() {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [inputNFT, setInpuNFT] = useState<any>(1);
  const [amount, setAmount] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const { account, chainId } = useContext(AccountContext);
  const router = useRouter();
  const [tab] = useQueryParam("tab", withDefault(StringParam, "overview"));
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

  const TABS = [
    {
      title: "Overview",
      panel: () => <Overview data={data} />,
      key: "overview",
    },
    {
      title: "Team",
      panel: () => <Team data={data} />,
      key: "team",
    },
  ];
  const indexChoice = TABS.findIndex((item) => item.key === tab);
  const selectedTab = TABS.find((data) => data.key === tab);

  return (
    <div className="max-w-[1221px] px-4 md:px-0 relative mx-auto font-semibold">
      <BackgroundDefault>
        <div className="">
          <div className="flex justify-between">
            <Back />
            <div className="text-primary_300 flex items-center gap-x-1 text-sm">
              View Collection
              <RightIcon width={16} height={16} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-[600px]">
              <div className="flex gap-8">
                <div className="h-[600px] bg-slate-700  lg:w-full animate-pulse rounded-lg"></div>
              </div>
            </div>
          ) : (
            data && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <Image
                    src="/images/test.png"
                    width={595}
                    height={595}
                    className="max-w-[595px] max-h-[595px] w-full"
                    alt="img_launchpad"
                  />
                  <div className="mt-4 ">
                    <SwiperCustom slidesPerView="auto">
                      <SwiperSlide className="swiper-item">
                        <Image
                          src="/images/test.png"
                          width={595}
                          height={595}
                          className="w-[136px] h-[136px]"
                          alt="img_launchpad"
                        />
                      </SwiperSlide>
                      <SwiperSlide className="swiper-item">
                        <Image
                          src="/images/test.png"
                          width={595}
                          height={595}
                          className="w-[136px] h-[136px]"
                          alt="img_launchpad"
                        />
                      </SwiperSlide>
                      <SwiperSlide className="swiper-item">
                        <Image
                          src="/images/test.png"
                          width={595}
                          height={595}
                          className="w-[136px] h-[136px]"
                          alt="img_launchpad"
                        />
                      </SwiperSlide>
                      <SwiperSlide className="swiper-item">
                        <Image
                          src="/images/test.png"
                          width={595}
                          height={595}
                          className="w-[136px] h-[136px]"
                          alt="img_launchpad"
                        />
                      </SwiperSlide>
                      <SwiperSlide className="swiper-item">
                        <Image
                          src="/images/test.png"
                          width={595}
                          height={595}
                          className="w-[136px] h-[136px]"
                          alt="img_launchpad"
                        />
                      </SwiperSlide>
                      <SwiperSlide className="swiper-item">
                        <Image
                          src="/images/test.png"
                          width={595}
                          height={595}
                          className="w-[136px] h-[136px]"
                          alt="img_launchpad"
                        />
                      </SwiperSlide>
                    </SwiperCustom>
                  </div>
                </div>
                <SaleLaunchPad />
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
        <div className="my-14  ">
          <TabQuery
            TABS={TABS}
            initialItem="overview"
            indexChoice={indexChoice}
            isDefault={false}
          />
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
