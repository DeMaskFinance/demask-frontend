import Image from 'next/image'
import React from 'react'
import { EtherIcon, PriceIcon } from '../Icons'
export const CardListLoading = () => {
    return (
        <div className='flex flex-col items-center justify-center p-2 border rounded-lg text-dark1 w-60 h-fit border-secondary5 shadow-[0px_8px_24px_0px_rgba(29,133,232,0.25)]'>
            <div className=' w-[120px] h-[120px] bg-slate-200 rounded-full' />
            <div className='mt-2 mb-6 text-2xl font-semibold'>
                <div className="h-4 w-20 bg-slate-200 rounded"></div>
            </div>

            <div className='bg-[#F8F8F8] rounded-lg w-full flex flex-col items-center pt-6 pb-2 relative'>
                <div className='absolute p-2 bg-white rounded-full -top-4 shadow-swiper w-fit'>
                    <PriceIcon width={24} height={24} className='fill-[#1D85E8]' />
                </div>
                <div className='pb-2 font-semibold border-b border-dark1 w-[60%] text-center'>
                    <div className="h-4 bg-slate-200 rounded-full"></div>
                </div>
                <div className='flex my-2 text-sm font-semibold'>
                    <div className="h-4 w-20 bg-slate-200 rounded-full"></div>
                </div>
                <p className='text-xs font-medium'>Season Volume</p>
            </div>
        </div>
    )
}
const CardList = () => {
    return (
        <div className='flex flex-col items-center justify-center p-2 border rounded-lg text-dark1 w-60 h-fit border-blue shadow-[0px_8px_24px_0px_rgba(29,133,232,0.25)]'>
            <Image width={120} height={120} alt='leaderboardImg' src='/images/test.png' className='object-cover rounded-full' />
            <h2 className='mt-2 mb-6 text-2xl font-semibold'>ToCa</h2>

            <div className='bg-[#F8F8F8] rounded-lg w-full flex flex-col items-center pt-6 pb-2 relative'>
                <div className='absolute p-2 bg-white rounded-full -top-4 shadow-swiper w-fit'>
                    <PriceIcon width={24} height={24} className='fill-[#1D85E8]' />
                </div>
                <p className='pb-2 font-semibold border-b border-dark1 w-[60%] text-center'>70 Point</p>
                <div className='flex my-2 text-sm font-semibold'>
                    <p>0.05</p>
                    <EtherIcon width={20} height={20} className='fill-dark1' />
                </div>
                <p className='text-xs font-medium'>Season Volume</p>
            </div>
        </div>
    )
}

export default CardList
