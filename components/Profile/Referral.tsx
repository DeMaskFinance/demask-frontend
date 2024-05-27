import React, { useContext, useEffect, useState } from "react";
import { Button } from "../Buttons";
import AccountContext from "@/context/AccountContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
const Referral = () => {
  const { account, chainId } = useContext(AccountContext);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `https://test.demask.finance/referral?sponsor=${account}&chain=${chainId}`
    );
    setIsCopy(true);
  };
  useEffect(() => {
    if (isCopy) {
      const timeoutId = setTimeout(() => {
        setIsCopy(false);
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [isCopy]);
  return (
    <div className="w-full mx-auto">
      {/* <div className='flex flex-col p-8 mb-6 border rounded-lg border-shader_500 text-shader_600 gap-y-2 shadow-home'>
                <p className='text-primary_400'>Invite your friends to DEMASK, if they sign up</p>
                <h1 className='my-6 font-semibold'>Refer Friends To Earn</h1>
                <p>Experience a new way of earning rewards by inviting your friends to join DeMask & earn up to 10% commission every time they trade on DeMask.</p>
                <div className='flex mt-6'>
                    <div className='w-[75%] mr-4 p-2 border rounded-lg border-shader_500 text-primary_400'>https://test.demask.finance...{`${account.slice(-4)}`}&chain={chainId}</div>
                    <Tippy theme='light'
                        visible={isCopy}
                        content={<span>Copied</span>}>
                        <div>
                            <Button className='h-full px-2' primary onClick={copyToClipboard}>COPY CODE</Button>
                        </div>
                    </Tippy>
                </div>
            </div>
            <SkeletonTable length={8}/> */}
      <p className="text-shader_600">Upcoming</p>
    </div>
  );
};

export default Referral;
