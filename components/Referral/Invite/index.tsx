import { Button } from "@/components/Buttons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { MdDone } from "react-icons/md";
const Invite = () => {
  const { account } = useContext(AccountContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const referral = useRouter().query.code;
  console.log(referral);
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
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
            <div className="absolute w-[1px] h-[80%] bg-secondary5 top-[11%] -z-40 left-[50%]"></div>
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
            x
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
      <div className="p-4 rounded-lg bg-red dark:bg-opacity-20">
        <p className="font-semibold text-rose-800">Failed</p>
        <p className="mt-4 text-sm text-white">
          Addition failed. Please check your information and try again.
        </p>
      </div>
      <Button primary className="px-6 py-2 mt-4">
        Confirm
      </Button>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Invite;
