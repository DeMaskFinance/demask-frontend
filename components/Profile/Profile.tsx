import Tippy from "@tippyjs/react/headless";
import { useContext, useEffect, useState } from 'react';
import { BsCaretDownFill } from 'react-icons/bs';
import "tippy.js/dist/tippy.css"; // optional
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import History from './History';
import Pools from './Pools';
import Referral from './Referral';
import UserLaunchpad from "./ProfileLaunchPad/UserLaunchpad";
import { AvatarUser } from "../Avatars";
import Copy from "../Common/Copy";
import AccountContext from "@/context/AccountContext";
import { EditIcon } from "../Icons";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectProfile } from "@/store/profileSlice";
import Image from "next/image";
import Inventory from "./Inventory";
import Items from "./Inventory/Items";
import Created from "./Inventory/Created";
const style = {
    itemSub:
        "flex items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer border hover:border-secondary5 border-white hover:text-secondary5 active:text-secondary3",
    btnWallet:
        "flex items-center justify-center py-1 pl-2 lg:pl-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-white bg-secondary2 active:bg-secondary3 text-white hover:text-secondary2 gap-x-2 border-secondary5",
};
const Profile = () => {
    const { account } = useContext(AccountContext);
    const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "items"));
    const [visible, setVisible] = useState(true);
    const { profile } = useSelector(selectProfile);
    const TABS = [
        {
            title: "Items",
            panel: () => (
                <Items />
            ),
            key: "items",
        },
        {
            title: "Pools",
            panel: () => (
                <Pools />
            ),
            key: "pools",
        },
        {
            title: "Created",
            panel: () => (
                <Created />
            ),
            key: "created",
        },
        {
            title: "Launchpad",
            panel: () => <UserLaunchpad />,
            key: "launchpad",
        },
        {
            title: "History",
            panel: () => <History />,
            key: "history",
        },
        {
            title: "Referral",
            panel: () => <Referral />,
            key: "referral",
        },
        {
            title: "KYC",
            panel: () => (
                <div className='text-dark2'>Upcoming</div>
            ),
            key: "kyc",
        },
    ];
    const selectedTab = TABS.find((item) => item.key === tab);
    useEffect(() => {
        const closeTippy = () => {
            setVisible(false);
        };

        closeTippy();
        return () => {
            // cleanup code 
        };
    }, [tab]);
    const fullTime = profile?.createdAt ? new Date(profile.createdAt) : new Date();
    const monthName = fullTime.toLocaleString('default', { month: 'long' });
    return (
        <div className='my-6 '>
            <section>
                <div className='h-[120px] lg:h-[240px]'>
                    {profile?.banner ? (
                        <Image src={profile?.banner} alt='banner' width={1200} height={400} className='w-full group-hover:brightness-[0.8] h-full rounded-b-lg object-cover' />
                    ) : (
                        <div className='w-full h-full bg-dark4 rounded-b-lg group-hover:brightness-[0.8]'>
                        </div>
                    )}
                </div>
                <div className='flex items-center justify-center mt-6'>
                    {profile?.avatar ? (
                        <Image src={profile?.avatar} alt='banner' width={600} height={600} className='object-cover rounded-full w-[120px] h-[120px] mr-2' />
                    ) : (
                        <AvatarUser width={120} height={120} />
                    )}
                    <div>
                        <div className="flex items-center gap-x-2">
                            <p className='text-2xl font-semibold'>{profile?.name}</p>
                            <Link href='/profile/edit'>
                                <EditIcon width={24} height={24} className="fill-dark3" />
                            </Link>
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <span className='text-secondary1'>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                            <Copy content={account} />
                        </div>
                        <div className='flex items-center gap-x-2'>
                            <span className='text-dark3'>Joined {monthName} {fullTime.getFullYear()}</span>
                        </div>
                    </div>
                </div>
            </section>
            <div className='flex items-center justify-start mt-6 lg:justify-center'>
                {/* PC */}
                <ul className='hidden gap-4 p-2 text-sm text-white rounded-lg lg:flex bg-dark3 '>
                    {TABS.map((item, index) => (
                        <li key={index} onClick={() => setTab(item.key)} className={`cursor-pointer p-2 ${tab === item.key ? "rounded-lg bg-secondary5" : ""} `}>
                            <h2 className='font-semibold'>{item.title}</h2>
                        </li>
                    )
                    )}
                </ul>
                {/* mobile-tablet */}
                <div className='lg:hidden'>
                    <Tippy
                        className=""
                        interactive
                        hideOnClick
                        visible={visible}
                        onClickOutside={() => setVisible(false)}
                        render={(attrs) => (
                            <div
                                className="w-[280px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium"
                                tabIndex={-1}
                                {...attrs}
                            >
                                <ul className="flex flex-col mt-2 font-normal gap-y-3">
                                    {TABS.map((item, index) => (
                                        <li key={index} onClick={() => setTab(item.key)} className={`cursor-pointer p-2 ${tab === item.key ? "rounded-lg bg-secondary5" : ""} `}>
                                            <h2 className='font-semibold'>{item.title}</h2>
                                        </li>
                                    )
                                    )}
                                </ul>
                            </div>
                        )}
                    >
                        <button className={`${style.btnWallet} flex`} onClick={() => setVisible(true)}>
                            {selectedTab?.title}
                            <span className="lg:hidden">
                                <BsCaretDownFill />
                            </span>
                        </button>
                    </Tippy>
                </div>
            </div>
            <div className='pb-20 mt-4 lg:pb-0'>{selectedTab ? selectedTab.panel() : null}</div>
        </div>
    )
}

export default Profile
