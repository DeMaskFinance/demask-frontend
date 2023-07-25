import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import TransactionItem from "./TransactionItem";

function ListTracsaction() {
  const [page, setPage] = useState(1);
  const { isLoading, refetch, data, isFetching, isPreviousData } = useQuery({
    queryKey: ["transaction"],
    queryFn: async () => {
      const res = await categoryAPI(`/transaction-list?page=${page}`);
      return res;
    },
  });
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setPage((next) => Math.min(next + 1, data?.totalPages));
  useEffect(() => {
    refetch();
  }, [page, refetch]);
  return (
    <div className="transactionList">
      <h3 className="text-xl w-max px-4 text-white py-2 border bg-secondary1 border-dark3 rounded-t-lg border-b-0">
        TRANSACTION
      </h3>

      <div className="p-6 border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <colgroup>
            <col style={{ width: "25%" }} /> <col style={{ width: "10%" }} />
            <col style={{ width: "20%" }} /> <col style={{ width: "10%" }} />
            <col style={{ width: "25%" }} /> <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr>
              <th># Action</th>
              <th>NFT amount</th>
              <th className="text-center">Token amount</th>
              <th className="text-right">Account</th>
              <th className="text-center">Time</th>
              <th className="text-right">Total supply</th>
            </tr>
          </thead>

          <tbody>
            <TransactionItem
              data={data}
              isLoading={isLoading}
              isFetching={isFetching}
            />
          </tbody>
        </table>
      </div>

      <div className="flex gap-10 py-8 justify-center">
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
      </div>
    </div>
  );
}

export default ListTracsaction;
