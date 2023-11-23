import MediaNFT from '@/components/Common/MediaNFT';
import React from 'react'

const Box = ({ data }: any) => {
    console.log(data);

    return (
        <div>
            <table className="w-full md:text-sm text-left border-collapse text-[10px]">
                <thead className="sticky top-0 z-10 m-1 ">
                    <tr className="mx-2 text-[18px] text-dark0">
                        <th scope="col" className="sticky left-0 px-6 py-3 bg-white">NAME</th>
                        <th scope="col">
                            <div className="flex items-center justify-end pl-8 min-w-max">TOTAL SALE</div>
                        </th>
                        <th scope="col">
                            <div className="flex items-center justify-end pl-8 min-w-max">REMAINING</div>
                        </th>

                    </tr>
                </thead>
                <tbody className=" text-base font-normal  max-md:text-[12px] bg-transparent border-gray-700 cursor-pointer">
                    <tr className="text-dark2 text-base max-md:text-[12px] bg-transparent group rounded-lg border-gray-700 bg-white hover:bg-slate-100 cursor-pointer">
                        <td scope="row" className="sticky left-0 z-10 flex items-center px-1 py-2 font-medium bg-white group-hover:bg-slate-100 md:min-w-max md:px-6 whitespace-nowrap" style={{ width: "100%" }}>
                            <div
                                className="flex items-center justify-start transition-all "
                            >
                                <div className="h-7 md:h-8 aspect-square">
                                    <MediaNFT data={data} isControls={false} />
                                </div>
                                <span className="w-24 ml-1 truncate md:ml-4 md:w-full group-hover:text-secondary4 group-hover:font-medium " >
                                    <h1 className="font-semibold text-dark1">{data.metadata.name}</h1>
                                </span>
                            </div>
                        </td>
                        <td className="min-w-max">
                            <div className='flex items-center justify-end '>123,55</div>
                        </td>
                        <td className="">
                            <div className='flex items-center justify-end '>173</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Box
