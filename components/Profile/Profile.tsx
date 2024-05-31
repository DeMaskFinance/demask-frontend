import AccountContext from "@/context/AccountContext";
import { selectProfile } from "@/store/profileSlice";
import Tippy from "@tippyjs/react/headless";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { BsCaretDownFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import "tippy.js/dist/tippy.css"; // optional
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { AvatarCustom } from "../Avatars";
import Copy from "../Common/Copy";
import { EditIcon } from "../Icons";
import TabQuery from "../NavChoice/TabQuery";
import History from "./History";
import Created from "./Inventory/Created";
import Items from "./Inventory/Items";
import Pools from "./Pools";
import UserLaunchpad from "./ProfileLaunchPad/UserLaunchpad";
import Referral from "./Referral";
const style = {
  btnWallet:
    "flex items-center h-10 hover:border-shader_600 dark:hover:bg-shader_600 pl-2 lg:px-4 pr-2 justify-center dark:bg-shader_700 dark:text-white text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-shader_500 bg-shader_600 active:bg-shader_500 text-shader_600 gap-x-2 ",
};
const Profile = () => {
  const { account, chainId } = useContext(AccountContext);
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "items"));
  const [visible, setVisible] = useState(true);
  const { profile } = useSelector(selectProfile);
  const TABS = [
    {
      title: "Items",
      panel: () => <Items />,
      key: "items",
    },
    {
      title: "Created",
      panel: () => <Created />,
      key: "created",
    },
    {
      title: "Pools",
      panel: () => <Pools />,
      key: "pools",
    },
    {
      title: "Launchpad",
      panel: () => <UserLaunchpad />,
      key: "launchpad",
    },
    {
      title: "History",
      panel: () => <History />,
      key: "history",
    },
    {
      title: "Referral",
      panel: () => <Referral />,
      key: "referral",
    },
    {
      title: "KYC",
      panel: () => <div className="text-shader_600">Upcoming</div>,
      key: "kyc",
    },
  ];
  const selectedTab = TABS.find((item) => item.key === tab);
  const indexChoice = TABS.findIndex((item) => item.key === tab);
  useEffect(() => {
    const closeTippy = () => {
      setVisible(false);
    };

    closeTippy();
    return () => {
      // cleanup code
    };
  }, [tab]);
  const fullTime = profile?.createdAt
    ? new Date(profile.createdAt)
    : new Date();
  const monthName = fullTime.toLocaleString("default", { month: "long" });
  return (
    <div className="my-6">
      <section>
        <div className="h-[120px] lg:h-[240px]">
          {profile?.banner ? (
            <Image
              src={profile?.banner}
              alt="banner"
              width={1200}
              height={400}
              className="w-full group-hover:brightness-[0.8] h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-shader_500 group-hover:brightness-[0.8]"></div>
          )}
        </div>
        <div className="flex items-center justify-center mt-6 gap-x-2">
          <AvatarCustom
            avatarUrl={profile?.avatar}
            size={120}
            userAddress={profile.userAddress!}
            className="w-[120px] h-[120px] rounded-full"
          />
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-2xl font-semibold">{profile?.name}</p>
              <Link href={`/profile/edit?chain=${chainId}`}>
                <EditIcon width={24} height={24} className="fill-shader_500" />
              </Link>
            </div>
            <div className="flex items-center gap-x-2">
              <span className="text-primary_500">{`${account.slice(
                0,
                6
              )}...${account.slice(-4)}`}</span>
              <Copy content={account} />
            </div>
            <div className="flex items-center gap-x-2">
              <span className="text-shader_500">
                Joined {monthName} {fullTime.getFullYear()}
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-start px-4 mt-6 md:justify-center">
        {/* PC */}
        <div className="hidden w-full md:block">
          <TabQuery TABS={TABS} initialItem="items" indexChoice={indexChoice} />
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
        </div>
      </div>
      <div className="px-4 py-8 pb-20 mt-4 lg:pb-0 3xl:px-secondary md:px-10 lg:px-24">
        {selectedTab ? selectedTab.panel() : null}
      </div>
    </div>
  );
};

export default Profile;
