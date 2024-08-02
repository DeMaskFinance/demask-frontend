import AccountContext from "@/context/AccountContext";
import { referralLeaderboardUser } from "@/libs/service/referralService";
import { useQuery } from "@tanstack/react-query";
import { Fragment, useContext, useState } from "react";
import { AvatarCustom } from "../Avatars";
import { Pagination } from "../Common/Pagination";
import {
  LoadingIcon,
  RankGoldIcon,
  SecondRankIcon,
  ThirdRankIcon,
  UnRankIcon,
} from "../Icons";
import SearchNotFound from "../Search/SearchNotFound";

const Leaderboard = () => {
  const { chainId, demask, account } = useContext(AccountContext);
  const [page, setPage] = useState(1);
  const { data, isLoading, isSuccess, isFetching, refetch, isPlaceholderData } =
    useQuery({
      queryKey: ["referralLeaderboard", account, page],
      queryFn: async () => {
        const res = await referralLeaderboardUser(account, page);
        return res;
      },
    });

  return (
    <Fragment>
      <div className="overflow-x-scroll  flex flex-col justify-between w-full">
        <table className="w-full text-left border-collapse min-h-[550px]">
          <thead className=" bg-shader_600 text-shader_200">
            <tr className="flex px-4 py-3">
              <th className="flex justify-start md:w-full w-[100px]">Place</th>
              <th className="flex justify-start md:w-full w-[100px]">Name</th>
              <th className="flex justify-start md:w-full w-[100px]">
                Address
              </th>
              <th className="flex justify-center lg:w-full md:w-full w-[100px]">
                Referree
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px] ">
                Refferal Code
              </th>
            </tr>
          </thead>

          {account ? (
            <tbody className="flex flex-col h-full flex-auto font-semibold">
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
                    <td className="py-3 flex items-center justify-start md:w-full w-[100px] gap-x-3 ">
                      {item?.rank}
                      {item?.rank === 1 ? (
                        <RankGoldIcon width={20} height={20} />
                      ) : item?.rank === 2 ? (
                        <SecondRankIcon width={16} height={16} />
                      ) : item?.rank === 3 ? (
                        <ThirdRankIcon width={16} height={16} />
                      ) : (
                        <UnRankIcon width={16} height={16} />
                      )}
                    </td>
                    <td className="flex justify-start md:w-full w-[100px] items-center gap-x-2">
                      <AvatarCustom
                        avatarUrl={item?.avatar}
                        size={24}
                        userAddress={item.userAddress!}
                        className="w-6 h-6 rounded-lg"
                      />
                      <p>{item?.name}</p>
                    </td>
                    <td className="py-2 flex items-center justify-start  lg:w-full md:w-full w-[100px]">
                      <p>{`${item?.userAddress.slice(
                        0,
                        6
                      )}...${item?.userAddress.slice(-8)}`}</p>
                    </td>
                    <td className="flex justify-center lg:w-full md:w-full w-[140px] items-center ">
                      {item?.count}
                    </td>
                    <td className="flex justify-end lg:w-full md:w-full w-[140px] items-center ">
                      {item?.referralCode}
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
        </table>
      </div>
    </Fragment>
  );
};

export default Leaderboard;
