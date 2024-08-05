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

export default function Launchpad() {
  const [tab] = useQueryParam("tab", withDefault(StringParam, "live"));
  const listTab = [
    {
      key: "live",
      title: "Live & Coming Soon",
      component: <TabLaunchPad query={LaunchpadStatus.Live} />,
      index: 0,
    },
    {
      key: "ended",
      title: "Finished",
      component: <TabLaunchPad query={LaunchpadStatus.Ended} />,
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
