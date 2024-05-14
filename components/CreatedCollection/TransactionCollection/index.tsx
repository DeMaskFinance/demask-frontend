import { RefetchIcon, SettingIcon } from "@/components/Icons";
import ModalSetting from "@/components/Modal/ModalSetting";
import TabQuery from "@/components/NavChoice/TabQuery";
import Tippy from "@tippyjs/react/headless";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Buy from "./Buy";
import Change from "./Change";
import Pool from "./Pool";
import Sell from "./Sell";
import { BsCaretDownFill } from "react-icons/bs";
const style = {
  btnWallet:
    "flex items-center justify-center py-1 pl-2 lg:pl-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-white bg-secondary2 active:bg-secondary3 text-white hover:text-secondary2 gap-x-2 border-secondary5",
};
const TransactionCollection = () => {
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "buy"));
  const [visible, setVisible] = useState(true);
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
        queryClient.refetchQueries(["detailCollection"]);
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
  const indexChoice = TABS.findIndex((item) => item.key === tab);

  return (
    <div className="relative flex flex-col h-full p-3 border rounded-lg border-dark3 dark:border-none">
      <div className="flex items-center justify-between mb-3 lg:mb-0 gap-x-2 lg:gap-x-8">
        <div className="flex-col justify-between hidden gap-4 overflow-hidden rounded-lg md:flex lg:flex-row">
          <TabQuery TABS={TABS} initialItem={tab} indexChoice={indexChoice} />
        </div>
        {/* mobile-tablet */}
        <div className="md:hidden">
          <Tippy
            className=""
            interactive
            // hideOnClick
            visible={visible}
            onClickOutside={() => setVisible(false)}
            render={(attrs) => (
              <div
                className="w-[280px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium"
                tabIndex={-1}
                {...attrs}
              >
                <ul className="flex flex-col mt-2 font-normal gap-y-3">
                  {TABS.map((item, index) => (
                    <li
                      key={index}
                      onClick={() => setTab(item.key)}
                      className={`cursor-pointer p-2 ${
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
