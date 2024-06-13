import { AvatarCustom } from "@/components/Avatars";
import { Button } from "@/components/Buttons";
import { LoadingIcon } from "@/components/Icons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { referralApply } from "@/libs/service/referralService";
import { briefDocument } from "@/libs/utils/formatComon";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { MdDone } from "react-icons/md";
interface UserRefInfo {
  avatar?: string;
  userAddress: string;
  name?: string;
}
interface StatusMessageProps {
  isSuccess: boolean;
  message: string;
  userRefInfo: UserRefInfo;
}
const StatusMessage: React.FC<StatusMessageProps> = ({
  isSuccess,
  message,
  userRefInfo,
}) => {
  return (
    <div
      className={`p-3 rounded-lg ${
        isSuccess ? "bg-green bg-opacity-15" : "bg-red bg-opacity-15"
      }`}
    >
      <p className={`font-semibold ${isSuccess ? "text-green" : "text-red"}`}>
        {isSuccess ? "Success" : "Failed"}
      </p>
      <p className="mt-3 text-sm text-shader_100">
        {isSuccess
          ? message
          : "Addition failed. Please check your information and try again."}
      </p>
      <div className="p-3 flex font-semibold items-center gap-x-3 bg-white bg-opacity-5 rounded-lg mt-3 w-60 border border-white border-opacity-5">
        <AvatarCustom
          avatarUrl={userRefInfo?.avatar}
          userAddress={userRefInfo.userAddress}
          size={24}
          className="w-10 h-10"
        />
        <div>
          <p className="text-white">
            {briefDocument(userRefInfo?.userAddress, 7, 4)}
          </p>
          <p className="text-shader_200 text-sm font-normal">
            {userRefInfo?.name}
          </p>
        </div>
      </div>
    </div>
  );
};
const Invite = () => {
  const { account } = useContext(AccountContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [check, setCheck] = useState<any>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const referral = useRouter().query.code;
  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await referralApply(account, referral as string);
    setCheck(res);
    setIsLoading(false);
  };

  return (
    <div className="w-[600px] mx-auto">
      <div className="">
        <Image
          width={72}
          height={72}
          src="/images/referralDemask.png"
          alt="referral"
          className=""
        />
        <h1 className=" text-2xl font-bold text-white mt-6">
          REFER AND EARN TOGETHER!
        </h1>
        <p className="my-2 text-shader_300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p className="text-primary_400">Complete to join:</p>
      </div>
      {check && account && (
        <div className="my-2">
          <StatusMessage
            isSuccess={check.isSuccess}
            message={check.message}
            userRefInfo={check.userRefInfo}
          />
        </div>
      )}
      <div className="p-6 mt-2 mb-4 border rounded-lg border-shader_500 bg-shader_700 text-white font-semibold">
        <div className="flex h-fit gap-x-4 items-center">
          <div className="relative h-full">
            <div className="w-10 h-10 flex justify-center items-center bg-primary_500 bg-opacity-10 rounded-full">
              {account ? (
                <div className="flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary_400">
                  <MdDone />
                  <div className="flex items-center justify-center w-12 h-12 z-[-1] text-white rounded-full bg-primary_400 absolute bg-opacity-20"></div>
                </div>
              ) : (
                <LoadingIcon
                  width={24}
                  height={24}
                  className="animate-spin fill-white"
                />
              )}
            </div>
            <div className="absolute border-r-[1px] border-dashed border-primary_400 h-[100%] top-[110%] left-[50%]"></div>
          </div>
          {account ? (
            "Connected"
          ) : (
            <Button className="h-10 px-8" primary onClick={handleOpen}>
              Connect Wallet
            </Button>
          )}
        </div>
        <div className="flex items-center gap-x-4 mt-8">
          {isLoading ? (
            <div className="w-10 h-10 flex justify-center items-center bg-shader_500 rounded-full">
              <LoadingIcon
                width={24}
                height={24}
                className="animate-spin fill-white"
              />
            </div>
          ) : (
            <div className="w-10 h-10 flex justify-center items-center bg-primary_500 bg-opacity-10 rounded-full">
              <div className="flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary_400 font-semibold">
                {!account ? (
                  <p className="leading-snug">x</p>
                ) : check.isSuccess ? (
                  <MdDone />
                ) : (
                  <p className="leading-snug text-xs">
                    <CgClose />
                  </p>
                )}
                <div className="flex items-center justify-center w-12 h-12 z-[-1] text-white rounded-full bg-primary_400 absolute bg-opacity-20"></div>
              </div>
            </div>
          )}
          <div>
            Referral Check:
            <div className="p-2 px-4 text-center border rounded-lg border-shader_400 bg-shader_500 mt-2 text-shader_200">
              {referral}
            </div>
          </div>
        </div>
      </div>

      <Button
        primary={account}
        active={!account}
        disabled={!account}
        className="px-6 py-2 mt-4"
        onClick={handleSubmit}
      >
        Confirm
      </Button>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Invite;
