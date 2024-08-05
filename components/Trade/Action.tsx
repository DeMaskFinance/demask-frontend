import React from "react";
import { PoolIcon, RefetchIcon, SettingIcon } from "../Icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModalSetting from "../Modal/ModalSetting";
import Tippy from "@tippyjs/react";
import Link from "next/link";
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
}

const Actions: React.FC<ActionsProps> = ({
  link,
  refetch,
  IconSwap,
  contentTrade,
}) => {
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
      {actions.map((action, index) => (
        <Tippy
          key={index}
          content={<div className="text-xs">{action.content}</div>}
          theme="dark"
          placement="bottom"
        >
          <div className="border rounded-full border-shader_400 p-[7px]">
            {action.link ? (
              <Link href={action.link} className="group">
                {action.icon}
              </Link>
            ) : action.dialog ? (
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
  );
};

export default Actions;
