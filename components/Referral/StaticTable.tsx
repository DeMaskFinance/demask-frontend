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
  });

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-surface text-sm">
              <thead className="bg-shader_600 text-shader_200">
                <tr>
                  <th scope="col" className="px-6 py-2 ">
                    Rank
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Your Earned
                  </th>
                  <th scope="col" className="px-6 py-2 ">
                    Started Trading
                  </th>
                  <th scope="col" className="px-6 py-2 ">
                    Successful Refs
                  </th>
                  <th scope="col" className="px-6 py-2 ">
                    Total Refs
                  </th>
                </tr>
              </thead>
              <tbody className="text-white">
                <tr className="item_table">
                  <td className="px-6 py-3 whitespace-nowrap">{data?.rank}</td>
                  <td className="px-10 py-3 whitespace-nowrap">
                    <ModalNumber data={data?.totalPoints} />
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">-</td>
                  <td className="px-6 py-3 whitespace-nowrap">-</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {data?.countRef}
                  </td>
                </tr>
                <tr className="item_table  text-green">
                  <td className="px-6 py-3 whitespace-nowrap">+0</td>
                  <td className="px-10 py-3 whitespace-nowrap">+0</td>
                  <td className="px-6 py-3 whitespace-nowrap">+0</td>
                  <td className="px-6 py-3 whitespace-nowrap">+0</td>
                  <td className="px-6 py-3 whitespace-nowrap">+0</td>
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
