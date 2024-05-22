import AccountContext from "@/context/AccountContext";
import {
  referralHistoryUser,
  referralPointUser,
  referralTopUser,
} from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { SkeletonTable } from "../Skeleton";
import { TableRowSkeleton } from "../Skeleton/SkeletonTable";
import { TablePagination } from "../Common/Pagination";
import ModalNumber from "../Modal/ModalLength/ModalNumber";

const MyReferral = () => {
  const { chainId, account } = useContext(AccountContext);
  const [page, setPage] = useState(1);
  const { data, isLoading, isSuccess, isFetching, refetch, isPreviousData } =
    useQuery(
      ["myReferral", chainId, account, page],
      async () => {
        const res = await referralTopUser(account, chainId);
        return res;
      },
      {
        enabled: !!account,
      }
    );

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className=" min-w-full py-2 sm:px-6 lg:px-8 min-h-[500px] flex flex-col justify-between">
          <div className="overflow-hidden ">
            <table className="min-w-full text-left text-surface dark:text-white">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-4 ">
                    Place
                  </th>
                  <th scope="col" className="px-10 py-4">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-4">
                    DM points
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableRowSkeleton length={9} col={4} />
                ) : (
                  isSuccess &&
                  data &&
                  data.data.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">1</td>
                      <td className="px-10 py-4 whitespace-nowrap">
                        {item?.userAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ModalNumber data={item?.totalPoints}/>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.blockTime}
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
            totalPages={data?.totalPages || 1}
            isFetching={isFetching}
            refetch={refetch}
            isPreviousData={isPreviousData}
          />
        </div>
      </div>
    </div>
  );
};

export default MyReferral;
