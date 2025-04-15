import { RefetchIcon, RightIcon, SettingIcon } from "@/components/Icons";
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
import { Button } from "@/components/Buttons";
import Link from "next/link";
import { useRouter } from "next/router";
import VersionTrade from "@/components/Common/VersionTrade";
import TokenIcon from "@/components/Logo/TokenIcon";

const TransactionCollection = () => {
  const [tab] = useQueryParam("tab", withDefault(StringParam, "buy"));
  const { isEvent, chainId } = useContext(AccountContext);
  const router = useRouter();
  const slug = router.query.slug;
  const collectionAddress = slug?.[0] || "";
  const tokenAddress = slug?.[1] || "";


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
    // {
    //   title: "Change",
    //   panel: () => <Change />,
    //   key: "change",
    // },
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
        queryClient.refetchQueries({ queryKey: ["collectionNFTBUY"] });
        queryClient.refetchQueries({ queryKey: ["collectionNFTSell"] });
        queryClient.refetchQueries({ queryKey: ["detailCollection"] });
        queryClient.refetchQueries({ queryKey: ["historySwap"] });
        queryClient.refetchQueries({ queryKey: ["chart"] });
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
  const paymentToken = queryClient.getQueryData<Token[]>(["paymentTokens", chainId])

  const tokens = paymentToken?.filter((item: Token) =>
    item?.isActive && item?.tokenAddress?.toLowerCase() !== tokenAddress?.toLowerCase()
  )

  return (
    <div
      className={`flex flex-col  h-full p-4 w-full md:w-[480px] relative md:sticky ${isEvent ? "md:top-[50px]" : "md:top-14"
        }`}
    >
      <div className="flex justify-between gap-4 mb-2">
        <VersionTrade />

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

          <Link className="text-sm flex justify-end items-center font-semibold gap-1 hover:gap-1.5 hover:bg-primary_500/30 transition-all bg-primary_500/20 text-white/90 py-1.5 px-4 pr-3 rounded-md" href={`/trade/erc721/${collectionAddress}/${tokens?.[0]?.tokenAddress}`}>
            Pool {tokens?.[0]?.symbol} <TokenIcon token={tokens?.[0]?.symbol || ""} w={16} h={16} />  <RightIcon className="w-4 h-4" />
          </Link>
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
      <Button third className="mt-4 h-10  ">
        <Link
          href={`/collection/${collectionAddress}`}
          className="w-full flex justify-center items-center text-primary_300 gap-x-2"
        >
          Collection Details
          <RightIcon width={20} height={20} />
        </Link>
      </Button>
      <div className="relative h-full min-h-[500px]">
        {selectedTab ? selectedTab.panel() : null}
      </div>
    </div>
  );
};

export default TransactionCollection;
