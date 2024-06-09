import React, { useContext, useState } from "react";
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
import ReferralUser from "./ReferralUser";
import AccountContext from "@/context/AccountContext";
const style = {
  btnWallet:
    "flex items-center h-10 hover:border-shader_600 dark:hover:bg-shader_600 pl-2 lg:px-4 pr-2 justify-center dark:bg-shader_700 dark:text-white text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-shader_500 bg-shader_600 active:bg-shader_500 text-shader_600 gap-x-2 ",
};
const Referral = () => {
  const [tab, setTab] = useQueryParam(
    "tab",
    withDefault(StringParam, "referrals")
  );
  const [visible, setVisible] = useState(true);
  const { chainId, account } = useContext(AccountContext);
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
      <h1 className="mb-3 text-2xl font-bold text-white">
        REFER AND EARN TOGETHER!
      </h1>
      <div className="mx-auto">
        <div className="flex flex-col justify-between mb-6 md:flex-row gap-y-6 text-shader_100">
          <div className="">
            <p>
              Accepting a referral boosts your DM Points by 
              <span className="text-primary_400">5%</span>.
            </p>
            <p>
              Recieve<span className="text-primary_400"> 5% ($Monad)</span>
               trading fee rebate.
            </p>
            <p>
              Receive DM Points.<span className="text-primary_400">+10%</span>{" "}
              forever!
            </p>

            <a
              href="https://docs.demask.finance/programs/refer-friends-to-earn"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-primary_400 font-semibold cursor-pointer mt-3`}
            >
              How is referral working?
            </a>
          </div>
          <ReferralUser />
        </div>
        {account && <StaticTable />}
        <div className="p-6 mt-6 border rounded-lg border-shader_500 bg-shader_700 border-shader_700">
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
                    className="w-[280px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-shader_500 font-medium bg-shader_700 border-shader_700"
                    tabIndex={-1}
                    {...attrs}
                  >
                    <ul className="flex flex-col mt-2 font-normal gap-y-3">
                      {TABS.map((item, index) => (
                        <li
                          key={index}
                          onClick={() => setTab(item.key)}
                          className={`cursor-pointer  p-2 ${
                            tab === item.key ? "rounded-lg bg-primary_400" : ""
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
