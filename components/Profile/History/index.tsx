import AccountContext from '@/context/AccountContext';
import { liquidityUser } from '@/libs/service/liquidityService';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react'
import { MdNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md'
import { Pagination } from '@/components/Common';
import { SkeletonTable } from '@/components/Skeleton';
import { historyUserService } from '@/libs/service/profileService';
import HistoryItem from './HistoryItem';

export default function History() {
    const [page, setPage] = useState(1);
    const [pageNumberInput, setPageNumberInput] = useState("");
    const { account, chainId } = useContext(AccountContext);
    const { isLoading, refetch, data, isFetching, isPreviousData } = useQuery({
        queryKey: ["historyUser", chainId],
        queryFn: async () => {
            const res = await historyUserService(account.toLowerCase(), chainId, page);
            return res;
        },
    });

    console.log(data);

    return (
        <div>
            {(isLoading || isFetching) ? (
                <SkeletonTable length={4} />
            ) : (
                <div className="transactionList">
                    <div className="px-2 pt-2 overflow-hidden rounded-lg shadow-home">
                        <div className="px-6 pt-6 pb-0 overflow-x-scroll">
                            <table className="w-full text-left">
                                <thead className="">
                                    <tr className="flex px-2 pb-2 text-sm border-b lg:text-base md:text-base">
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            Action
                                        </th>
                                        {/* <th className="flex justify-start lg:w-full md:w-full w-[50px]"></th> */}
                                        <th className="flex justify-start md:basis-1/6 w-[200px]">
                                            Project
                                        </th>
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            Network
                                        </th>
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            Item
                                        </th>
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            Price
                                        </th>
                                        <th className="flex justify-start md:basis-1/6 w-[140px]">
                                            TxID
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="flex flex-col">
                                    {data?.userTransactionList.map((item: any, index: number) => (
                                        <HistoryItem item={item} />
                                    ))} 
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination data={data} page={page} pageNumberInput={pageNumberInput} isPreviousData={isPreviousData} setPage={setPage} setPageNumberInput={setPageNumberInput} refetch={refetch} />
                </div>
            )}
        </div>
    )
}
