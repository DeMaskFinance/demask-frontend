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
const TransactionCollection = () => {
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "buy"));
  const router = useRouter();
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
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
  const actions = [
    {
      icon: (
        <RefetchIcon
          width={24}
          height={24}
          className="cursor-pointer hover:fill-secondary5"
        />
      ),
      content: "Refetch",
      onClick: () => router.refresh(),
    },
    {
      icon: (
        <SettingIcon
          width={24}
          height={24}
          className="cursor-pointer hover:rotate-90 hover:fill-secondary5"
        />
      ),
      content: "Setting",
      onClick: () => setIsOpenSetting(true),
    },
  ];
  return (
    <div className="flex flex-col h-full p-3 border rounded-lg border-dark3">
      <div className="flex items-center justify-between mb-3 lg:mb-0 gap-x-2 lg:gap-x-8">
        <ul className="flex gap-4 p-2 text-sm text-white rounded-lg bg-dark3 ">
          {TABS.map((item, index) => (
            <li
              key={index}
              onClick={() => setTab(item.key)}
              className={`cursor-pointer p-2 rounded-lg ${
                item.key === tab && "bg-secondary5"
              }`}
            >
              <h2 className="font-semibold">{item.title}</h2>
            </li>
          ))}
        </ul>
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
      <div className="relative h-full">
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
