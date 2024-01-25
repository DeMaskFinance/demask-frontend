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
    const { isLoading, refetch, data, isFetching, isPreviousData, isSuccess } = useQuery({
        queryKey: ["historyUser", chainId],
        queryFn: async () => {
            const res = await historyUserService(account.toLowerCase(), chainId, page);
            return res;
        },
    });

    const goToPage = (pageNum: number) => {
        const newPageNumber = Math.max(1, Math.min(pageNum, data?.totalPages));
        setPage(newPageNumber);
        setPageNumberInput(String(newPageNumber));
    };
    const generatePagination = (currentPage: number, totalPages: any) => {
        const buttons = [];
        const maxButtonsToShow = 3;

        if (totalPages <= maxButtonsToShow + 2) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(i);
            }
        } else {
            const showFirstDots = currentPage > maxButtonsToShow;
            const showLastDots = currentPage < totalPages - maxButtonsToShow + 1;

            buttons.push(1);
            buttons.push(2);

            if (showFirstDots) {
                buttons.push("...");
            }

            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                if (i > 2 && i < totalPages - 1) {
                    buttons.push(i);
                }
            }

            if (showLastDots) {
                buttons.push("...");
            }

            buttons.push(totalPages - 1);
            buttons.push(totalPages);
        }

        return buttons;
    };

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
    }, [page]);
    return (
        <div>
            {(isLoading || isFetching) ? (
                <SkeletonTable length={4} />
            ) : (isSuccess && data.userTransactionList.length > 0) ? (
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
                    <div className="flex justify-center w-full mx-auto text-sm">
                        <div className="flex flex-col gap-4 py-8 lg:flex-row md:flex-row lg:gap-10 md:gap-8">
                            <div className="flex gap-1 lg:gap-10 md:gap-8">
                                <button
                                    onClick={prevPage}
                                    disabled={isPreviousData || page === 1}
                                    className={`${isPreviousData || page === 1
                                        ? "text-dark3 hover:border-red"
                                        : "text-dark2"
                                        }`}
                                >
                                    <MdNavigateBefore className="text-xl border border-transparent" />
                                </button>
                                {generatePagination(page, data?.totalPages).map(
                                    (pageNum, index) => (
                                        <React.Fragment key={index}>
                                            {pageNum === "..." ? (
                                                <span>...</span>
                                            ) : (
                                                <button
                                                    className={`text-sm min-w-[32px] rounded-lg text-dark2 p-1 ${pageNum === page ? "bg-secondary2 text-white" : ""
                                                        }`}
                                                    onClick={() => goToPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            )}
                                        </React.Fragment>
                                    )
                                )}
                                <button
                                    onClick={nextPage}
                                    disabled={isPreviousData || page === data?.totalPages}
                                    className={`${isPreviousData || page === data?.totalPages
                                        ? "text-dark3 hover:border"
                                        : ""
                                        }`}
                                >
                                    <MdOutlineNavigateNext className="text-xl text-dark2" />
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-4 ml-4 text-dark2">
                                <span>Go to page </span>
                                <div>
                                    <input
                                        type="number"
                                        min="1"
                                        max={data?.totalPages || 1}
                                        value={pageNumberInput}
                                        onChange={(e) => setPageNumberInput(e.target.value)}
                                        className="w-12 px-2 py-1 text-sm text-center border rounded outline-none max-w-fit"
                                    />{" "}
                                    <button
                                        onClick={() => goToPage(parseInt(pageNumberInput))}
                                        className="px-2 py-1 text-white border rounded bg-secondary2 hover:translate-x-1 transtion-all"
                                    >
                                        Go
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <p>No data available.</p>
                </div>
            )}
        </div>
    )
}
