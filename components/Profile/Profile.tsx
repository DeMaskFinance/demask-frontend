import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import { briefDocument, formatLinkIPFS } from "@/libs/utils/formatComon";
import { selectProfile } from "@/store/profileSlice";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tippy.js/dist/tippy.css";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { AvatarCustom } from "../Avatars";
import { Button } from "../Buttons";
import Copy from "../Common/Copy";
import {
  DiscordIcon,
  EditIcon,
  EyeIcon,
  FacebookIcon,
  GithubIcon,
  SeeMoreIcon,
  TeleIcon,
  TwitterIcon,
  WebsiteIcon,
} from "../Icons";
import TabQuery from "../NavChoice/TabQuery";
import History from "./Activity";
import Created from "./Inventory/Created";
import Items from "./Inventory/Items";
import Pools from "./Pools";
import Image from "next/image";

const Profile = () => {
  const { account } = useContext(AccountContext);
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
    // {
    //   title: "Launchpad",
    //   panel: () => <UserLaunchpad />,
    //   key: "launchpad",
    // },
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
  const socialIcons = [
    { url: profile?.socials?.website, Icon: WebsiteIcon },
    { url: profile?.socials?.twitter, Icon: TwitterIcon },
    { url: profile?.socials?.facebook, Icon: FacebookIcon },
    { url: profile?.socials?.telegram, Icon: TeleIcon },
    { url: profile?.socials?.discord, Icon: DiscordIcon },
    { url: profile?.socials?.github, Icon: GithubIcon },
  ];
  return (
    <div className="">
      <section>
        <div className="flex gap-x-3 text-sm p-4 bg-shader_700">
          <div className="w-[120px] h-[120px] overflow-hidden rounded-full">
            {profile?.avatar ? (
              <Image
                src={formatLinkIPFS(profile?.avatar)}
                width={120}
                height={120}
                alt="avatar"
              />
            ) : (
              <AvatarCustom
                avatarUrl={profile?.avatar}
                size={120}
                userAddress={profile?.userAddress!}
                className="rounded-full overflow-hidden"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <p className="text-lg title">{profile?.name}</p>
            </div>
            <div className="flex items-center gap-x-1 font-semibold">
              <span className="text-shader_200 text-sm ">
                {briefDocument(account, 8, 8)}
              </span>
              <Copy content={account} />
            </div>
            <div className="flex items-center gap-x-2 mt-[10px]">
              <Button primary className="px-2 h-8">
                <Link
                  href={`/profile/edit`}
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
                    <DialogDescription className="min-w-[400px]">
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
              {socialIcons.map(
                ({ url, Icon }, index) =>
                  url && (
                    <Link key={index} href={url} target="_blank" className="">
                      <Icon width={18} height={18} />
                    </Link>
                  )
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
      </div>
      <div className="p-4">{selectedTab ? selectedTab.panel() : null}</div>
    </div>
  );
};

export default Profile;
