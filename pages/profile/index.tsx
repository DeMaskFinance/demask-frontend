import React, { useContext, useEffect, useState } from 'react'
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
import AccountContext from '@/context/AccountContext';
import { ModalWallet } from '@/components/Modal/ModalWallet';
import { Button } from '@/components/Buttons';
import { AvatarUser } from '@/components/Avatars';
import { IoCopyOutline } from "react-icons/io5";
import Profile from '@/components/Profile/Profile';
import OptionNetwork from '@/components/Profile/OptionNetwork';
import abiDemask from "@/abi/abiCreator.json";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
    usePrepareContractWrite,
    useContractWrite,
    useWaitForTransaction,
} from 'wagmi'
const updateMeta = {
    ...SEO,
    title: 'Profile',
};
function ProfilePage() {
    const { account } = useContext(AccountContext);
    const [isCopy, setIsCopy] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleOpen = () => {
        document.body.style.overflowY = "hidden";
        setIsOpen(true);
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(account)
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
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: '0x59620b99146C56785b067f84237fa80D89588228',
        abi: abiDemask,
        functionName: 'mint',
    })
    return (
        <div>
            <NextSeo {...updateMeta} />
            <div className='max-w-6xl pt-6 mx-auto min-h-[75vh]'>
                {account ? (
                    <div>
                        <section>
                            <div className='flex items-center justify-center mt-2'>
                                <AvatarUser width={96} height={96} />
                                <div>
                                    <p className='text-2xl font-semibold'>Unnamed</p>
                                    <div className='flex items-center gap-x-1'>
                                        <span className='text-secondary1'>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                                        <Tippy
                                            theme='light'
                                            visible={isCopy}
                                            content={<span>Copied</span>}>
                                            <button onClick={copyToClipboard}><IoCopyOutline /></button>
                                        </Tippy>
                                    </div>
                                    <div>
                                        <OptionNetwork />
                                    </div>
                                </div>
                            </div>
                        </section>
                        <Profile />
                    </div>
                ) : (
                    <Button
                        className="w-[140px] py-2 block mx-auto"
                        primary
                        onClick={handleOpen}
                    >
                        CONNECT WALLET
                    </Button>
                )}
            </div>
            <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}

export default ProfilePage;

