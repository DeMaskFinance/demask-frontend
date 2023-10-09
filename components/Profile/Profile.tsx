import React from 'react'

const Profile = () => {
    const TABS = [
        {
            title: "NFTs",
            panel: () => (
                <div>123</div>
            ),
            key: "nfts",
        },
        {
            title: "Referral",
            panel: () => <div>456</div>,
            key: "referral",
        },
        {
            title: "Liquidity",
            panel: () => (
                <div>798</div>
            ),
            key: "liquidity",
        },
        {
            title: "KYC",
            panel: () => (
                <div>888</div>
            ),
            key: "kyc",
        },
    ];
    return (
        <div>
            <ul>
                {TABS.map((item, index) => (
                    <li>
                        {item.title}
                    </li>
                )
                )}
            </ul>
        </div>
    )
}

export default Profile
