import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../Buttons';
import AccountContext from '@/context/AccountContext';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
const Referral = () => {
    const { account, chainId } = useContext(AccountContext);
    const [isCopy, setIsCopy] = useState<boolean>(false);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://test.demask.finance/referral?sponsor=${account}&chain=${chainId}`)
        setIsCopy(true);
    }
    useEffect(() => {
        if (isCopy) {
            const timeoutId = setTimeout(() => {
                setIsCopy(false);
            }, 800);

            return () => clearTimeout(timeoutId);
        }
    }, [isCopy]);
    return (
        <div className='flex justify-center'>
            <div className='w-full lg:w-[70%] p-2 border rounded-lg border-dark2 text-dark2 flex flex-col gap-y-2'>
                <p>Invite your friend to DEMASK, if they sign up</p>
                <h1 className='font-semibold'>Refer Friends To Earn</h1>
                <p>Experience a new way of earning rewards by inviting your friends to join DeMask & earn up to 10% commission every time they trade on DeMask.</p>
                <div className='flex mb-4'>
                    <div className='w-[75%] mr-4 p-2 border rounded-lg border-dark3'>{`${account.slice(0, 8)}...${account.slice(-4)}`}</div>
                    <Tippy theme='light'
                        visible={isCopy}
                        content={<span>Copied</span>}>
                        <div>
                            <Button className='h-full px-2' primary onClick={copyToClipboard}>COPY CODE</Button>
                        </div>
                    </Tippy>
                </div>
                {/* <h2 className='font-semibold'>Share the referral link</h2> */}
                {/* <p>You can also share your referral link by copying and sending it.</p>
            <div>
                <input type="text" placeholder='abcdexstools' className='w-[75%] mr-4 p-2 mb-4 border rounded-lg border-dark3'/>
                <Button className='p-2' primary>COPY CODE</Button>
            </div> */}
            </div>
        </div>
    )
}

export default Referral;
