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
import {
  EditIcon,
  EyeIcon,
  SeeMoreIcon,
  TeleIcon,
  TwitterIcon,
  WebsiteIcon,
} from "../Icons";
import TabQuery from "../NavChoice/TabQuery";
import History from "./History";
import Created from "./Inventory/Created";
import Items from "./Inventory/Items";
import Pools from "./Pools";
import UserLaunchpad from "./ProfileLaunchPad/UserLaunchpad";
import Referral from "./Referral";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../Buttons";
import { briefDocument } from "@/libs/utils/formatComon";
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
      title: "Activity",
      panel: () => <History />,
      key: "history",
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
  const yearName = fullTime.toLocaleString("default", { year: "numeric" });
  console.log(profile);

  return (
    <div className="">
      <section>
        <div className="flex gap-x-3 text-sm p-4 bg-shader_700">
          <AvatarCustom
            avatarUrl={profile?.avatar}
            size={120}
            userAddress={profile.userAddress!}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-lg title">{profile?.name}</p>
            </div>
            <div className="flex items-center gap-x-1">
              <span className="text-shader_200 text-sm font-normal">
                {briefDocument(account, 8, 8)}
              </span>
              <Copy content={account} />
            </div>
            <div className="flex items-center gap-x-2 mt-[10px]">
              <Button primary className="px-2 h-8">
                <Link
                  href={`/profile/edit?chain=${chainId}`}
                  className="flex gap-x-2 text-sm items-center"
                >
                  <span>Edit</span>
                  <EditIcon width={16} height={16} />
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex h-8 px-3 text-sm  gap-x-2" third>
                    <p>Description</p>
                    <EyeIcon width={16} height={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-shader_800 border border-shader_500 p-4">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold text-white">
                      Description
                    </DialogTitle>
                    <DialogDescription>
                      <div className="flex gap-x-2 mb-2"></div>
                      <p className="font-semibold text-primary_400">
                        Joined {monthName} {yearName}
                      </p>
                      <p className="mt-1 text-shader_200">
                        {profile?.about ? profile?.about : "No data"}
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <p className="w-[1px] h-4 bg-shader_400"></p>
              {profile.socials?.website && (
                <a href={profile.socials?.website} target="_blank">
                  <WebsiteIcon width={18} height={18} />
                </a>
              )}
              {profile.socials?.twitter && (
                <a href={profile.socials?.twitter} target="_blank">
                  <TwitterIcon width={18} height={18} />
                </a>
              )}
              {profile.socials?.telegram && (
                <a href={profile.socials?.telegram} target="_blank">
                  <TeleIcon width={18} height={18} />
                </a>
              )}
              <SeeMoreIcon />
            </div>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-start md:justify-center">
        {/* PC */}
        <div className="hidden w-full md:block border-y border-shader_600">
          <TabQuery
            TABS={TABS}
            initialItem="items"
            indexChoice={indexChoice}
            isDefault={false}
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
      <div className="px-4">{selectedTab ? selectedTab.panel() : null}</div>
    </div>
  );
};

export default Profile;
