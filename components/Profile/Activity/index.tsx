import { Pagination, TablePagination } from "@/components/Common/Pagination";
import { SkeletonTable } from "@/components/Skeleton";
import AccountContext from "@/context/AccountContext";
import { historyUserService } from "@/libs/service/profileService";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import HistoryItem from "./ActivityItem";

export default function History() {
  const [page, setPage] = useState(1);
  const { account, chainId } = useContext(AccountContext);
  const { isLoading, refetch, data, isFetching, isPlaceholderData, isSuccess } =
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
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-h-[550px]">
              <thead className="bg-shader_600 text-shader_200 uppercase">
                <tr className="flex px-4 py-3">
                  <th className="flex justify-start md:basis-1/7 w-[140px]">
                    Action
                  </th>
                  <th className="flex justify-start md:basis-1/7 w-[200px]">
                    Project
                  </th>
                  <th className="flex justify-start md:basis-1/7 w-[140px]">
                    Network
                  </th>
                  <th className="flex justify-start md:basis-1/7 w-[140px]">
                    Items
                  </th>
                  <th className="flex justify-start md:basis-1/7 w-[140px]">
                    Price
                  </th>
                  <th className="flex justify-start md:basis-1/7 w-[140px]">
                    TxID
                  </th>
                  <th className="flex justify-end md:basis-1/7 w-[140px]">
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody className="flex flex-col min-h-[620px]">
                {data?.userTransactionList.map((item: any, index: number) => (
                  <HistoryItem key={index} item={item} />
                ))}
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
        </>
      ) : (
        <p className="text-shader_200">No data available.</p>
      )}
    </div>
  );
}
