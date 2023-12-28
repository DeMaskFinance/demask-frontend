import React, { useContext, useEffect, useState } from 'react'
import HistoryItem from './HistoryItem'
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { MdNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import AccountContext from '@/context/AccountContext';
interface HistorySwapProps {
    data: any
}
const HistorySwap: React.FunctionComponent<HistorySwapProps> = ({ data }) => {
    const [page, setPage] = useState(1);
    const [tab, setTab] = useQueryParam("historyType", withDefault(StringParam, "All"));
    const { account, wallet, chainId, demask } = useContext(AccountContext);
    const { isLoading, data: dataHistory, isFetching, refetch, isPreviousData } = useQuery({
        queryKey: ["historySwap", chainId, tab],
        queryFn: async () => {
            const res = await categoryAPI(`transaction-list?chainId=${chainId}&sortField=blockTime&sortOrder=desc&page=${page}&limit=10&dmlAddress=${data.dmlAddress}&action=${tab}`);
            return res;
        },

        keepPreviousData: true,
    });

    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () =>
        setPage((next) => Math.min(next + 1, dataHistory?.totalPages));
    useEffect(() => {
        refetch();
    }, [page, refetch]);
    const options = [{
        tab: 'All'
    }, {
        tab: 'Buy'
    }, { tab: 'Sell' }, { tab: 'Add' }, { tab: 'Remove' }];
    return (
        <div className='w-full mt-[15px] mb-14 lg:mb-0'>
            <div className="w-full p-2 py-2 overflow-x-scroll border rounded-lg border-dark3 lg:overflow-visible">
                <div className='sticky left-0 flex items-center gap-2 p-1 mb-2 text-base text-center text-white rounded-lg lg:left-2 bg-dark3 w-max'>
                    {options.map((item, idx) => (
                        <button
                            key={idx}
                            className={`py-2 px-4 ${tab === item.tab ? "bg-secondary5" : ""
                                } rounded-lg text-xs`}
                            type="button"
                            onClick={() => {
                                setTab(item.tab)
                            }}
                        >
                            {item.tab}
                        </button>
                    ))}
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="">
                        <tr className="flex pb-2 text-sm border-b ">
                            <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                                <p className='lg:w-full md:w-[175px] w-[200px]'>Time</p>
                            </th>
                            <th className="flex md:w-[70%] w-[100px]">
                                Type
                            </th>
                            <th className="flex justify-center lg:w-full md:w-full w-[100px]">
                                NFT amount
                            </th>
                            <th className="flex justify-center lg:w-full md:w-full w-[140px]">
                                Price
                            </th>
                            <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                                Token amount
                            </th>
                            <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                                From
                            </th>
                            <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                                Tx
                            </th>
                        </tr>
                    </thead>

                    <tbody className="flex flex-col">
                        <HistoryItem data={dataHistory} isFetching={isFetching} isLoading={isLoading} demask={demask} />
                    </tbody>
                </table>
            </div >
            <div className="flex justify-center gap-10 pt-4 pb-2 text-dark2">
                <button
                    onClick={prevPage}
                    disabled={isPreviousData || page === 1 || isFetching}
                    className={`${isPreviousData || page === 1 || isFetching
                        ? "text-white bg-slate-300"
                        : "hover:text-white hover:bg-secondary2 transition-all"
                        } w-6 flex items-center text-center justify-center rounded-full transition-all`}
                >
                    <MdNavigateBefore />
                </button>
                <p>
                    Page
                    <span className="px-2 font-medium text-secondary2">{page}</span> of
                    <span
                        className="px-2 font-medium cursor-pointer text-secondary2"
                        onClick={() =>
                            page !== dataHistory?.totalPages && setPage(dataHistory?.totalPages)
                        }
                    >
                        {dataHistory?.totalPages}
                    </span>
                </p>
                <button
                    onClick={nextPage}
                    disabled={isPreviousData || page === dataHistory?.totalPages || isFetching}
                    className={`${isPreviousData || page === dataHistory?.totalPages || isFetching
                        ? "text-white bg-slate-300"
                        : "hover:text-white hover:bg-secondary2 transition-all"
                        } w-6 flex items-center text-center justify-center rounded-full transition-all`}
                >
                    <MdOutlineNavigateNext />
                </button>
            </div>
        </div>

    )
};
export default HistorySwap;
