import React, { useContext, useEffect } from "react";
import { PoolIcon, RefetchIcon, SettingIcon } from "../Icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModalSetting from "../Modal/ModalSetting";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { queryClient } from "@/libs/constants";
import AccountContext from "@/context/AccountContext";
import TokenIcon from "../Logo/TokenIcon";
import { useRouter } from "next/router";
interface Action {
  icon: React.ReactNode;
  content: string;
  onClick?: () => void;
  link?: string;
  dialog?: React.ReactNode;
}

interface ActionsProps {
  link: string;
  refetch: () => void;
  IconSwap: React.ReactNode;
  contentTrade: string;
  customLink?: boolean;
}

const Actions: React.FC<ActionsProps> = ({
  link,
  refetch,
  IconSwap,
  contentTrade,
  customLink,
}) => {

  const [showDropdown, setShowDropdown] = React.useState(false);
  const { chainId } = useContext(AccountContext);

  const paymentTokens = queryClient.getQueryData<any>(
    ["paymentTokens", chainId],
  )

  const router = useRouter()
  const { currency } = router.query;

  const renderDropdown = (type: "add" | "swap") => (
    <div className="absolute top-full mt-2 border-[1px] rounded-xl border-shader_400 bg-shader_500 overflow-hidden z-10 w-40">
      {paymentTokens?.filter((item: any) => (item?.isActive)).map((option: any) => (
        <Link
          key={option?.tokenAddress}
          href={customLink ? `/trade/erc1155/${currency?.[0] || ""}/${option?.tokenAddress || ""}/${currency?.[2]}` : link}
          className="block px-4 py-2 hover:bg-gray-700 text-white text-sm"
        >
          <div className="flex gap-1 items-center">
            {option?.symbol}
            <TokenIcon token={option?.symbol} w={16} h={16} />
          </div>
        </Link>
      ))
      }
    </div >
  );

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const actions: Action[] = [
    {
      icon: (
        <RefetchIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Refresh",
      onClick: () => refetch(),
    },
    {
      icon: IconSwap,
      content: contentTrade,
      link: link,
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

  return (
    <div className="flex items-center gap-x-2">
      {actions.map((action, index) => {
        const isSwap = action.content === contentTrade;
        return (
          <Tippy
            key={index}
            content={<div className="text-xs">{action.content}</div>}
            theme="dark"
            placement="top"
          >
            <div className="relative border rounded-full border-shader_400 p-[7px]">
              {action.link ? (
                <div
                  className="group cursor-pointer"
                  onClick={() => isSwap && setShowDropdown(prev => !prev)}
                >
                  {action.icon}
                </div>
              ) : action.dialog ? (
                action.dialog
              ) : (
                <div onClick={action.onClick} className="cursor-pointer">
                  {action.icon}
                </div>
              )}

              {isSwap && showDropdown && (
                <div ref={dropdownRef}>
                  {renderDropdown("swap")}
                </div>
              )}
            </div>
          </Tippy>
        );
      })}

    </div>
  );
};

export default Actions;
