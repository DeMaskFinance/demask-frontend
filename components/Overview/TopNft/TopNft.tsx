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
      <div className="p-2 border rounded-lg overflow-hidden  overflow-x-scroll">
        <div className="flex text-base text-white bg-dark3 gap-2 p-1 rounded-lg w-max items-center text-center">
          <button className="bg-secondary4 py-2 px-6 rounded-lg">Top</button>

          <button className="py-2 px-6 hover:bg-secondary4 rounded-lg">
            Trending
          </button>
        </div>
        <div className="p-6">
          <table className="w-full text-left">
            <thead className="">
              <tr className="flex lg:text-base md:text-base text-sm">
                <th className="flex justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                  #
                </th>
                <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                  Name
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  Price
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  Change
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  Volume
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  TVL
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  Total supply
                </th>
              </tr>
            </thead>

            <tbody className="flex flex-col">
              <CollectionItem
                isLoading={isLoading}
                data={data}
                isFetching={isFetching}
              />
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-10 py-8 justify-center  text-dark2">
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
