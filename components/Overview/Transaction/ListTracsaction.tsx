import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useContext } from "react";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import TransactionItem from "./TransactionItem";
import AccountContext from "@/context/AccountContext";

function ListTracsaction() {
  const [page, setPage] = useState(1);
  const { chainId } = useContext(AccountContext);
  const [pageNumberInput, setPageNumberInput] = useState("");
  const { isLoading, refetch, data, isFetching, isPreviousData } = useQuery({
    queryKey: ["transaction", chainId],
    queryFn: async () => {
      const res = await categoryAPI(`transaction-list?chainId=${chainId}&page=${page}`);
      return res;
    },

    refetchInterval: 60000,
  });

  const goToPage = (pageNum: any) => {
    const newPageNumber = Math.max(1, Math.min(pageNum, data?.totalPages));
    setPage(newPageNumber);
    setPageNumberInput(String(newPageNumber));
  };
  const generatePagination = (currentPage: any, totalPages: any) => {
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
  }, [page, refetch]);
  return (
    <div className="transactionList">
      <div className="px-2 pt-2 overflow-hidden rounded-lg shadow-home">
        <button className="px-6 py-2 text-white rounded-lg bg-secondary4">
          Transaction
        </button>
        <div className="px-6 pt-6 pb-0 overflow-x-scroll">
          <table className="w-full text-left">
            <thead className="">
              <tr className="flex px-2 pb-2 text-sm border-b lg:text-base md:text-base">
                <th className="flex justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                  #
                </th>
                <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                  Action
                </th>
                {/* <th className="flex justify-start lg:w-full md:w-full w-[50px]"></th> */}
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  NFT amount
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  Token amount
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  Account
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  Time
                </th>
              </tr>
            </thead>

            <tbody className="flex flex-col">
              <TransactionItem
                data={data}
                isLoading={isLoading}
                isFetching={isFetching}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="flex justify-center gap-10 py-8">
        <button
          onClick={prevPage}
          disabled={isPreviousData || page === 1 || isFetching}
          className={`${
            isPreviousData || page === 1 || isFetching
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
          className={`${
            isPreviousData || page === data?.totalPages || isFetching
              ? "text-white bg-slate-300"
              : "hover:text-white hover:bg-secondary2 transition-all"
          } w-6 flex items-center text-center justify-center rounded-full transition-all`}
        >
          <MdOutlineNavigateNext />
        </button>
      </div> */}
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
  );
}

export default ListTracsaction;
