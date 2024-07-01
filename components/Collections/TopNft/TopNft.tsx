import { useContext, useState } from "react";

import { RightIcon, SortIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import CollectionItem from "./CollectionItem";
import { useRouter } from "next/router";
function TopNft() {
  const [activeChoice, setActiveChoice] = useState<string>("Trending");
  const [page, setPage] = useState(1);
  const [pageNewest, setPageNewest] = useState(1);
  const { chainId } = useContext(AccountContext);
  const [sortField, setSortField] = useState("volume24h");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();

  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
    queryKey: ["topNft", chainId, sortField, sortOrder, page],
    queryFn: async () => {
      const res = await categoryAPI(
        `top-collection-list?chainId=${chainId}&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}`
      );
      return res;
    },

    keepPreviousData: true,
  });
  const {
    isLoading: isLoadingNewest,
    data: dataNewest,
    isFetching: isFetchingNewest,
    refetch: refetchNewest,
    isPreviousData: isPreviousDataNewest,
  } = useQuery({
    queryKey: ["newestNft", chainId, pageNewest],
    queryFn: async () => {
      const res = await categoryAPI(
        `newest-dml-list?chainId=${chainId}&limit=10&page=${pageNewest}`
      );
      return res;
    },

    keepPreviousData: true,
  });

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // refetch();
  };

  return (
    <div className="bg_main my-4 md:my-6">
      <div className="flex justify-between items-center rounded-t-lg overflow-hidden">
        <TabGroups
          choices={["Trending", "Newest"]}
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
          isDefault
        />
        {router.pathname === "/collections" && (
          <Link
            href="/collections/trending"
            className="mr-4 flex items-center gap-x-1 text-sm text-primary_300"
          >
            <p>View all</p>
            <RightIcon width={16} height={16} />
          </Link>
        )}
      </div>
      <div className="overflow-x-scroll  flex flex-col justify-between w-full">
        <table className="w-full text-left border-collapse min-h-[550px]">
          <thead className=" bg-shader_600 text-shader_200">
            <tr className="flex px-4 py-3">
              <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                Name
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                Price
                {activeChoice === "Trending" && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("floorPrice")}
                  >
                    <SortIcon
                      width={16}
                      height={16}
                      //   fill1={
                      //     sortField === "floorPrice" && sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "floorPrice" && sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={
                      //     sortField === "floorPrice" ? "#000D34" : "#A3A9B9"
                      //   }
                    />
                  </div>
                )}
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                1D Change
                {activeChoice === "Trending" && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("changePrice24h")}
                  >
                    <SortIcon
                      width={16}
                      height={16}
                      //   fill1={
                      //     sortField === "changePrice24h" &&
                      //     sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "changePrice24h" &&
                      //     sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={
                      //     sortField === "changePrice24h"
                      //       ? "#000D34"
                      //       : "#A3A9B9"
                      //   }
                    />
                  </div>
                )}
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                1D Volume
                {activeChoice === "Trending" && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("volume24h")}
                  >
                    <SortIcon
                      width={16}
                      height={16}
                      //   fill1={
                      //     sortField === "volume24h" && sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "volume24h" && sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={
                      //     sortField === "volume24h" ? "#000D34" : "#A3A9B9"
                      //   }
                    />
                  </div>
                )}
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                TVL
                {activeChoice === "Trending" && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("TVL")}
                  >
                    <SortIcon
                      width={16}
                      height={16}
                      //   fill1={
                      //     sortField === "TVL" && sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "TVL" && sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={sortField === "TVL" ? "#000D34" : "#A3A9B9"}
                    />
                  </div>
                )}
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                Total supply
                {activeChoice === "Trending" && (
                  <div
                    className="cursor-pointer"
                    onClick={() => handleSort("totalSupply")}
                  >
                    <SortIcon
                      width={16}
                      height={16}
                      //   fill1={
                      //     sortField === "totalSupply" && sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "totalSupply" && sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={
                      //     sortField === "totalSupply" ? "#000D34" : "#A3A9B9"
                      //   }
                    />
                  </div>
                )}
              </th>
            </tr>
          </thead>

          <tbody className="flex flex-col flex-auto">
            {activeChoice === "Trending" ? (
              <CollectionItem
                isLoading={isLoading}
                data={data}
                isPreviousData={isPreviousData}
                isFetching={isFetching}
                page={page}
                setPage={setPage}
                refetch={refetch}
              />
            ) : (
              <CollectionItem
                isLoading={isLoadingNewest}
                data={dataNewest}
                isPreviousData={isPreviousDataNewest}
                isFetching={isFetchingNewest}
                page={pageNewest}
                setPage={setPageNewest}
                refetch={refetchNewest}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopNft;
