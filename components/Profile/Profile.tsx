import React, { useEffect, useState } from 'react'
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import NFTs from './NFTs';
import OptionNetwork from './OptionNetwork';
import Pools from './Pools';
import Referral from './Referral';
import History from './History';
import ProfileLaunchPad from './ProfileLaunchPad/ProfileLaunchPad';
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css"; // optional
import { BsCaretDownFill } from 'react-icons/bs';
const style = {
    itemSub:
        "flex items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer border hover:border-secondary5 border-white hover:text-secondary5 active:text-secondary3",
    btnWallet:
        "flex items-center justify-center py-1 pl-2 lg:pl-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-white bg-secondary2 active:bg-secondary3 text-white hover:text-secondary2 gap-x-2 border-secondary5",
};
const Profile = () => {
    const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "nfts"));
    const [visible, setVisible] = useState(true);
    const TABS = [
        {
            title: "Inventory",
            panel: () => (
                <NFTs />
            ),
            key: "nfts",
        },
        {
            title: "Pools",
            panel: () => (
                <Pools />
            ),
            key: "pools",
        },
        {
            title: "Launchpad",
            panel: () => <ProfileLaunchPad />,
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
    return (
        <div className='my-6'>
            <div className='flex items-center justify-start lg:justify-center'>
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
