import React from 'react'
import { EtherIcon, PriceIcon } from '../Icons'

const TableRank = () => {
    return (
        <div className='px-2 py-4 overflow-x-scroll border rounded-lg border-dark3 shadow-home'>
            <table className="w-full text-left border-collapse">
                <thead className="">
                    <tr className="flex px-2 pb-2 text-sm border-b">
                        <th className="flex justify-start md:w-[70%] w-[100px]">
                            Place
                        </th>
                        <th className="flex justify-start lg:w-full md:w-full w-[100px]">
                            Name
                        </th>
                        <th className="flex justify-center lg:w-full md:w-full w-[140px]">
                            Address
                        </th>
                        <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                            Reward
                        </th>
                        <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                            Season Volume
                        </th>
                        <th className="flex justify-end lg:w-full md:w-full w-[140px] pr-2">
                            Total Volume
                        </th>
                    </tr>
                </thead>

                <tbody className="flex flex-col">
                    <tr className="flex px-2 text-xs border-b rounded-lg hover:cursor-pointer text-dark2 group hover:bg-slate-100">
                        <td className="py-2 flex items-center justify-start md:w-[70%] w-[100px]">
                            <div className="flex items-center justify-end gap-x-1">
                                1
                                <PriceIcon width={18} height={18} />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[100px]">
                            Crypto Punk
                        </td>
                        <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                            0x70...0b6a
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                231
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                2.06
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 lg:w-full md:w-[175px] w-[200px]">
                            <div className="flex items-center justify-end md:gap-2">
                                0.15
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                    </tr>
                    <tr className="flex px-2 text-xs border-b rounded-lg hover:cursor-pointer text-dark2 group hover:bg-slate-100">
                        <td className="py-2 flex items-center justify-start md:w-[70%] w-[100px]">
                            <div className="flex items-center justify-end gap-x-1">
                                1
                                <PriceIcon width={18} height={18} />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[100px]">
                            Crypto Punk
                        </td>
                        <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                            0x70...0b6a
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                231
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                2.06
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 lg:w-full md:w-[175px] w-[200px]">
                            <div className="flex items-center justify-end md:gap-2">
                                0.15
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                    </tr>
                    <tr className="flex px-2 text-xs border-b rounded-lg hover:cursor-pointer text-dark2 group hover:bg-slate-100">
                        <td className="py-2 flex items-center justify-start md:w-[70%] w-[100px]">
                            <div className="flex items-center justify-end gap-x-1">
                                1
                                <PriceIcon width={18} height={18} />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[100px]">
                            Crypto Punk
                        </td>
                        <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                            0x70...0b6a
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                231
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                2.06
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 lg:w-full md:w-[175px] w-[200px]">
                            <div className="flex items-center justify-end md:gap-2">
                                0.15
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                    </tr>
                    <tr className="flex px-2 text-xs border-b rounded-lg hover:cursor-pointer text-dark2 group hover:bg-slate-100">
                        <td className="py-2 flex items-center justify-start md:w-[70%] w-[100px]">
                            <div className="flex items-center justify-end gap-x-1">
                                1
                                <PriceIcon width={18} height={18} />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[100px]">
                            Crypto Punk
                        </td>
                        <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                            0x70...0b6a
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                231
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                2.06
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 lg:w-full md:w-[175px] w-[200px]">
                            <div className="flex items-center justify-end md:gap-2">
                                0.15
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                    </tr>
                    <tr className="flex px-2 text-xs border-b rounded-lg hover:cursor-pointer text-dark2 group hover:bg-slate-100">
                        <td className="py-2 flex items-center justify-start md:w-[70%] w-[100px]">
                            <div className="flex items-center justify-end gap-x-1">
                                1
                                <PriceIcon width={18} height={18} />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-start lg:w-full md:w-full w-[100px]">
                            Crypto Punk
                        </td>
                        <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                            0x70...0b6a
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                231
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                            <div className="flex items-center justify-end md:gap-2">
                                2.06
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                        <td className="py-2 lg:w-full md:w-[175px] w-[200px]">
                            <div className="flex items-center justify-end md:gap-2">
                                0.15
                                <EtherIcon width={18} height={18} className="fill-dark2" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default TableRank
