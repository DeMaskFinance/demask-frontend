import TabLaunchPad from "@/components/LaunchPad/components/TabLauchPad";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useState } from "react";
import { SEO } from "../../next-seo.config";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { LaunchpadGradientIcon } from "../Icons/Mobile/IconMobile";
import TabQuery from "../NavChoice/TabQuery";
import { title } from "process";

const updateMeta = {
  ...SEO,
  title: "Launchpad",
};

export default function Launchpad() {
  const [tab, setTab] = useQueryParam(
    "tab",
    withDefault(StringParam, "Active")
  );
  const listTab = [
    {
      key: "Upcoming",
      title: "Upcoming",
      component: (
        <TabLaunchPad
          query={"Upcoming"}
          desc={"There are currently no launchpads in the list."}
        />
      ),
      index: 0,
    },
    {
      key: "Active",
      title: "Active",
      component: (
        <TabLaunchPad
          query={"Active"}
          desc="There are currently no active launchpads."
        />
      ),
      desc: "There are currently no active launchpads.",
      index: 1,
    },

    {
      key: "Ended",
      title: "Ended",
      component: <TabLaunchPad query={"Ended"} desc="" />,
      desc: "",
      index: 2,
    },
  ];
  const selectedTab = listTab.find((item) => item.key === tab);

  return (
    <section className="launchpad">
      <NextSeo {...updateMeta} />

      <div className="max-w-6xl min-h-screen pb-20 mx-auto lg:pb-0">
        <div className="flex flex-wrap justify-between pt-10 pb-6 gap-y-2">
        <div className="flex items-center gap-x-2">
          <LaunchpadGradientIcon width={20} height={20}/>
          <h1 className="text-2xl font-semibold text_gradient">
            Launchpad
          </h1>
        </div>
        <div className="flex flex-col justify-between gap-4 overflow-hidden rounded-lg lg:flex-row">
          <TabQuery TABS={listTab} initialItem="Active"/>
        </div>
        </div>
        <div>{selectedTab?.component}</div>
      </div>
    </section>
  );
}
