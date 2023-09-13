import formatToUnit from '@/libs/utils/formatToUnit'
import React, { useState, useEffect } from 'react'

const ModalNumber = ({ data }: { data: string }) => {
    return (
        <div className='relative group'>
            <div className=''>
                {formatToUnit(data)}
            </div>
            {(Number(data) >= 1000 || Number(data) < 0.001) && (
                <div className='group-hover:block z-10 hidden absolute px-2 w-max -translate-x-[43%] bg-white rounded-md shadow-swiper document__tooltip bottom-8'>
                    <span className='text-sm'>{Number(data).toLocaleString("en")}</span>
                    <div className='absolute clip-polygon w-4 h-3 bg-white left-[50%] -translate-x-1/2 bottom-[-12px]'></div>
                </div>
            )}
        </div>
    )
}

export default ModalNumber
