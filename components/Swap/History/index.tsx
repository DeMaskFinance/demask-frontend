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
    isPreviousData,
  } = useQuery({
    queryKey: ["historySwap", chainId, activeChoice],
    queryFn: async () => {
      const res = await categoryAPI(
        `transaction-list?chainId=${chainId}&sortField=blockTime&sortOrder=desc&page=${page}&limit=10&dmlAddress=${data.dmlAddress}&action=${activeChoice}&type=${typeERC}`
      );
      return res;
    },

    keepPreviousData: true,
  });

  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setPage((next) => Math.min(next + 1, dataHistory?.totalPages));
  useEffect(() => {
    refetch();
  }, [page, refetch]);
  const options = ["All", "Buy", "Sell", "Add", "Remove"];
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <div className="w-full mt-[15px]  mb-14 lg:mb-0">
      <div className="w-full p-2 py-2 min-h-[350px] overflow-x-scroll border rounded-lg border-shader_500 lg:overflow-visible bg-shader_700 border-shader_700">
        <TabTable
          choices={options}
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
        />
        <table className="w-full mt-2 text-left border-collapse">
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
              isLoading={isLoading}
              demask={demask}
            />
          </tbody>
        </table>
      </div>
      <div className="flex justify-center gap-10 pt-4 pb-2 text-shader_600">
        <button
          onClick={prevPage}
          disabled={isPreviousData || page === 1 || isFetching}
          className={`${
            isPreviousData || page === 1 || isFetching
              ? "text-white bg-slate-300"
              : "hover:text-white hover:bg-primary_500 transition-all"
          } w-6 flex items-center text-center justify-center rounded-full transition-all`}
        >
          <MdNavigateBefore />
        </button>
        <p>
          Page
          <span className="px-2 font-medium text-primary_500">{page}</span> of
          <span
            className="px-2 font-medium cursor-pointer text-primary_500"
            onClick={() =>
              page !== dataHistory?.totalPages &&
              setPage(dataHistory?.totalPages)
            }
          >
            {dataHistory?.totalPages}
          </span>
        </p>
        <button
          onClick={nextPage}
          disabled={
            isPreviousData || page === dataHistory?.totalPages || isFetching
          }
          className={`${
            isPreviousData || page === dataHistory?.totalPages || isFetching
              ? "text-white bg-slate-300"
              : "hover:text-white hover:bg-primary_500 transition-all"
          } w-6 flex items-center text-center justify-center rounded-full transition-all`}
        >
          <MdOutlineNavigateNext />
        </button>
      </div>
    </div>
  );
};
export default HistorySwap;
