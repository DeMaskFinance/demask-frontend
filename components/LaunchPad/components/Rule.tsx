import React from 'react'

const Rule = () => {
    const ruleInfor = [
        {
            Buyers: 'Everyone'
        },
        {
            Amount: '1500 NFTs'
        },
        {
            Currency: 'ETH'
        },
        {
            Price: '4 ETH/NFT'
        },
        {
            SaleDate: '8:10 AM UTC September 26, 2023 - Oct 1, 2023'
        },
        {
            Reward: 'NFTs will be airdroped after the sale end'
        },
    ]
    const DesInfor = [
        'Higher yield for rewards & perks when equipped this NFT for PFP in MINE WARZ game',
        'Kpop Concert ticket raffle',
        'Fanmeeting raffle',
        'Matty goods (guaranteed)',
        'Kpop goods and NFT raffle'
    ]
    return (
        <div className='text-sm text-[#000]'>
            <ul>
                {ruleInfor.map((item, index) => (
                    <li className='mb-[1px] flex' key={index}>
                        ▪️ 
                        <p className='ml-1'>{Object.keys(item)[0]}: {Object.values(item)[0]}</p>
                    </li>
                ))}
            </ul>
            <h3 className='my-1'>NFT DESCRIPTION:</h3>
            <p>Blue Matty Statue NFTs in this INO is the only Matty NFT that can be used in games - MINE WARZ. They also have casual benefits/perks just like other Matty NFTs, stated as below:</p>
            <ul>
                {
                    DesInfor.map((item, index) => (
                        <li className='mb-[1px]' key={index}>
                            {item}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Rule
