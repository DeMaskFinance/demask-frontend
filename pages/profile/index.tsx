import React, { useContext, useState } from 'react'
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
import AccountContext from '@/context/AccountContext';
import { ModalWallet } from '@/components/Modal/ModalWallet';
import { Button } from '@/components/Buttons';
import { AvatarUser } from '@/components/Avatars';
import { IoCopyOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import Profile from '@/components/Profile/Profile';
import OptionNetwork from '@/components/Profile/OptionNetwork';
const updateMeta = {
    ...SEO,
    title: 'Profile',
};
function ProfilePage() {
    const { account, wallet, demask, chainId, tokenDefault } = useContext(AccountContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleOpen = () => {
        document.body.style.overflowY = "hidden";
        setIsOpen(true);
    };
    const copyToClipboard = () => {
        navigator.clipboard.writeText(account)
        toast.success(
            'Copied',
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }
        );
    }
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
                                        <button onClick={copyToClipboard}><IoCopyOutline /></button>
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

