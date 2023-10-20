import AccountContext from '@/context/AccountContext';
import { liquidityUser } from '@/libs/service/liquidityService';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react'
import { MdNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import PoolItem from './PoolItem';
import { Pagination } from '@/components/Common';
import { SkeletonTable } from '@/components/Skeleton';

export default function Pools() {
    const [page, setPage] = useState(1);
    const [pageNumberInput, setPageNumberInput] = useState("");
    const { account, chainId } = useContext(AccountContext);
    const { isLoading, refetch, data, isFetching, isPreviousData, isSuccess } = useQuery({
        queryKey: ["transaction", chainId],
        queryFn: async () => {
            const res = await liquidityUser(account.toLowerCase(), page, chainId);
            return res;
        },
    });

    return (
        <div>
            {(isLoading || isFetching) ? (
                <SkeletonTable length={4} />
            ) : (isSuccess && data.combinedRecords.length > 0) ? (
                <div className="transactionList">
                    <div className="px-2 pt-2 overflow-hidden rounded-lg shadow-home">
                        <div className="px-6 pt-6 pb-0 overflow-x-scroll">
                            <table className="w-full text-left">
                                <thead className="">
                                    <tr className="flex px-2 pb-2 text-sm border-b lg:text-base md:text-base">
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            Liquidity
                                        </th>
                                        {/* <th className="flex justify-start lg:w-full md:w-full w-[50px]"></th> */}
                                        <th className="flex justify-start md:basis-3/6 w-[200px]">
                                            Contract
                                        </th>
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            Notiond Size
                                        </th>
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            LP collection
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="flex flex-col">
                                    {data?.combinedRecords.map((item: any, index: number) => (
                                        <PoolItem item={item} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination data={data} page={page} pageNumberInput={pageNumberInput} isPreviousData={isPreviousData} setPage={setPage} setPageNumberInput={setPageNumberInput} refetch={refetch} />
                </div>
            ) : (
                <div>
                    <p>No data available.</p>
                </div>
            )}
        </div>
    )
}
