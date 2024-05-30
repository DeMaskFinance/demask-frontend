import React, { useContext, useEffect, useState } from "react";
import HistoryItem from "./HistoryItem";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import AccountContext from "@/context/AccountContext";
import TabQuery from "@/components/NavChoice/TabQuery";
import { TabGroups } from "@/components/NavChoice";
import TabTable from "@/components/NavChoice/TabTable";
import { Pagination } from "@/components/Common/Pagination";
interface HistorySwapProps {
  data: DataBase;
  typeERC: string;
}
const HistorySwap: React.FunctionComponent<HistorySwapProps> = ({
  data,
  typeERC,
}) => {
  const [page, setPage] = useState(1);
  const [activeChoice, setActiveChoice] = useState<string>("All");
  const { account, wallet, chainId, demask } = useContext(AccountContext);
  const {
    isLoading,
    data: dataHistory,
    isFetching,
    refetch,
    isSuccess,
    isPreviousData,
  } = useQuery({
    queryKey: ["historySwap", chainId, activeChoice, data, page],
    queryFn: async () => {
      const res = await categoryAPI(
        `transaction-list?chainId=${chainId}&sortField=blockTime&sortOrder=desc&page=${page}&limit=10&dmlAddress=${data.dmlAddress}&action=${activeChoice}&type=${typeERC}`
      );
      return res;
    },

    keepPreviousData: true,
  });

  const options = ["All", "Buy", "Sell", "Add", "Remove"];
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <div className="w-full font-semibold mb-14 lg:mb-0">
      <div className="w-full overflow-x-scroll border border-shader_500 lg:overflow-visible bg-shader_800">
        <TabTable
          choices={options}
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
        />
        <table className="w-full text-left border-collapse">
          <thead className=" bg-shader_600 text-shader_200">
            <tr className="flex px-4 py-3 text-sm">
              <th className="flex justify-start pl-2 md:w-[70%] w-[100px]">
                TYPE
              </th>
              <th className="flex justify-center lg:w-full md:w-full w-[100px]">
                NFT AMOUNT
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                PRICE
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                TOTAL
              </th>
              <th className="flex justify-center lg:w-full md:w-full w-[140px]">
                FROM
              </th>
              <th className="flex justify-center lg:w-full md:w-full w-[140px]">
                TX
              </th>
              <th className="flex  lg:w-full md:w-full w-[200px] pr-2">
                <p className="lg:w-full flex items-center justify-end md:w-[175px] w-[200px]">
                  TIME
                </p>
              </th>
            </tr>
          </thead>

          <tbody className="flex flex-col">
            <HistoryItem
              data={dataHistory}
              isFetching={isFetching}
              isSuccess={isSuccess}
              isLoading={isLoading}
              demask={demask}
            />
          </tbody>
        </table>
      </div>
      {isSuccess && (
        <Pagination
          data={dataHistory}
          isPreviousData={isPreviousData}
          page={page}
          setPage={setPage}
          refetch={refetch}
          totalPages={15}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};
export default HistorySwap;
