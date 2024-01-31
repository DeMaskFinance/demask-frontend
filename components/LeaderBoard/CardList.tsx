import Image from 'next/image'
import React from 'react'
import { EtherIcon, PriceIcon } from '../Icons'
import FormatNumber from '../Common/FormatNumber'
import { AvatarUser } from '../Avatars'
export const CardListLoading = () => {
    return (
        <div className='flex animate-pulse flex-col items-center justify-center p-2 border rounded-lg text-dark1 mb-10 h-fit border-secondary5 shadow-[0px_8px_24px_0px_rgba(29,133,232,0.25)]'>
            <div className='w-[80px] h-[80px] rounded-full bg-slate-200' />
            <div className='mt-2 mb-6 text-2xl font-semibold'>
                <div className="w-20 h-4 rounded bg-slate-200"></div>
            </div>

            <div className='bg-[#F8F8F8] rounded-lg w-full flex flex-col items-center pt-6 pb-2 relative'>
                <div className='absolute p-2 bg-white rounded-full -top-4 shadow-swiper w-fit'>
                    <PriceIcon width={24} height={24} className='fill-[#1D85E8]' />
                </div>
                <div className='pb-2 font-semibold border-b border-dark1 w-[60%] text-center'>
                    <div className="h-4 rounded-full bg-slate-200"></div>
                </div>
                <div className='flex my-2 text-sm font-semibold'>
                    <div className="w-20 h-4 rounded-full bg-slate-200"></div>
                </div>
                <p className='text-xs font-medium whitespace-nowrap'>Season Volume</p>
            </div>
        </div>
    )
}
const CardList = ({ data }: any) => {
    return (
        <div className={`flex flex-col items-center justify-center p-2 border rounded-lg text-dark1 w-full h-fit ${data?.rank === 1 ? 'border-yellow shadow-[0px_8px_24px_0px_rgba(255,194,88,0.25)]' : data?.rank === 2 ? "border-blue shadow-[0px_8px_24px_0px_rgba(29,133,232,0.25)]" : data?.rank === 3 ? "border-red shadow-[0px_8px_24px_0px_rgba(253,128,130,0.25)]" : ''}`}>
            {
                data?.avatar ? (
                    <Image width={600} height={600} alt='leaderboardImg' src={data?.avatar} className='rounded-full object-cover w-[120px] h-[120px]' />
                ) : (
                    <AvatarUser width={120} height={120} />
                )
            }
            <h2 className='mt-2 mb-6 text-lg font-semibold lg:text-2xl'>{data?.name}</h2>
            <div className='bg-[#F8F8F8] rounded-lg w-full flex flex-col items-center pt-6 pb-2 relative'>
                <div className='absolute p-2 bg-white rounded-full -top-4 shadow-swiper w-fit'>
                    <PriceIcon width={24} height={24} className={`${data?.rank === 1 ? 'fill-yellow' : data?.rank === 2 ? "fill-blue" : data?.rank === 3 ? "fill-red" : ''}`} />
                </div>
                <p className='pb-2 font-semibold border-b border-dark1 w-[60%] text-center'>70 Point</p>
                <div className='flex my-2 text-sm font-semibold'>
                    <FormatNumber number={data?.volume} />
                    <EtherIcon width={20} height={20} className='fill-dark1' />
                </div>
                <p className='text-xs font-medium whitespace-nowrap'>Season Volume</p>
            </div>
        </div>
    )
}

export default CardList;
