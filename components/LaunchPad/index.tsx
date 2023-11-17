import TabLaunchPad from "@/components/LaunchPad/components/TabLauchPad";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useState } from "react";
import { SEO } from "../../next-seo.config";

const updateMeta = {
  ...SEO,
  title: "Launchpad",
};

export default function Launchpad() {
  const [activeChoice, setActiveChoice] = useState(1);

  const listTab = [
    {
      name: "Coming",
      component: (
        <TabLaunchPad
          query={"Upcoming"}
          desc={"There are currently no launchpads in the list."}
        />
      ),
      index: 0,
    },
    {
      name: "Active",
      component: <TabLaunchPad query={"Active"} desc="There are currently no active launchpads." />,
      desc: "There are currently no active launchpads.",
      index: 1,
    },

    {
      name: "Ended",
      component: <TabLaunchPad query={"Ended"} desc="" />,
      desc: "",
      index: 2,
    },
  ];

  return (
    <section className="launchpad">
      <NextSeo {...updateMeta} />

      <div className="max-w-6xl min-h-screen pb-20 mx-auto lg:pb-0">
        <h1 className="pt-10 pb-6 text-2xl font-semibold text-center text-dark0">Launchpad</h1>
        <div className="flex flex-col justify-between gap-4 overflow-hidden rounded-lg lg:flex-row">
          <div
            className={`flex items-center p-1 gap-2 rounded-lg text-base text-center text-white  bg-dark3 w-max `}
          >
            {listTab.map((item, idx) => (
              <>
                <button
                  className={`lg:py-2 py-1 px-3 lg:px-6 ${activeChoice === item.index ? "bg-secondary5" : ""
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

          <Link
            href={"/launchpad/create"}
            className="flex px-2 py-1 text-sm text-white rounded-lg bg-dark3 hover:bg-secondary3 lg:pt-3 w-fit"
          >
            Create Launchpad
          </Link>
        </div>
        <div>{listTab[activeChoice].component}</div>
      </div>
    </section>
  );
}
