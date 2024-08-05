import AccountContext from "@/context/AccountContext";
import { referralTopUser } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useContext, useState } from "react";
import { DiamondIcon, LoadingIcon } from "../Icons";
import ModalNumber from "../Modal/ModalLength/ModalNumber";
import SearchNotFound from "../Search/SearchNotFound";
import { Pagination } from "../Common/Pagination";

const MyReferral = () => {
  const { chainId, account, demask } = useContext(AccountContext);
  const [page, setPage] = useState(1);
  const { data, isLoading, isSuccess, isFetching, isPlaceholderData, refetch } =
    useQuery({
      queryKey: ["myReferral", chainId, account],
      queryFn: async () => {
        const res = await referralTopUser(account, chainId);
        return res;
      },
    });

  return (
    <>
      <div className="overflow-x-scroll  flex flex-col justify-between w-full">
        <table className="w-full text-left border-collapse min-h-[550px]">
          <thead className=" bg-shader_600 text-shader_200">
            <tr className="flex px-4 py-3">
              <th className="flex justify-start md:w-[70%] w-[100px]">
                Address
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
                    <td className="py-4 flex items-center justify-start md:w-full w-[100px] text-primary_400">
                      <Link
                        target="_blank"
                        href={`${demask.urltxHash}address/${item?.userAddress}`}
                      >
                        {`${item?.userAddress.slice(
                          0,
                          8
                        )}...${item?.userAddress.slice(-6)}`}
                      </Link>
                    </td>
                    <td className="py-4 flex items-center justify-end gap-x-1 lg:w-full md:w-full w-[100px]">
                      <ModalNumber data={item?.totalPoints} />
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
          isPlaceholderData={isPlaceholderData}
          page={page}
          setPage={setPage}
          refetch={refetch}
          isFetching={isFetching}
        />
      )}
    </>
  );
};

export default MyReferral;
