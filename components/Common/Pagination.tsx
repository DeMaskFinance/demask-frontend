import React, { Fragment, memo, useEffect } from "react";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

interface PaginationProps {
  data: any;
  page: number;
  pageNumberInput?: string;
  isPreviousData: boolean;
  setPage: any;
  setPageNumberInput?: any;
  refetch: any;
  totalPages: number;
  isFetching: boolean;
}
const Pagination = ({
  data,
  page,
  pageNumberInput,
  isPreviousData,
  setPage,
  setPageNumberInput,
  refetch,
}: PaginationProps) => {
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

  return (
    <div className="flex justify-center w-full mx-auto text-sm">
      <div className="flex flex-col gap-4 py-8 lg:flex-row md:flex-row lg:gap-10 md:gap-8">
        <div className="flex gap-1 lg:gap-10 md:gap-8">
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
          {generatePagination(page, data?.totalPages).map((pageNum, index) => (
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
          ))}
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
              onClick={() => goToPage(parseInt(pageNumberInput!))}
              className="px-2 py-1 text-white border rounded bg-secondary2 hover:translate-x-1 transtion-all"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
const TablePagination: React.FC<PaginationProps> = ({
  data,
  page,
  setPage,
  totalPages,
  isFetching,
  refetch,
  isPreviousData,
}) => {
  const prevPage = () => {
    const prevPageNumber = Math.max(page - 1, 1);
    setPage(prevPageNumber);
  };

  const nextPage = () => {
    const nextPageNumber = Math.min(page + 1, totalPages);
    setPage(nextPageNumber);
  };

  useEffect(() => {
    if (totalPages === 0) {
      setPage(1);
    }
  }, [totalPages]);

  // useEffect(() => {
  //   refetch();
  // }, [page]);

  return (
    <Fragment>
      {data?.length > 0 && (
        <div className="flex justify-center gap-4 pt-6 text-sm">
          <button
            onClick={prevPage}
            disabled={isPreviousData || page === 1 || isFetching}
            className={`${
              isPreviousData || page === 1 || isFetching
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
              onClick={() => page !== totalPages && setPage(totalPages)}
            >
              {totalPages}
            </span>
          </p>
          <button
            onClick={nextPage}
            disabled={isPreviousData || page === totalPages || isFetching}
            className={`${
              isPreviousData || page === totalPages || isFetching
                ? "text-white bg-slate-300"
                : "hover:text-white hover:bg-secondary2 transition-all"
            } w-5 flex items-center text-center justify-center rounded-full transition-all`}
          >
            <MdOutlineNavigateNext />
          </button>
        </div>
      )}
    </Fragment>
  );
};

export { Pagination, TablePagination };
