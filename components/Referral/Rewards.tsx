import AccountContext from "@/context/AccountContext";
import { referralHistoryUser } from "@/libs/service/referralService";
import { getColorType } from "@/libs/utils/getColorType";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useContext, useState } from "react";
import { DiamondIcon, LoadingIcon } from "../Icons";
import ModalNumber from "../Modal/ModalLength/ModalNumber";
import SearchNotFound from "../Search/SearchNotFound";
import { Pagination } from "../Common/Pagination";

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
    <Fragment>
      <div className="overflow-x-scroll  flex flex-col justify-between w-full">
        <table className="w-full text-left border-collapse min-h-[550px]">
          <thead className=" bg-shader_600 text-shader_200">
            <tr className="flex px-4 py-3">
              <th className="flex justify-start md:w-full w-[200px]">Type</th>
              <th className="flex justify-start md:w-full w-[100px]">
                Tx hash
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[100px]">
                DM points
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] ">
                Time
              </th>
            </tr>
          </thead>

          {account ? (
            <tbody className="flex flex-col h-full flex-auto ">
              {isLoading ? (
                <div className="flex items-center justify-center w-full h-full flex-auto ">
                  <LoadingIcon
                    width={30}
                    height={30}
                    className="animate-spin"
                  />
                </div>
              ) : isSuccess && data && data.data.length > 0 ? (
                data.data.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="flex px-4 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_700 border-y border-shader_500 bg-shader_800"
                  >
                    <td className="py-2 flex items-center justify-start md:w-full w-[200px] text-primary_400 gap-x-1">
                      {item.pointSource.map((type: any, index: number) => (
                        <div
                          key={index}
                          className={`bg-opacity-[0.15] px-3 flex text-center ${getColorType(
                            type.action
                          )} py-1 rounded-lg`}
                        >
                          {type.action}
                        </div>
                      ))}
                    </td>
                    <td className="flex justify-start md:w-full w-[100px] items-center text-primary_400">
                      <a
                        href={`${demask.urltxHash}tx/${item.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.transactionHash?.slice(0, 4)}...
                        {item.transactionHash?.slice(-8)}
                      </a>
                    </td>
                    <td className="py-2 flex items-center justify-end gap-x-1 lg:w-full md:w-full w-[100px]">
                      <ModalNumber data={item.point} />
                      <DiamondIcon width={20} height={20} />
                    </td>
                    <td className="flex justify-end lg:w-full md:w-full w-[140px] items-center ">
                      {item?.blockTime}
                    </td>
                  </tr>
                ))
              ) : (
                <SearchNotFound />
              )}
            </tbody>
          ) : (
            <SearchNotFound />
          )}
        </table>
      </div>
      {isSuccess && (
        <Pagination
          data={data}
          isPreviousData={isPreviousData}
          page={page}
          setPage={setPage}
          refetch={refetch}
          isFetching={isFetching}
        />
      )}
    </Fragment>
  );
};

export default Rewards;
