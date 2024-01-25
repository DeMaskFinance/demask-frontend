import React from 'react'
import SkeletonTable from './SkeletonTable'

const SkeletonPoolDetail = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-x-10">
            <div className="grow">
                <div className="flex flex-wrap justify-between mb-6 lg:flex-nowrap">
                    <div className='flex gap-x-4'>
                        <div className="h-8 w-8 bg-slate-200 rounded"></div>
                        <div className="h-8 w-8 bg-slate-200 rounded"></div>
                        <div className="h-8 w-24 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-8 w-40 bg-slate-200 rounded-full"></div>
                </div>
                <div className="p-4 border border-dark3 rounded-lg mt-6 w-full">
                    <SkeletonTable length={6} />
                </div>
            </div>
            <div className="w-full lg:w-[400px] mb-20 lg:mb-0 p-6 border rounded-lg shadow-home">
                <div className="h-60 w-60 bg-slate-200 my-6 mx-auto rounded-lg"></div>
                <div className="flex justify-between my-6">
                    <div className="h-6 w-36 bg-slate-200 rounded-full"></div>
                    <div className="h-6 w-36 bg-slate-200 rounded-full"></div>
                </div>
                <div className="h-8 w-[138px] bg-slate-200 rounded mt-6 mx-auto"></div>
            </div>
        </div>
    )
}

export default SkeletonPoolDetail
