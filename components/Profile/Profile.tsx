import React from 'react'
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import NFTs from './NFTs';
import OptionNetwork from './OptionNetwork';
const Profile = () => {
    const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "nfts"));
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
                <div className='text-dark2'>Upcoming</div>
            ),
            key: "pools",
        },
        {
            title: "Launchpad",
            panel: () => (
                <div className='text-dark2'>Upcoming</div>
            ),
            key: "launchpad",
        },
        {
            title: "History",
            panel: () => <div className='text-dark2'>Upcoming</div>,
            key: "history",
        },
        {
            title: "Referral",
            panel: () => <div className='text-dark2'>Upcoming</div>,
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
    return (
        <div className='my-6'>
            <div className='flex items-center justify-between'>
                <ul className='flex gap-4 text-xl text-dark2'>
                    {TABS.map((item, index) => (
                        <li key={index} onClick={() => setTab(item.key)} className={`cursor-pointer ${tab === item.key ? "border-b-2  border-secondary2 text-secondary2" : ""} `}>
                            <h2 className='font-semibold'>{item.title}</h2>
                        </li>
                    )
                    )}
                </ul>
                <div>
                    <OptionNetwork/>
                </div>
            </div>
            <div className='mt-4'>{selectedTab ? selectedTab.panel() : null}</div>
        </div>
    )
}

export default Profile
