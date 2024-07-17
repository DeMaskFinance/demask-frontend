import TabLaunchPad from "@/components/LaunchPad/components/TabLauchPad";
import { NextSeo } from "next-seo";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { SEO } from "../../next-seo.config";
import TabQuery from "../NavChoice/TabQuery";
import Image from "next/image";
import { EtherIcon, RightIcon } from "../Icons";
import { Button } from "../Buttons";
import SliderLaunchPad from "./components/SliderLaunchPad";

const updateMeta = {
  ...SEO,
  title: "Launchpad",
};

export default function Launchpad() {
  const [tab, setTab] = useQueryParam(
    "tab",
    withDefault(StringParam, "live_coming")
  );
  const listTab = [
    {
      key: "live_coming",
      title: "Live & Coming Soon",
      component: <TabLaunchPad query={"Upcoming"} />,
      index: 0,
    },
    {
      key: "finished",
      title: "Finished",
      component: <TabLaunchPad query={"Active"} />,
      index: 1,
    },
  ];
  const selectedTab = listTab.find((item) => item.key === tab);
  const indexChoice = listTab.findIndex((item) => item.key === tab);
  return (
    <section className="launchpad">
      <NextSeo {...updateMeta} />
      <SliderLaunchPad />
      <div className="px-3 md:px-10">
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
