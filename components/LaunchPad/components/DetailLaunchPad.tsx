import { BackgroundDefault } from "@/components/Backgrounds";
import Back from "@/components/Common/Back";
import { RightIcon } from "@/components/Icons";
import { ModalError } from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import TabQuery from "@/components/NavChoice/TabQuery";
import SwiperCustom from "@/components/SwiperCustom";
import AccountContext from "@/context/AccountContext";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { SwiperSlide } from "swiper/react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Overview from "./Overview";
import SaleLaunchPad from "./SaleLaunchPad";
import Team from "./Team";
import { LaunchpadService } from "@/libs/service/launchpadService";
import { MediaNFT } from "@/components/Common/Media";

export default function DetailLaunchPad() {
  const [inputNFT, setInpuNFT] = useState<any>(1);
  const [amount, setAmount] = useState<string>("");
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const { account, chainId } = useContext(AccountContext);
  const router = useRouter();
  const [tab] = useQueryParam("tab", withDefault(StringParam, "overview"));
  const launchpadAddress = router.query.detail ? router.query.detail[0] : "";

  const { isLoading, data, isSuccess } = useQuery<LaunchpadData>({
    queryKey: ["launchPad", launchpadAddress, chainId],
    queryFn: async () => {
      const res = await LaunchpadService.LaunchPadInfor(
        launchpadAddress.toLocaleLowerCase(),
        chainId
      );
      return res.data;
    },
  });
  console.log(data);

  const TABS = [
    {
      title: "Overview",
      panel: () => <Overview data={data!} />,
      key: "overview",
    },
    {
      title: "Team",
      panel: () => <Team data={data!} />,
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
            <div>
              <BiLoaderAlt className="animate-spin text-primary_400" />
            </div>
          ) : (
            isSuccess &&
            data && (
              <>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 rounded-lg overflow-hidden h-fit">
                    <MediaNFT data={data} isControls />
                  </div>
                  <SaleLaunchPad data={data} />
                </div>
                <div className="mt-5 lg:pb-0">
                  {selectedTab ? selectedTab.panel() : null}
                </div>
              </>
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
        </div>
      </BackgroundDefault>
    </div>
  );
}
