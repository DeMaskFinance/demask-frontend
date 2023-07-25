import { useEffect, useState } from "react";

import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineNavigateNext, MdNavigateBefore } from "react-icons/md";
import CollectionItem from "./CollectionItem";
function TopNft() {
  const [page, setPage] = useState(1);

  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
    queryKey: ["topNft"],
    queryFn: async () => {
      const res = await categoryAPI(`/topNFT-list?page=${page}`);
      return res;
    },

    keepPreviousData: true,
  });

  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setPage((next) => Math.min(next + 1, data?.totalPages));
  useEffect(() => {
    refetch();
  }, [page, refetch]);

  return (
    <div className="collectionList">
      <div className="flex text-xl text-white w-max items-center text-center">
        <div className="flex items-center justify-center  rounded-tl-lg bg-secondary1  px-4 py-2 h-full cursor-pointer">
          <span>TOP</span>
        </div>

        <div className="flex items-center justify-center px-4 py-2 rounded-tr-lg cursor-pointer  bg-dark3">
          <span>TRENDING</span>
        </div>
      </div>

      <div className="p-6 border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <colgroup>
            <col style={{ width: "30%" }} /> <col style={{ width: "13%" }} />
            <col style={{ width: "12%" }} /> <col style={{ width: "13%" }} />
            <col style={{ width: "12%" }} /> <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr>
              <th># Name</th>
              <th>Price</th>
              <th>Change</th>
              <th>Volume</th>
              <th className="text-center">TVL</th>
              <th className="text-right">Total supply</th>
            </tr>
          </thead>
          <tbody>
            <CollectionItem
              isLoading={isLoading}
              data={data}
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

export default TopNft;
