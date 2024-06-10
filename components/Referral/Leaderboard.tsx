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
      <div className="overflow-x-auto ">
        <div className=" min-w-full min-h-[500px] flex flex-col justify-between">
          <div className="overflow-hidden ">
            <table className="min-w-full text-left text-surface text-white text-sm font-semibold">
              <thead className="uppercase bg-shader_600 text-shader_200 ">
                <tr>
                  <th scope="col" className="px-6 py-3 w-14">
                    Place
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Referree
                  </th>
                  <th scope="col" className="px-6 py-3 text-end">
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
                      <tr className="item_table bg-primary_500 bg-opacity-25 hover:bg-shader_500">
                        <td className="px-6 py-2 whitespace-nowrap">
                          {data.userRank?.rank}
                        </td>
                        <td className="flex px-10 py-3 whitespace-nowrap gap-x-2">
                          <AvatarCustom
                            avatarUrl={data.userRank?.avatar}
                            size={24}
                            userAddress={data.userRank.userAddress!}
                            className="w-6 h-6 rounded-lg"
                          />
                          <p>You</p>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          <p>{`${data.userRank?.userAddress.slice(
                            0,
                            6
                          )}...${data.userRank?.userAddress.slice(-8)}`}</p>
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap">
                          {data.userRank?.count}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-end">
                          {data.userRank?.referralCode}
                        </td>
                      </tr>
                    )}
                    {data.data.map((item: any, index: number) => (
                      <tr key={index} className="item_table">
                        <td className="px-6 py-3 whitespace-nowrap">
                          {item?.rank}
                        </td>
                        <td className="flex px-10 py-3 whitespace-nowrap gap-x-2">
                          <AvatarCustom
                            avatarUrl={item?.avatar}
                            size={24}
                            userAddress={item.userAddress!}
                            className="w-6 h-6 rounded-lg"
                          />
                          <p>{item?.name}</p>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <p>{`${item?.userAddress.slice(
                            0,
                            6
                          )}...${item?.userAddress.slice(-8)}`}</p>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {item?.count}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-end">
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
