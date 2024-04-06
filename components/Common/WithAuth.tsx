import { Button } from '@/components/Buttons';
import { ModalWallet } from '@/components/Modal/ModalWallet';
import { selectProfile } from '@/store/profileSlice';
import { NextSeo } from "next-seo";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import { SEO } from '../../next-seo.config';
const updateMeta = {
    ...SEO,
    title: 'Profile',
};
function WithAuth({ children }: any) {
    const { isLoggedIn } = useSelector(selectProfile);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const handleOpen = () => {
        document.body.style.overflowY = "hidden";
        setIsOpen(true);
    };
    return (
        <div>
            <NextSeo {...updateMeta} />
            <div className='mx-auto min-h-[75vh]'>
                {isLoggedIn ? (
                    <div>
                        {children}
                    </div>
                ) : (
                    <ModalWallet isOpen={!isLoggedIn} setIsOpen={setIsOpen} isAuthen={true}/>
                )}
            </div>
        </div>
    )
}

export default WithAuth;

