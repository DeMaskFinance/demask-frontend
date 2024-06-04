import AccountContext from "@/context/AccountContext";
import { referralLeaderboardUser } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { TableRowSkeleton } from "../Skeleton";
import { AvatarCustom } from "../Avatars";
import { TablePagination } from "../Common/Pagination";
import { ItemTableRank } from "../LeaderBoard/TableRank";

const Leaderboard = () => {
  const { chainId, demask, account } = useContext(AccountContext);
  const [page, setPage] = useState(1);
  const { data, isLoading, isSuccess, isFetching, refetch, isPreviousData } =
    useQuery(["referralLeaderboard", account, page], async () => {
      const res = await referralLeaderboardUser(account, page);
      return res;
    });

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
                ) : isSuccess && data && data.data.length > 0 ? (
                  <>
                    {account && (
                      <tr className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600 bg-gradient-to-b from-[#BA8DE6] text-white to-[#7B54E8]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {data.userRank?.rank}
                        </td>
                        <td className="flex px-10 py-4 whitespace-nowrap gap-x-2">
                          <AvatarCustom
                            avatarUrl={data.userRank?.avatar}
                            size={24}
                            userAddress={data.userRank.userAddress!}
                            className="w-6 h-6 rounded-lg"
                          />
                          <p>{data.userRank?.name}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p>{`${data.userRank?.userAddress.slice(
                            0,
                            6
                          )}...${data.userRank?.userAddress.slice(-8)}`}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {data.userRank?.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {data.userRank?.referralCode}
                        </td>
                      </tr>
                    )}
                    {data.data.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.rank}
                        </td>
                        <td className="flex px-10 py-4 whitespace-nowrap gap-x-2">
                          <AvatarCustom
                            avatarUrl={item?.avatar}
                            size={24}
                            userAddress={item.userAddress!}
                            className="w-6 h-6 rounded-lg"
                          />
                          <p>{item?.name}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p>{`${item?.userAddress.slice(
                            0,
                            6
                          )}...${item?.userAddress.slice(-8)}`}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item?.referralCode}
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <p></p>
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

export default Leaderboard;
