import React, { Fragment, memo, useEffect } from "react";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

interface PaginationProps {
  data: any;
  page: number;
  pageNumberInput?: string;
  isPreviousData: boolean;
  setPage: any;
  refetch: any;
  isFetching: boolean;
}
const Pagination = ({
  data,
  page,
  pageNumberInput,
  isPreviousData,
  setPage,
}: PaginationProps) => {
  const goToPage = (pageNum: number) => {
    const newPageNumber = Math.max(1, Math.min(pageNum, data?.totalPages));
    setPage(newPageNumber);
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
    <div className="flex justify-end w-full px-4 mx-auto text-sm bg-shader_800">
      <div className="flex py-4 gap-x-8 ">
        <div className="flex gap-x-1">
          <button
            onClick={prevPage}
            disabled={isPreviousData || page === 1}
            className={`w-8 ${
              isPreviousData || page === 1
                ? "text-primary_400 opacity-30"
                : "text-primary_400"
            }`}
          >
            <MdNavigateBefore className="mx-auto text-2xl border border-transparent" />
          </button>
          {generatePagination(page, data?.totalPages).map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === "..." ? (
                <span className="text-shader_200 leading-[30px]">...</span>
              ) : (
                <button
                  className={`text-sm w-8 rounded-full text-shader_200 p-1 ${
                    pageNum === page ? "bg-primary_500 text-white" : ""
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
            disabled={page === data?.totalPages}
            className={`${
              page === data?.totalPages
                ? "text-primary_400 opacity-30"
                : "text-primary_400"
            }`}
          >
            <MdOutlineNavigateNext className="mx-auto text-2xl " />
          </button>
        </div>
        <div className="md:flex items-center justify-center gap-4 font-semibold text-shader_200 hidden">
          <span>Page {page}</span>
          <input
            type="number"
            min="1"
            max={data?.totalPages || 1}
            value={pageNumberInput}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const target = event.target as HTMLInputElement;
                const pageNumber = Number(target.value);
                if (!isNaN(pageNumber)) {
                  goToPage(pageNumber);
                }
              }
            }}
            className="block w-12 py-1 text-sm text-center text-white border rounded-lg outline-none bg-shader_800 border-shader_500"
          />
          <span>of {data?.totalPages}</span>
        </div>
      </div>
    </div>
  );
};
const TablePagination: React.FC<PaginationProps> = ({
  data,
  page,
  setPage,
  isFetching,
  refetch,
  isPreviousData,
}) => {
  const prevPage = () => {
    const prevPageNumber = Math.max(page - 1, 1);
    setPage(prevPageNumber);
  };

  const nextPage = () => {
    const nextPageNumber = Math.min(page + 1, data?.totalPages);
    setPage(nextPageNumber);
  };

  useEffect(() => {
    if (data?.totalPages === 0) {
      setPage(1);
    }
  }, [data?.totalPages]);

  // useEffect(() => {
  //   refetch();
  // }, [page]);

  return (
    <Fragment>
      {data?.length > 0 && (
        <div className="flex justify-center gap-4 pt-6 text-sm font-semibold">
          <button
            onClick={prevPage}
            disabled={isPreviousData || page === 1 || isFetching}
            className={`${
              isPreviousData || page === 1 || isFetching
                ? "text-white bg-slate-300"
                : "hover:text-white hover:bg-primary_500 transition-all"
            } w-8 flex items-center text-center justify-center rounded-full transition-all`}
          >
            <MdNavigateBefore />
          </button>
          <p>
            Page
            <span className="px-2 text-primary_500">{page}</span> of
            <span
              className="px-2 cursor-pointer text-primary_500"
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
                : "hover:text-white hover:bg-primary_500 transition-all"
            } w-8 flex items-center text-center justify-center rounded-full transition-all`}
          >
            <MdOutlineNavigateNext />
          </button>
        </div>
      )}
    </Fragment>
  );
};

export { Pagination, TablePagination };
