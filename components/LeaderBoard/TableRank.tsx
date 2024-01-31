import React, { useContext, useEffect, useState } from 'react'
import { EtherIcon, PriceIcon } from '../Icons'
import FormatNumber from '../Common/FormatNumber';
import Image from 'next/image';
import { MdNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { SkeletonTable } from '../Skeleton';
import { leaderBoardAPI } from '@/libs/service/leaderBoard';
import AccountContext from '@/context/AccountContext';
import { useQuery } from '@tanstack/react-query';
import { AvatarUser } from '../Avatars';
import Link from 'next/link';

const TableRank = () => {
    const [page, setPage] = useState(1);
    const { chainId, demask } = useContext(AccountContext);
    const { isLoading, data, isRefetching, isSuccess, refetch, isPreviousData, isFetching } = useQuery({
        queryKey: ["leaderBoardAPI", chainId, page],
        queryFn: async () => {
            const res = await leaderBoardAPI(chainId, page);
            return res;
        },
        keepPreviousData: true,
    });
    const prevPage = () => {
        const prevPageNumber = Math.max(page - 1, 1);
        setPage(prevPageNumber);
    };

    const nextPage = () => {
        const nextPageNumber = Math.min(page + 1, data?.totalPages);
        setPage(nextPageNumber);
    };

    useEffect(() => {
        if (data === null) {
            setPage(1);
        }
    }, [data]);
    useEffect(() => {
        refetch();
    }, [page, refetch]);
    console.log(data);

    return (
        <div className='px-2 py-4 mt-10 overflow-x-scroll border rounded-lg border-dark3 shadow-home'>
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
                    {isLoading || isFetching ? (
                        <SkeletonTable length={9} />
                    ) : (
                        <>
                            {data.data.map((item: any, index: number) => (
                                <tr key={index} className="flex px-2 text-xs border-b rounded-lg hover:cursor-pointer text-dark2 group hover:bg-slate-100">
                                    <td className="py-2 flex items-center justify-start md:w-[70%] w-[100px]">
                                        <div className="flex items-center justify-end gap-x-1">
                                            {item?.rank}
                                            <PriceIcon width={18} height={18} className={`${item?.rank === 1 ? 'fill-yellow' : item?.rank === 2 ? "fill-blue" : item?.rank === 3 ? "fill-red" : ''}`} />
                                        </div>
                                    </td>
                                    <td className="py-2 flex items-center justify-start gap-x-1 lg:w-full md:w-full w-[100px]">
                                        {
                                            item.avatar ? (
                                                <Image src={item.avatar} width={120} alt='userIMG' height={120} className='object-cover w-6 h-6 rounded-lg' />
                                            ) : (
                                                <AvatarUser width={24} height={24} />
                                            )
                                        }
                                        <p>
                                            {item.name}
                                        </p>
                                    </td>
                                    <td className="py-2 flex text-secondary5 items-center justify-center lg:w-full md:w-full w-[140px]">
                                        <Link
                                            target="_blank"
                                            href={`${demask.urltxHash}address/${item.userAddress}`}
                                        >
                                            {`${item.userAddress.slice(0, 4)}...${item.userAddress.slice(-4)}`}
                                        </Link>
                                    </td>
                                    <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                                        <div className="flex items-center justify-end md:gap-2">
                                            -
                                            <EtherIcon width={18} height={18} className="fill-dark2" />
                                        </div>
                                    </td>
                                    <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                                        <div className="flex items-center justify-end md:gap-2">
                                            <FormatNumber number={item.volume} />
                                            <EtherIcon width={18} height={18} className="fill-dark2" />
                                        </div>
                                    </td>
                                    <td className="py-2 lg:w-full md:w-[175px] w-[200px]">
                                        <div className="flex items-center justify-end md:gap-2">
                                            <FormatNumber number={item.volume} />
                                            <EtherIcon width={18} height={18} className="fill-dark2" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </>
                    )}
                </tbody>
            </table>
            <div className="flex justify-center gap-4 pt-6 text-sm">
                <button
                    onClick={prevPage}
                    disabled={isPreviousData || page === 1 || isFetching}
                    className={`${isPreviousData || page === 1 || isFetching
                        ? "text-white bg-slate-300"
                        : "hover:text-white hover:bg-secondary2 transition-all"
                        } w-5 flex items-center text-center justify-center rounded-full transition-all`}
                >
                    <MdNavigateBefore />
                </button>
                <p>
                    Page
                    <span className="px-2 font-medium text-secondary2">{page}</span> of
                    <span
                        className="px-2 font-medium cursor-pointer text-secondary2"
                        onClick={() =>
                            page !== data?.totalPages && setPage(data?.totalPages)
                        }
                    >
                        {data?.totalPages}
                    </span>
                </p>
                <button
                    onClick={nextPage}
                    disabled={isPreviousData || page === data?.totalPages || isFetching}
                    className={`${isPreviousData || page === data?.totalPages || isFetching
                        ? "text-white bg-slate-300"
                        : "hover:text-white hover:bg-secondary2 transition-all"
                        } w-5 flex items-center text-center justify-center rounded-full transition-all`}
                >
                    <MdOutlineNavigateNext />
                </button>
            </div>
        </div>
    )
}

export default TableRank
