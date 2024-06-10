import { RefetchIcon, SettingIcon } from "@/components/Icons";
import ModalSetting from "@/components/Modal/ModalSetting";
import TabQuery from "@/components/NavChoice/TabQuery";
import { useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react/headless";
import { useState } from "react";
import { BsCaretDownFill } from "react-icons/bs";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Buy from "./Buy";
import Change from "./Change";
import Pool from "./Pool";
import Sell from "./Sell";
const style = {
  btnWallet:
    "flex items-center justify-center py-1 pl-2 lg:pl-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-white bg-primary_500 active:bg-primary_400 text-white hover:text-primary_500 gap-x-2 border-primary_400",
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
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
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
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Setting",
      onClick: () => setIsOpenSetting(true),
    },
  ];
  const indexChoice = TABS.findIndex((item) => item.key === tab);

  return (
    <div className="flex flex-col  h-full p-4 w-full md:w-[480px] flex-auto sticky top-14">
      <div className="flex justify-between gap-4 mb-2">
        <p className="text-xl font-bold text-white">Demask Swaps</p>
        <div className="flex items-center gap-x-2">
          {actions.map((action, index) => (
            <Tippy
              key={index}
              content={<div className="text-xs">{action.content}</div>}
              theme="dark"
              placement="bottom"
            >
              <div className="border rounded-full border-shader_400 p-[7px]">
                <div onClick={action.onClick} className="">
                  {action.icon}
                </div>
              </div>
            </Tippy>
          ))}
        </div>
      </div>
      <div className="flex-col justify-between hidden w-full gap-4 overflow-hidden rounded-lg md:flex lg:flex-row">
        <TabQuery
          TABS={TABS}
          initialItem={tab}
          indexChoice={indexChoice}
          isDefault={true}
        />
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
              className="w-[280px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-shader_500 font-medium"
              tabIndex={-1}
              {...attrs}
            >
              <ul className="flex flex-col mt-2 font-normal gap-y-3">
                {TABS.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => setTab(item.key)}
                    className={`cursor-pointer p-2 ${
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
