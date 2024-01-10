import { AvatarUser } from '@/components/Avatars';
import { Button } from '@/components/Buttons';
import Copy from '@/components/Common/Copy';
import { ModalWallet } from '@/components/Modal/ModalWallet';
import Profile from '@/components/Profile/Profile';
import AccountContext from '@/context/AccountContext';
import { NextSeo } from "next-seo";
import { useContext, useState } from 'react';
import 'tippy.js/dist/tippy.css';
import { SEO } from '../../../next-seo.config';
const updateMeta = {
    ...SEO,
    title: 'Profile',
};
function WithAuth({ children }: any) {
    const { account } = useContext(AccountContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleOpen = () => {
        document.body.style.overflowY = "hidden";
        setIsOpen(true);
    };
    return (
        <div>
            <NextSeo {...updateMeta} />
            <div className='max-w-6xl mx-auto min-h-[75vh]'>
                {account ? (
                    <div>
                        {children}
                    </div>
                ) : (
                    <div className='pt-6'>
                        <Button
                            className="w-[140px] py-2 block mx-auto"
                            primary
                            onClick={handleOpen}
                        >
                            CONNECT WALLET
                        </Button>
                    </div>
                )}
            </div>
            <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
}

export default WithAuth;

