import { EtherIcon, RefetchIcon, SettingIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import formatNumber from "@/libs/utils/formatNumer";
import { useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Buy from "./Buy";
import Pool from "./Pool";
import ModalSetting from "@/components/Modal/ModalSetting";
import Tippy from "@tippyjs/react";
const TransactionCollection = () => {
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
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
      onClick: () => console.log("123"),
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 lg:mb-0 gap-x-8">
        <TabGroups
          choices={["Buy", "Sell", "Change", "Pool"]}
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
        />
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
        {activeChoice === "Buy" ? (
          <Buy />
        ) : activeChoice === "Sell" ? (
          <div>Upcoming</div>
        ) : activeChoice === "Pool" ? (
          <Pool />
        ) : (
          <div>Upcoming</div>
        )}
      </div>
      <ModalSetting
        isOpenSetting={isOpenSetting}
        setIsOpenSetting={setIsOpenSetting}
      />
    </div>
  );
};

export default TransactionCollection;
