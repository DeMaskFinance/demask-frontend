import { LoadingIcon, RightIcon, SortIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useContext, useState } from "react";
import TransactionItem from "./TransactionItem";
import Link from "next/link";
import { useRouter } from "next/router";
import { Pagination } from "@/components/Common/Pagination";

function ListTracsaction() {
  const [page, setPage] = useState(1);
  const { chainId } = useContext(AccountContext);
  const [sortField, setSortField] = useState("blockTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();
  const { isLoading, refetch, data, isFetching, isPlaceholderData, isSuccess } =
    useQuery({
      queryKey: ["transaction", chainId, sortField, sortOrder, page],
      queryFn: async () => {
        const res = await categoryAPI(
          `transaction-list?chainId=${chainId}&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}`
        );
        return res;
      },

      // refetchInterval: 60000,
    });

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // refetch();
  };
  return (
    <div className="bg_main mb-20">
      <div className="flex justify-between items-center rounded-t-lg overflow-hidden">
        <TabGroups
          choices={["Transactions"]}
          activeChoice="Transactions"
          onChoiceChange={() => {}}
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
      <div className=" overflow-x-auto md:overflow-visible">
        <table className="w-full text-left border-collapse min-h-[550px]">
          <thead className=" bg-shader_600 text-shader_200 uppercase">
            <tr className="flex px-4 py-3">
              <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                Name
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                Action
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                NFT amount
                <div
                  className="cursor-pointer"
                  onClick={() => handleSort("amountNFT")}
                >
                  <SortIcon
                    width={16}
                    height={16}
                    fill1={
                      sortField === "amountNFT" && sortOrder === "asc"
                        ? "white"
                        : "#687184"
                    }
                    fill2={
                      sortField === "amountNFT" && sortOrder === "desc"
                        ? "white"
                        : "#687184"
                    }
                  />
                </div>
              </th>

              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                Total ETH
                <div
                  className="cursor-pointer"
                  onClick={() => handleSort("amountToken")}
                >
                  <SortIcon
                    width={16}
                    height={16}
                    fill1={
                      sortField === "amountToken" && sortOrder === "asc"
                        ? "white"
                        : "#687184"
                    }
                    fill2={
                      sortField === "amountToken" && sortOrder === "desc"
                        ? "white"
                        : "#687184"
                    }
                  />
                </div>
              </th>
              <td className="flex items-center justify-end lg:w-full md:w-full w-[140px] gap-x-1">
                Type
              </td>
              <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                Account
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] gap-x-1 items-center">
                Time
                <div
                  className="cursor-pointer"
                  onClick={() => handleSort("blockTime")}
                >
                  <SortIcon
                    width={16}
                    height={16}
                    fill1={
                      sortField === "blockTime" && sortOrder === "asc"
                        ? "white"
                        : "#687184"
                    }
                    fill2={
                      sortField === "blockTime" && sortOrder === "desc"
                        ? "white"
                        : "#687184"
                    }
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="flex flex-col flex-auto">
            {isLoading || isFetching ? (
              <div className="w-full h-full flex-auto justify-center items-center flex">
                <LoadingIcon width={30} height={30} className="animate-spin" />
              </div>
            ) : (
              <Fragment>
                <TransactionItem data={data} isFetching={isFetching} />
              </Fragment>
            )}
          </tbody>
        </table>
      </div>
      {isSuccess && (
        <Pagination
          data={data}
          isPlaceholderData={isPlaceholderData}
          page={page}
          setPage={setPage}
          refetch={refetch}
          isFetching={isFetching}
        />
      )}
    </div>
  );
}

export default ListTracsaction;
