import { RefetchIcon, SettingIcon } from "@/components/Icons";
import ModalSetting from "@/components/Modal/ModalSetting";
import TabQuery from "@/components/NavChoice/TabQuery";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import { useQueryClient } from "@tanstack/react-query";
import Tippy from "@tippyjs/react/headless";
import { useContext } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Buy from "./Buy";
import Change from "./Change";
import Pool from "./Pool";
import Sell from "./Sell";

const TransactionCollection = () => {
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "buy"));
  const { isEvent } = useContext(AccountContext);
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
      dialog: (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer text-primary_200">
              <SettingIcon width={18} height={18} />
            </div>
          </DialogTrigger>
          <DialogContent className="w-fit bg-shader_800 border border-shader_500 p-4">
            <ModalSetting />
          </DialogContent>
        </Dialog>
      ),
    },
  ];
  const indexChoice = TABS.findIndex((item) => item.key === tab);

  return (
    <div
      className={`flex flex-col  h-full p-4 w-full md:w-[480px] relative md:sticky ${
        isEvent ? "md:top-[104px]" : "md:top-14"
      }`}
    >
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
                {action.dialog ? (
                  action.dialog
                ) : (
                  <div onClick={action.onClick} className="">
                    {action.icon}
                  </div>
                )}
              </div>
            </Tippy>
          ))}
        </div>
      </div>
      <div className="flex-col justify-between w-full gap-4 overflow-hidden rounded-lg flex lg:flex-row">
        <TabQuery
          TABS={TABS}
          initialItem={tab}
          indexChoice={indexChoice}
          isDefault={true}
        />
      </div>
      <div className="relative h-full min-h-[500px]">
        {selectedTab ? selectedTab.panel() : null}
      </div>
    </div>
  );
};

export default TransactionCollection;
