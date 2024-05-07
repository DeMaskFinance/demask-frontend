import React, { useState } from "react";
import MyReferral from "./MyReferral";
import Rewards from "./Rewards";
import Others from "./Others";
import Leaderboard from "./Leaderboard";
import Image from "next/image";
import TabQuery from "../NavChoice/TabQuery";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Tippy from "@tippyjs/react/headless";
import { BsCaretDownFill } from "react-icons/bs";
import StaticTable from "./StaticTable";
const style = {
  btnWallet:
    "flex items-center h-10 hover:border-dark2 dark:hover:bg-dark2 pl-2 lg:px-4 pr-2 justify-center dark:bg-dark1 dark:text-white text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-dark4 bg-dark5 active:bg-dark3 text-dark2 gap-x-2 ",
};
const Referral = () => {
  const [tab, setTab] = useQueryParam(
    "tab",
    withDefault(StringParam, "referrals")
  );
  const [visible, setVisible] = useState(true);
  const TABS = [
    {
      title: "My Referrals",
      panel: () => <MyReferral />,
      key: "referrals",
    },
    {
      title: "My Rewards",
      panel: () => <Rewards />,
      key: "rewards",
    },
    {
      title: "Refer Others",
      panel: () => <Others />,
      key: "others",
    },
    {
      title: "Leaderboard",
      panel: () => <Leaderboard />,
      key: "leaderboard",
    },
  ];
  const selectedTab = TABS.find((item) => item.key === tab);
  const indexChoice = TABS.findIndex((item) => item.key === tab);
  return (
    <div>
      <h1 className="text-3xl font-semibold text-center text_gradient">
        Refer and Earn together!
      </h1>
      <div className="mx-auto">
        <div className="">
          <Image
            src="/images/referral.png"
            width={470}
            height={300}
            alt="img_referral"
            className="object-cover my-6"
          />
          <p>Receive DM Points.+10% forever!</p>
          <p>Recieve 5% ($Monad)trading fee rebate.</p>
          <p>Accepting a referral boosts your DM Points by 5%.</p>
          <p className={`text-secondary5 font-semibold cursor-pointer mb-6`}>
            How is referral working?
          </p>
        </div>
        <StaticTable />
        <div className="border rounded-lg border-dark4 min-h-[610px] p-6 mt-6 area_input">
          <div className="flex items-center mb-4">
            {/* PC */}
            <div className="hidden md:block">
              <TabQuery
                TABS={TABS}
                initialItem="items"
                indexChoice={indexChoice}
              />
            </div>
            {/* mobile-tablet */}
            <div className="md:hidden">
              <Tippy
                className=""
                interactive
                hideOnClick
                visible={visible}
                onClickOutside={() => setVisible(false)}
                render={(attrs) => (
                  <div
                    className="w-[280px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium area_input"
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul className="flex flex-col mt-2 font-normal gap-y-3">
                      {TABS.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => setTab(item.key)}
                          className={`cursor-pointer area_input_hover p-2 ${
                            tab === item.key ? "rounded-lg bg-secondary5" : ""
                          } `}
                        >
                          <h2 className="font-semibold">{item.title}</h2>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              >
                <button
                  className={`${style.btnWallet} flex`}
                  onClick={() => setVisible(true)}
                >
                  {selectedTab?.title}
                  <span className="lg:hidden">
                    <BsCaretDownFill />
                  </span>
                </button>
              </Tippy>
            </div>
          </div>
          <div className="">{selectedTab ? selectedTab.panel() : null}</div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
