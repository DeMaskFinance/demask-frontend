import AccountContext from "@/context/AccountContext";
import { referralStaticUser } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import ModalNumber from "../Modal/ModalLength/ModalNumber";

const StaticTable = () => {
  const { chainId, demask, account } = useContext(AccountContext);
  const { data, isLoading } = useQuery({
    queryKey: ["staticReferral", chainId, account],
    queryFn: async () => {
      const res = await referralStaticUser(account, chainId);
      return res.data;
    },
    enabled: !!account,
  });
  console.log(data);

  return (
    <div className="flex flex-col p-4 border rounded-lg border-dark4 area_input">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-surface dark:text-white">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-4 ">
                    Rank
                  </th>
                  <th scope="col" className="px-10 py-4">
                    Your Earned
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Started Trading
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Successful Refs
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Total Refs
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600">
                  <td className="px-6 py-4 whitespace-nowrap">{data?.rank}</td>
                  <td className="px-10 py-4 whitespace-nowrap">
                    <ModalNumber data={data?.totalPoints} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">-</td>
                  <td className="px-6 py-4 whitespace-nowrap">-</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {data?.countRef}
                  </td>
                </tr>
                <tr className="text-sm transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600 text-green">
                  <td className="px-6 py-4 whitespace-nowrap">+0</td>
                  <td className="px-10 py-4 whitespace-nowrap">+0</td>
                  <td className="px-6 py-4 whitespace-nowrap">+0</td>
                  <td className="px-6 py-4 whitespace-nowrap">+0</td>
                  <td className="px-6 py-4 whitespace-nowrap">+0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticTable;
