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
import { SendIcon } from "../Icons";
const style = {
  btnWallet:
    "flex items-center h-10 hover:border-shader_600  pl-2 lg:px-4 pr-2 justify-center text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-shader_500 bg-shader_600 active:bg-shader_500 text-shader_600 gap-x-2 ",
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
      <div className="mx-auto">
        <div className="flex flex-col justify-between mb-6 md:flex-row gap-y-6 text-shader_100">
          <div className="flex flex-col gap-y-3">
            <Image
              width={72}
              height={72}
              src="/images/referralDemask.png"
              alt="referral"
              className=""
            />
            <h1 className=" text-2xl font-bold text-white">
              REFER AND EARN TOGETHER!
            </h1>

            <div className="referral_send referral_active">
              <div className="overlay">
                <div className="flex items-center gap-x-2 pl-4 pr-1 z-10 rounded-full  text-sm  font-semibold bg-shader_800 relative w-full">
                  Share your referral link with friends
                  <SendIcon width={30} height={30} />
                </div>
              </div>
            </div>

            <div className="">
              <p>
                Accepting a referral boosts your DM Points by 
                <span className="text-primary_400">5%</span>.
              </p>
              <p>
                Recieve<span className="text-primary_400"> 5% </span>
                 trading fee rebate.
              </p>
              <p>
                Receive DM Points.<span className="text-primary_400">+10%</span>{" "}
                forever!
              </p>
            </div>
            <a
              href="https://docs.demask.finance/programs/refer-friends-to-earn"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-primary_400 font-semibold cursor-pointer`}
            >
              How is referral working?
            </a>
          </div>
          <ReferralUser />
        </div>
        {account && <StaticTable />}
        <div className=" mt-6 ">
          <div className="flex items-center">
            {/* PC */}
            <div>
              <TabQuery
                TABS={TABS}
                initialItem="items"
                indexChoice={indexChoice}
                isDefault={false}
              />
            </div>
            {/* mobile-tablet */}
            {/* <div className="md:hidden">
              <Tippy
                className=""
                interactive
                hideOnClick
                visible={visible}
                onClickOutside={() => setVisible(false)}
                render={(attrs) => (
                  <div
                    className="w-[280px] px-2 pt-1 pb-1 border text-sm rounded-lg shadow-xl box border-shader_500 font-medium bg-shader_700 "
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
            </div> */}
          </div>
          <div className="">{selectedTab ? selectedTab.panel() : null}</div>
        </div>
      </div>
    </div>
  );
};

export default Referral;
