import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import TransactionItem from "./TransactionItem";

function ListTracsaction() {
  const [page, setPage] = useState(1);

  const [pageNumberInput, setPageNumberInput] = useState("");
  const { isLoading, refetch, data, isFetching, isPreviousData } = useQuery({
    queryKey: ["transaction"],
    queryFn: async () => {
      const res = await categoryAPI(`/transaction-list?page=${page}`);
      return res;
    },
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
      <div className="p-2 border rounded-lg overflow-hidden  overflow-x-scroll">
        <button className="bg-secondary4 text-white py-2 px-6 rounded-lg">
          Transaction
        </button>
        <div className="p-6">
          <table className="w-full text-left">
            <thead className="">
              <tr className="flex lg:text-base md:text-base text-sm">
                <th className="flex justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                  #
                </th>
                <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                  # Action
                </th>
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

      {/* <div className="flex gap-10 py-8 justify-center">
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
          <span className="px-2 text-secondary2 font-medium">{page}</span> of
          <span
            className="px-2 text-secondary2 font-medium cursor-pointer"
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
      <div className="mx-auto w-full flex justify-center text-sm">
        <div className="flex lg:flex-row md:flex-row flex-col lg:gap-10 md:gap-8 gap-4 py-20">
          <div className="flex lg:gap-10 md:gap-8 gap-4">
            <button
              onClick={prevPage}
              disabled={isPreviousData || page === 1}
              className={`${
                isPreviousData || page === 1
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
                      className={`text-sm min-w-[32px] rounded-lg text-dark2 p-1 ${
                        pageNum === page ? "bg-secondary2 text-white" : ""
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
              className={`${
                isPreviousData || page === data?.totalPages
                  ? "text-dark3 hover:border"
                  : ""
              }`}
            >
              <MdOutlineNavigateNext className="text-xl text-dark2" />
            </button>
          </div>
          <div className="ml-4 flex justify-center gap-4 items-center text-dark2">
            <span>Go to page </span>
            <div>
              <input
                type="number"
                min="1"
                max={data?.totalPages || 1}
                value={pageNumberInput}
                onChange={(e) => setPageNumberInput(e.target.value)}
                className="w-12 max-w-fit text-sm outline-none px-2 py-1 text-center border rounded"
              />{" "}
              <button
                onClick={() => goToPage(parseInt(pageNumberInput))}
                className="px-2 py-1 border rounded bg-secondary2 text-white hover:translate-x-1 transtion-all"
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
