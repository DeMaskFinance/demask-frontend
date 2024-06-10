import { Button } from "@/components/Buttons";
import { LoadingIcon } from "@/components/Icons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { referralApply } from "@/libs/service/referralService";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { MdDone } from "react-icons/md";
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
          {check.isSuccess ? (
            <div className="p-3 rounded-lg bg-green bg-opacity-15">
              <p className="font-semibold text-green">Success</p>
              <p className="mt-4 text-sm text-shader_100">{check.message}</p>
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-red bg-opacity-15">
              <p className="font-semibold text-red">Failed</p>
              <p className="mt-4 text-sm text-shader_100">
                Addition failed. Please check your information and try again.
              </p>
            </div>
          )}
        </div>
      )}
      <div className="p-6 mt-2 mb-4 border rounded-lg border-shader_500 bg-shader_700 text-white">
        <div className="flex h-20 gap-x-6">
          <div className="relative h-full">
            <div className="w-8 h-8 flex justify-center items-center bg-primary_500 bg-opacity-10 rounded-full">
              <div className="flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary_400">
                {account ? (
                  <MdDone />
                ) : (
                  <BiLoaderAlt className="animate-spin" />
                )}
                <div className="flex items-center justify-center w-12 h-12 z-[-1] text-white rounded-full bg-primary_400 absolute bg-opacity-20"></div>
              </div>
            </div>
            <div className="absolute border-r-[1px] border-dashed border-primary_400 h-[100%] top-[40%]  left-[50%]"></div>
          </div>
          {account ? (
            "Connected"
          ) : (
            <Button className="h-10 px-8" primary onClick={handleOpen}>
              Connect Wallet
            </Button>
          )}
        </div>
        <div className="flex items-center gap-x-6">
          <div className="w-8 h-8 flex justify-center items-center bg-primary_500 bg-opacity-10 rounded-full">
            <div className="flex items-center justify-center w-6 h-6 text-white rounded-full bg-primary_400">
              {!account ? (
                <p className="leading-snug">x</p>
              ) : isLoading ? (
                <LoadingIcon width={24} height={24} className="animate-spin" />
              ) : check.isSuccess ? (
                <MdDone />
              ) : (
                <p className="leading-snug">x</p>
              )}
              <div className="flex items-center justify-center w-12 h-12 z-[-1] text-white rounded-full bg-primary_400 absolute bg-opacity-20"></div>
            </div>
          </div>
          <div>
            Referral Check:
            <div className="p-2 px-4 text-center border rounded-lg border-shader_400 bg-shader_500">
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
