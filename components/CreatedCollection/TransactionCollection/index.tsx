import { EtherIcon, RefetchIcon, SettingIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import formatNumber from "@/libs/utils/formatNumer";
import { useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Buy from "./Buy";
import Pool from "./Pool";
import ModalSetting from "@/components/Modal/ModalSetting";
import Tippy from "@tippyjs/react";
import Sell from "./Sell";
import Change from "./Change";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import TabQuery from "@/components/NavChoice/TabQuery";
const TransactionCollection = () => {
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "buy"));
  const router = useRouter();
  const TABS = [
    {
      title: "Buy",
      panel: () => <Buy />,
      key: "buy",
    },
    {
      title: "Sell",
      panel: () => <Sell />,
      key: "sell",
    },
    {
      title: "Change",
      panel: () => <Change />,
      key: "change",
    },
    {
      title: "Pools",
      panel: () => <Pool />,
      key: "pool",
    },
  ];
  const selectedTab = TABS.find((item) => item.key === tab);
  const queryClient = useQueryClient();
  const actions = [
    {
      icon: (
        <RefetchIcon
          width={24}
          height={24}
          className="cursor-pointer hover:fill-dark2"
        />
      ),
      content: "Refresh",
      onClick: () => {
        queryClient.refetchQueries(["collectionNFTBUY"]);
        queryClient.refetchQueries(["collectionNFTSell"]);
      },
    },
    {
      icon: (
        <SettingIcon
          width={24}
          height={24}
          className="cursor-pointer hover:rotate-90 hover:fill-dark2"
        />
      ),
      content: "Setting",
      onClick: () => setIsOpenSetting(true),
    },
  ];
  return (
    <div className="flex flex-col h-full p-3 border rounded-lg border-dark3 dark:border-none">
      <div className="flex items-center justify-between mb-3 lg:mb-0 gap-x-2 lg:gap-x-8">
        <div className="flex flex-col justify-between gap-4 overflow-hidden rounded-lg lg:flex-row">
          <TabQuery TABS={TABS} initialItem="Buy" />
        </div>
        <div className="flex items-center gap-x-2">
          {actions.map((action, index) => (
            <Tippy
              key={index}
              content={<div className="text-xs">{action.content}</div>}
              theme="dark"
              placement="bottom"
            >
              <div onClick={action.onClick}>{action.icon}</div>
            </Tippy>
          ))}
        </div>
      </div>
      <div className="relative h-full min-h-[500px]">
        {selectedTab ? selectedTab.panel() : null}
      </div>
      <ModalSetting
        isOpenSetting={isOpenSetting}
        setIsOpenSetting={setIsOpenSetting}
      />
    </div>
  );
};

export default TransactionCollection;
