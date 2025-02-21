import { BackgroundDefault } from "@/components/Backgrounds";
import Back from "@/components/Common/Back";
import { MediaNFT } from "@/components/Common/Media";
import { RightIcon } from "@/components/Icons";
import TabQuery from "@/components/NavChoice/TabQuery";
import AccountContext from "@/context/AccountContext";
import { LaunchpadService } from "@/libs/service/launchpadService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Overview from "./Overview";
import SaleLaunchPad from "./SaleLaunchPad";
import Team from "./Team";
import Link from "next/link";


export default function DetailLaunchPad() {
  const { chainId } = useContext(AccountContext);
  const router = useRouter();
  const [tab] = useQueryParam("tab", withDefault(StringParam, "overview"));
  const launchpadAddress = router.query.detail ? router.query.detail[0] : "";
  const unit = router.query.detail ? +router.query.detail[1] : 0;
  const { isLoading, data, isSuccess } = useQuery<LaunchpadData>({
    queryKey: ["launchPad", launchpadAddress, chainId],
    queryFn: async () => {
      const res = await LaunchpadService.LaunchPadInfor(
        launchpadAddress.toLocaleLowerCase(),
        chainId,
        unit
      );
      return res.data;
    },
  });

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
            {/* <Link href={`/colection/${data?.launchpadAddress}`} className="text-primary_300 flex items-center gap-x-1 text-sm">
              View Collection
              <RightIcon width={16} height={16} />
            </Link> */}
          </div>
          {isLoading ? (
            <div>
              <BiLoaderAlt className="animate-spin text-primary_400" />
            </div>
          ) : (
            isSuccess &&
            data && (
              <>
                <div className="flex flex-col md:flex-row gap-6 mb-14">
                  <div className="flex-1 rounded-lg overflow-hidden h-fit">
                    <MediaNFT data={data} isControls />
                  </div>
                  <SaleLaunchPad data={data} />
                </div>
                <TabQuery
                  TABS={TABS}
                  initialItem="overview"
                  indexChoice={indexChoice}
                  isDefault={false}
                />
                <div className="mt-5 lg:pb-0">
                  {selectedTab ? selectedTab.panel() : null}
                </div>
              </>
            )
          )}
        </div>
      </BackgroundDefault>
    </div>
  );
}
