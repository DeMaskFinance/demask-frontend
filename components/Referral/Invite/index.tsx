import { Button } from "@/components/Buttons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { referralApply } from "@/libs/service/referralService";
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
      <h1 className="mb-6 text-3xl font-semibold text_gradient">
        Refer and Earn together!
      </h1>
      <p className="my-6">
        Join now to start earning points! Accepting a referral boosts your
        points by 5% forever.
      </p>
      <p className="text-secondary5">Complete to Join:</p>
      <div className="p-6 mt-6 mb-4 border rounded-lg border-dark4 area_input">
        <div className="flex h-20 gap-x-6">
          <div className="relative h-full">
            <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-secondary5">
              {account ? <MdDone /> : <BiLoaderAlt className="animate-spin" />}
              <div className="flex items-center justify-center w-12 h-12 z-[-1] text-white rounded-full bg-secondary5 absolute bg-opacity-20"></div>
            </div>
            <div className="absolute w-[1px] h-[100%] bg-secondary5 top-[11%] -z-40 left-[50%]"></div>
          </div>
          {account ? (
            "Connected"
          ) : (
            <Button className="h-10 px-8" primary onClick={handleOpen}>
              CONNECT WALLET
            </Button>
          )}
        </div>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-secondary5">
            {!account ? (
              <p className="leading-snug">x</p>
            ) : isLoading ? (
              <BiLoaderAlt className="animate-spin" />
            ) : check.isSuccess ? (
              <MdDone />
            ) : (
              <p className="leading-snug">x</p>
            )}
            <div className="flex items-center justify-center w-12 h-12 z-[-1] text-white rounded-full bg-secondary5 absolute bg-opacity-20"></div>
          </div>
          <div>
            Referral Check
            <div className="p-2 px-4 text-center border rounded-lg borer-dark4">
              {referral}
            </div>
          </div>
        </div>
      </div>
      {check && account && (
        <Fragment>
          {check.isSuccess ? (
            <div className="p-4 rounded-lg bg-green dark:bg-opacity-20">
              <p className="font-semibold text-[#21735f]">Success</p>
              <p className="mt-4 text-sm text-white">{check.message}</p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red">
              <p className="font-semibold text-rose-800">Failed</p>
              <p className="mt-4 text-sm text-white">
                Addition failed. Please check your information and try again.
              </p>
            </div>
          )}
        </Fragment>
      )}

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
