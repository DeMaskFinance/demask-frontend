import { useEffect, useState, useContext } from "react";

import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { MdOutlineNavigateNext, MdNavigateBefore } from "react-icons/md";
import CollectionItem from "./CollectionItem";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
function TopNft() {
  const [activeChoice, setActiveChoice] = useState<string>("Top");
  const [page, setPage] = useState(1);
  const { chainId } = useContext(AccountContext);
  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
    queryKey: ["topNft", chainId],
    queryFn: async () => {
      const res = await categoryAPI(`/v2/topNFT-list?chainId=${chainId}&page=${page}`);
      return res;
    },

    keepPreviousData: true,
  });

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setPage((next) => Math.min(next + 1, data?.totalPages));
  useEffect(() => {
    refetch();
  }, [page, refetch]);

  return (
    <div className="mb-8 collectionList">
      <div className="px-2 pt-2 pb-4 overflow-hidden rounded-lg lg:overflow-visible shadow-home ">
        <TabGroups
          choices={["Top", "Trending"]}
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
        />
        <div className="px-6 pt-6 pb-0 overflow-x-scroll lg:overflow-visible">
          <table className="w-full text-left">
            <thead className="">
              <tr className="flex pb-2 text-sm border-b lg:text-base md:text-base">
                <th className="flex justify-start lg:w-[440px] md:w-[340px] w-[50px]">
                  #
                </th>
                <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                  Name
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  $ Price
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  $ Change
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  $ Volume
                </th>
                <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                  $ TVL
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
    </div>
  );
}

export default TopNft;
