import React, { useEffect, useState } from 'react'
import HistoryItem from './HistoryItem'
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { MdNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';
interface HistorySwapProps {
    data: any
}
const HistorySwap: React.FunctionComponent<HistorySwapProps> = ({ data }) => {
    const [page, setPage] = useState(1);
    const { isLoading, data: dataHistory, isFetching, refetch, isPreviousData } = useQuery({
        queryKey: ["historySwap"],
        queryFn: async () => {
            const res = await categoryAPI(`topNFT-list?chainId=280&page=${page}`);
            return res;
        },

        keepPreviousData: true,
    });
    console.log(data);
    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () =>
        setPage((next) => Math.min(next + 1, data?.totalPages));
    useEffect(() => {
        refetch();
    }, [page, refetch]);
    return (
        <div className='w-full mt-[15px]'>
            <div className="w-full overflow-y-auto border rounded-lg border-dark3">
                <table className="w-full md:text-sm text-left border-collapse text-[10px]">
                    <thead className="sticky top-0 z-10 m-1 ">
                        <tr className="mx-2 text-[16px] text-dark0">
                            <th scope="col" className="sticky left-0 px-3 py-3 bg-white rounded-lg">Time</th>
                            <th scope="col">
                                <div className="flex items-center justify-end pl-20 min-w-max">Type</div>
                            </th>
                            <th scope="col">
                                <div className="flex items-center justify-end pl-20 min-w-max">ETH</div>
                            </th>
                            <th scope="col">
                                <div className="flex items-center justify-end pl-20 min-w-max">{data.metadata?.symbol}</div>
                            </th>
                            <th scope="col">
                                <div className="flex items-center justify-end pl-20 min-w-max">Price</div>
                            </th>
                            <th scope="col">
                                <div className="flex items-center justify-end pl-20 min-w-max">From</div>
                            </th>
                            <th scope="col">
                                <div className="flex items-center justify-end pl-20 pr-2 min-w-max">Tx</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody className=" text-base font-normal  max-md:text-[12px] bg-transparent border-gray-700 cursor-pointer">
                        <HistoryItem data={dataHistory} isFetching={isFetching} isLoading={isLoading} />
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
                        } w-6 flex items-center text-center justify-center rounded-full transition-all`}
                >
                    <MdOutlineNavigateNext />
                </button>
            </div>
        </div>

    )
};
export default HistorySwap;
