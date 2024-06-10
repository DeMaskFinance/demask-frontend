import AccountContext from "@/context/AccountContext";
import { referralHistoryUser } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { SkeletonTable } from "../Skeleton";
import ModalNumber from "../Modal/ModalLength/ModalNumber";
import { TableRowSkeleton } from "../Skeleton/SkeletonTable";
import { TablePagination } from "../Common/Pagination";
import { getColorType } from "@/libs/utils/getColorType";
import { DiamondIcon, LoadingIcon } from "../Icons";

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

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto ">
        <div className=" min-w-full  flex flex-col justify-between">
          <div className="">
            <table className="w-full text-left text-surface text-white text-sm font-semibold border-collapse min-h-[500px]">
              <thead className="uppercase bg-shader_600 text-shader_200 ">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-6 py-3 ">Tx hash</th>
                  <th className="px-6 py-3 text-end">DM Points</th>
                  <th className="px-6 py-3 flex justify-end">Time</th>
                </tr>
              </thead>
              <tbody className="">
                {account && (
                  <>
                    {isLoading ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-3">
                          <div className="flex items-center justify-center w-full h-full">
                            <LoadingIcon
                              width={30}
                              height={30}
                              className="animate-spin"
                            />
                          </div>
                        </td>
                      </tr>
                    ) : (
                      isSuccess &&
                      data &&
                      data.data.map((item: any, index: number) => (
                        <tr key={index} className="item_table h-12">
                          <td className="px-4 py-2 whitespace-nowrap flex gap-x-2">
                            {item.pointSource.map(
                              (type: any, index: number) => (
                                <div
                                  className={`bg-opacity-[0.15] px-3 flex text-center ${getColorType(
                                    type.action
                                  )} py-1 rounded-lg`}
                                >
                                  {type.action}
                                </div>
                              )
                            )}
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-primary_400">
                            <a
                              href={`${demask.urltxHash}tx/${item.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.transactionHash?.slice(0, 4)}...
                              {item.transactionHash?.slice(-8)}
                            </a>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap flex items-center justify-end text-end">
                            <ModalNumber data={item.point} />
                            <DiamondIcon width={20} height={20} />
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-end">
                            {item.blockTime}
                          </td>
                        </tr>
                      ))
                    )}
                  </>
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
