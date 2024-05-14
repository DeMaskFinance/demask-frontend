import AccountContext from "@/context/AccountContext";
import {
  referralHistoryUser,
  referralPointUser,
} from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { SkeletonTable } from "../Skeleton";
import { TableRowSkeleton } from "../Skeleton/SkeletonTable";

const MyReferral = () => {
  const { chainId, account } = useContext(AccountContext);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["myReferral", chainId, account],
    queryFn: async () => {
      const res = await referralPointUser(account, chainId);
      return res;
    },
  });

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
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
                      <td className="px-10 py-4 whitespace-nowrap">Mark</td>
                      <td className="px-6 py-4 whitespace-nowrap">Otto</td>
                      <td className="px-6 py-4 whitespace-nowrap">@mdo</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReferral;
