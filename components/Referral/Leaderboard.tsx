import AccountContext from "@/context/AccountContext";
import { referralLeaderboardUser } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { TableRowSkeleton } from "../Skeleton";

const Leaderboard = () => {
  const { chainId, demask, account } = useContext(AccountContext);
  const [page, setPage] = useState(1);
  const { data, isLoading, isSuccess, isFetching, refetch, isPreviousData } =
    useQuery({
      queryKey: ["referralLeaderboard", chainId, account],
      queryFn: async () => {
        const res = await referralLeaderboardUser(account, page);
        return res.data;
      },
      enabled: !!account,
    });
  console.log(data);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-surface dark:text-white">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-4 w-14">
                    Place
                  </th>
                  <th scope="col" className="px-10 py-4">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Referree
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Refferal Code
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <TableRowSkeleton length={9} col={4} />
                ) : (
                  isSuccess &&
                  data &&
                  data.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.rank}
                      </td>
                      <td className="px-10 py-4 whitespace-nowrap">DangVu</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p>{`${item?.userAddress.slice(
                          0,
                          6
                        )}...${item?.userAddress.slice(-8)}`}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.referralCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item?.referralCode}
                      </td>
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

export default Leaderboard;
