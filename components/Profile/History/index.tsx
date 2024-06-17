import { TablePagination } from "@/components/Common/Pagination";
import { SkeletonTable } from "@/components/Skeleton";
import AccountContext from "@/context/AccountContext";
import { historyUserService } from "@/libs/service/profileService";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import HistoryItem from "./HistoryItem";

export default function History() {
  const [page, setPage] = useState(1);
  const { account, chainId } = useContext(AccountContext);
  const { isLoading, refetch, data, isFetching, isPreviousData, isSuccess } =
    useQuery({
      queryKey: ["historyUser", chainId, page],
      queryFn: async () => {
        const res = await historyUserService(
          account.toLowerCase(),
          chainId,
          page
        );
        return res;
      },
    });

  return (
    <div>
      {isLoading || isFetching ? (
        <SkeletonTable length={10} />
      ) : isSuccess && data.userTransactionList.length > 0 ? (
        <div className="transactionList">
          <div className="px-2 pt-2 overflow-hidden rounded-lg shadow-home min-h-[550px]">
            <div className="px-6 pt-6 pb-0 overflow-x-scroll">
              <table className="w-full text-left">
                <thead className="text-white">
                  <tr className="flex px-2 pb-2 text-sm lg:text-base md:text-base">
                    <th className="flex justify-start md:basis-1/6 w-[140px]">
                      Action
                    </th>
                    {/* <th className="flex justify-start lg:w-full md:w-full w-[50px]"></th> */}
                    <th className="flex justify-start md:basis-1/6 w-[200px]">
                      Project
                    </th>
                    <th className="flex justify-start md:basis-1/6 w-[140px]">
                      Network
                    </th>
                    <th className="flex justify-start md:basis-1/6 w-[140px]">
                      Item
                    </th>
                    <th className="flex justify-start md:basis-1/6 w-[140px]">
                      Price
                    </th>
                    <th className="flex justify-start md:basis-1/6 w-[140px]">
                      TxID
                    </th>
                  </tr>
                </thead>

                <tbody className="flex flex-col min-h-[620px]">
                  {data?.userTransactionList.map((item: any, index: number) => (
                    <HistoryItem item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <TablePagination
            data={data?.userTransactionList}
            page={page}
            setPage={setPage}
            totalPages={data?.totalPages || 1}
            isFetching={isFetching}
            refetch={refetch}
            isPreviousData={isPreviousData}
          />
        </div>
      ) : (
        <div>
          <p>No data available.</p>
        </div>
      )}
    </div>
  );
}
