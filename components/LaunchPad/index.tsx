import React, { useState } from "react";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import TabLaunchPad from "@/components/LaunchPad/components/TabLauchPad";
import PendingLaunchPad from "@/components/LaunchPad/components/PendingLaunchPad";
import EndedLaunchPad from "@/components/LaunchPad/components/EndedLaunchPad";
import { TabGroups } from "@/components/NavChoice";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";

const updateMeta = {
  ...SEO,
  title: "Launchpad",
};
export default function Launchpad() {
  const [activeChoice, setActiveChoice] = useState(0);

  const listTab = [
    {
      name: "Upcoming",
      component: <TabLaunchPad query={"Upcoming"} />,
      index: 0,
    },
    {
      name: "Active",
      component: <TabLaunchPad query={"Active"} />,
      index: 1,
    },

    {
      name: "Ended",
      component: <TabLaunchPad query={"Ended"} />,

      index: 2,
    },
  ];

  return (
    <section className="launchpad">
      <NextSeo {...updateMeta} />

      <div className="max-w-6xl mx-auto min-h-screen">
        <div className="pt-12 flex rounded-lg overflow-hidden justify-center">
          <div
            className={`flex items-center p-1 gap-2 rounded-lg text-base text-center text-white  bg-dark3 w-max `}
          >
            {listTab.map((item, idx) => (
              <>
                <button
                  className={`py-2 px-3 lg:px-6 ${
                    activeChoice === item.index ? "bg-secondary5" : ""
                  } rounded-lg text-sm`}
                  type="button"
                  onClick={() => {
                    setActiveChoice(idx);
                  }}
                >
                  {item.name}
                </button>
              </>
            ))}
          </div>
        </div>
        <div>{listTab[activeChoice].component}</div>
      </div>
    </section>
  );
}
