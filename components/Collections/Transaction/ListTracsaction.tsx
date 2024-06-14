import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState, useContext } from "react";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import AccountContext from "@/context/AccountContext";
import { SortIcon } from "@/components/Icons";
import TransactionItem from "./TransactionItem";
import { TabGroups } from "@/components/NavChoice";

function ListTracsaction() {
  const [page, setPage] = useState(1);
  const { chainId } = useContext(AccountContext);
  const [pageNumberInput, setPageNumberInput] = useState("");
  const [sortField, setSortField] = useState("blockTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const { isLoading, refetch, data, isFetching, isPreviousData } = useQuery({
    queryKey: ["transaction", chainId, sortField, sortOrder],
    queryFn: async () => {
      const res = await categoryAPI(
        `transaction-list?chainId=${chainId}&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}`
      );
      return res;
    },

    refetchInterval: 60000,
  });

  const handleSort = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // refetch();
  };
  return (
    <div className="mb-20 transactionList">
      <div className="bg_main">
        <TabGroups
          choices={["Transactions"]}
          activeChoice="Transactions"
          onChoiceChange={() => {}}
          isDefault
        />
        <div className=" overflow-x-auto">
          <table className="w-full text-left border-collapse min-h-[550px] flex flex-col">
            <thead className="uppercase bg-shader_600 text-shader_200 font-semibold">
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
                      //   fill1={
                      //     sortField === "amountNFT" && sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "amountNFT" && sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={sortField === "amountNFT" ? "#000D34" : "#A3A9B9"}
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
                      //   fill1={
                      //     sortField === "amountToken" && sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "amountToken" && sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={
                      //     sortField === "amountToken" ? "#000D34" : "#A3A9B9"
                      //   }
                    />
                  </div>
                </th>
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
                      //   fill1={
                      //     sortField === "blockTime" && sortOrder === "asc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill2={
                      //     sortField === "blockTime" && sortOrder === "desc"
                      //       ? "white"
                      //       : "#A3A9B9"
                      //   }
                      //   fill3={sortField === "blockTime" ? "#000D34" : "#A3A9B9"}
                    />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="flex flex-col flex-auto">
              <TransactionItem
                data={data}
                isLoading={isLoading}
                isFetching={isFetching}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ListTracsaction;
