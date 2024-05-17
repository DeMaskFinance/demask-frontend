import AccountContext from "@/context/AccountContext";
import { referralHistoryUser } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { SkeletonTable } from "../Skeleton";
import ModalNumber from "../Modal/ModalLength/ModalNumber";
import { TableRowSkeleton } from "../Skeleton/SkeletonTable";
import { TablePagination } from "../Common/Pagination";

const Rewards = () => {
  const { chainId, account, demask } = useContext(AccountContext);
  const [page, setPage] = useState(1);
  const { data, isLoading, isSuccess, isFetching, refetch, isPreviousData } =
    useQuery({
      queryKey: ["myRewards", chainId, account, page],
      queryFn: async () => {
        const res = await referralHistoryUser(account, chainId, page);
        return res;
      },
    });
  console.log(data, page);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="min-w-full py-2 sm:px-6 lg:px-8 min-h-[500px] flex flex-col justify-between">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-surface dark:text-white">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-4 w-14">
                    Place
                  </th>
                  <th scope="col" className="px-10 py-4">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Tx hash
                  </th>
                  <th scope="col" className="px-6 py-4">
                    DM Points
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableRowSkeleton length={10} col={4} />
                ) : (
                  isSuccess &&
                  data &&
                  data.data.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.index}
                      </td>
                      <td className="px-10 py-4 whitespace-nowrap">
                        {item.pointSource.map((type: any, index: number) => (
                          <span
                            key={index}
                            className={`border text-xs bg-opacity-10 w-16 text-center ${
                              type.action === "Buy" || type.action === "Add"
                                ? "border-green text-green bg-green"
                                : "border-red text-red bg-red"
                            } p-1 rounded-lg`}
                          >
                            {type.action}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-secondary5">
                        <a
                          href={`${demask.urltxHash}tx/${item.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.transactionHash?.slice(0, 4)}...
                          {item.transactionHash?.slice(-8)}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ModalNumber data={item.point} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.blockTime}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            data={data?.data}
            page={page}
            setPage={setPage}
            totalPages={data?.totalPages | 1}
            isFetching={isFetching}
            refetch={refetch}
            isPreviousData={isPreviousData}
          />
        </div>
      </div>
    </div>
  );
};

export default Rewards;
