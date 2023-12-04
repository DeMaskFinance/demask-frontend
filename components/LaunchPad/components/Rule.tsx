import { TeleIcon, TwitterIcon } from '@/components/Icons';
import React from 'react'
import { FiShare } from "react-icons/fi";
const Rule = ({ data }: any) => {
    console.log(data);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC',
    };
    const startDate = new Date(Number(data.startTime * 1000)).toLocaleString('en-US', options);
    const endDate = new Date(Number(data.endTime * 1000)).toLocaleString('en-US', options);
    const ruleInfor = [
        {
            projectName: `Project Name: ${data?.launchpadInfo?.projectName}`
        },
        {
            Buyers: 'Buyers: Everyone'
        },
        {
            Amount: `Amount: ${data?.hardcap} NFTs`
        },
        {
            Currency: 'Currency: ETH'
        },
        {
            Price: `Price: ${data?.price} ETH/NFT`
        },
        {
            SaleDate: `Sale Date: ${startDate} - ${endDate}`
        },
        {
            Member: `Member: ${data?.launchpadInfo?.teamDescription}`
        },
        {
            Purpose: `Purpose: ${data?.launchpadInfo?.purpose}`
        },
        {
            Reward: 'Reward: NFTs will be airdroped after the sale end'
        },
    ]
    return (
        <div>
            {data && (
                <div className='text-sm text-[#000]'>
                    <ul>
                        {ruleInfor.map((item, index) => (
                            <li className='mb-[1px] flex' key={index}>
                                ▪️
                                <p className='ml-1'>{Object.values(item)[0]}</p>
                            </li>
                        ))}
                    </ul>
                    <h3 className='my-1'>NFT DESCRIPTION:</h3>
                    <p>
                        {data?.metadata?.description}
                    </p>
                    <div className='flex items-center mt-2 gap-x-4'>
                        <p className='font-semibold'>Website</p>
                        <div className='px-2 py-1 cursor-pointer bg-dark4 gap-x-1'>
                            <a
                                className='flex items-center gap-x-1 hover:text-secondary2'
                                rel="noreferrer noopener"
                                target="_blank" href={`${data?.launchpadInfo?.website}`}>{data?.launchpadInfo?.website}<FiShare /></a>

                        </div>
                    </div>
                    <div className='flex mt-2 gap-x-8'>
                        <p className='font-semibold'>Social</p>
                        <div className="flex gap-x-2">
                            <a
                                href={`https://twitter.com/${data?.launchpadInfo?.twitter}`}
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <TwitterIcon
                                    width={20}
                                    height={20}
                                    className="fill-dark3 hover:fill-secondary5"
                                />
                            </a>
                            <a
                                href={`https://t.me/${data?.launchpadInfo?.twitter}`}
                                rel="noreferrer noopener"
                                target="_blank"
                            >
                                <TeleIcon
                                    width={20}
                                    height={20}
                                    className="fill-dark3 hover:fill-secondary5"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Rule
