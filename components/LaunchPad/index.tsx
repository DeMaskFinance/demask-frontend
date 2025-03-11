import TabLaunchPad from "@/components/LaunchPad/components/TabLauchPad";
import { NextSeo } from "next-seo";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { SEO } from "../../next-seo.config";
import TabQuery from "../NavChoice/TabQuery";
import SliderLaunchPad from "./components/SliderLaunchPad";
import { LaunchpadStatus } from "@/enums/launchpad-status";

const updateMeta = {
  ...SEO,
  title: "Launchpad",
};

export default function Launchpad({ initialData }: any) {
  const [tab] = useQueryParam("tab", withDefault(StringParam, "live"));
  const listTab = [
    {
      key: "live",
      title: "Live & Coming Soon",
      component: <TabLaunchPad query={LaunchpadStatus.Live} initialData={initialData?.Live} />,
      index: 0,
    },
    {
      key: "ended",
      title: "Finished",
      component: <TabLaunchPad query={LaunchpadStatus.Ended} initialData={initialData?.Ended} />,
      index: 1,
    },
  ];
  const selectedTab = listTab.find((item) => item.key === tab);
  const indexChoice = listTab.findIndex((item) => item.key === tab);
  return (
    <section className="launchpad">
      <NextSeo {...updateMeta} />
      <SliderLaunchPad />
      <div className="px-3 md:px-10 mb-4">
        <TabQuery
          TABS={listTab}
          initialItem={tab}
          indexChoice={indexChoice}
          isDefault={false}
        />
      </div>
      {selectedTab && selectedTab.component}
    </section>
  );
}
