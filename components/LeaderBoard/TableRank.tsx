import AccountContext from "@/context/AccountContext";
import { leaderBoardAPI } from "@/libs/service/leaderBoard";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { AvatarCustom } from "../Avatars";
import FormatNumber from "../Common/FormatNumber";
import {
  EtherIcon,
  LoadingIcon,
  RankGoldIcon,
  SecondRankIcon,
  ThirdRankIcon,
  UnRankIcon,
} from "../Icons";
import { Pagination } from "../Common/Pagination";

const ItemTableRank = ({ item, currentRank }: any) => {
  const { demask } = useContext(AccountContext);
  return (
    <tr
      className={`flex px-4 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_500 border-y border-shader_500 ${
        currentRank ? "bg-primary_500 bg-opacity-25" : "text-white"
      }`}
    >
      <td className="py-4 flex items-center justify-start md:w-[70%] w-[100px]">
        <div className="flex items-center justify-end gap-x-3">
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
        </div>
      </td>
      <td className="py-4 flex items-center justify-start gap-x-2 lg:w-full md:w-full w-[100px]">
        <AvatarCustom
          avatarUrl={item?.avatar}
          size={24}
          userAddress={item.userAddress!}
          className="w-6 h-6 rounded-lg"
        />
        <p>{item?.name}</p>
      </td>
      <td
        className={`py-4 flex text-primary_400 items-center justify-center lg:w-full md:w-full w-[140px]`}
      >
        <Link
          target="_blank"
          href={`${demask.urltxHash}address/${item?.userAddress}`}
        >
          {`${item?.userAddress.slice(0, 4)}...${item?.userAddress.slice(-4)}`}
        </Link>
      </td>
      <td className="py-4 flex items-center justify-end lg:w-full md:w-full w-[140px]">
        <div className="flex items-center justify-end md:gap-2">
          -
          <EtherIcon width={18} height={18} />
        </div>
      </td>
      <td className="py-4 flex items-center justify-end lg:w-full md:w-full w-[140px]">
        <div className="flex items-center justify-end md:gap-2">
          <FormatNumber number={item?.volume} />
          <EtherIcon width={18} height={18} />
        </div>
      </td>
      <td className="py-4 lg:w-full md:w-[175px] w-[200px]">
        <div className="flex items-center justify-end md:gap-2">
          <FormatNumber number={item?.volume} />
          <EtherIcon width={18} height={18} />
        </div>
      </td>
    </tr>
  );
};
const TableRank = () => {
  const [page, setPage] = useState(1);
  const { chainId, demask, account } = useContext(AccountContext);
  const { isLoading, data, isSuccess, refetch, isPreviousData, isFetching } =
    useQuery({
      queryKey: ["leaderBoardAPI", chainId, account, page],
      queryFn: async () => {
        const res = await leaderBoardAPI(chainId, page, account);
        return res;
      },
    });

  return (
    <div className=" mt-10 overflow-x-scroll overflow-y-hidden border rounded-lg bg-shader_800 text-shader_200 border-shader_500 shadow-home min-h-[500px] flex flex-col justify-between">
      <table className="flex-grow w-full text-sm text-left border-collapse">
        <thead className="uppercase bg-shader_600 text-shader_200">
          <tr className="flex px-4 py-2">
            <th className="flex justify-start md:w-[70%] w-[100px]">Place</th>
            <th className="flex justify-start lg:w-full md:w-full w-[100px]">
              Name
            </th>
            <th className="flex justify-center lg:w-full md:w-full w-[140px]">
              Address
            </th>
            <th className="flex justify-end lg:w-full md:w-full w-[140px]">
              Reward
            </th>
            <th className="flex justify-end lg:w-full md:w-full w-[140px]">
              Season Volume
            </th>
            <th className="flex justify-end lg:w-full md:w-full w-[140px] pr-2">
              Total Volume
            </th>
          </tr>
        </thead>

        <tbody className="flex flex-col h-full">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center w-full h-full">
              <LoadingIcon width={30} height={30} className="animate-spin" />
            </div>
          ) : (
            isSuccess &&
            data && (
              <>
                {account && (
                  <ItemTableRank item={data?.userRank} currentRank={true} />
                )}
                {data.data.map((item: any, index: number) => (
                  <React.Fragment key={index}>
                    <ItemTableRank item={item} currentRank={false} />
                  </React.Fragment>
                ))}
              </>
            )
          )}
        </tbody>
      </table>
      {isSuccess && (
        <Pagination
          data={data}
          isPreviousData={isPreviousData}
          page={page}
          setPage={setPage}
          refetch={refetch}
          totalPages={15}
          isFetching={isFetching}
        />
      )}
    </div>
  );
};
export { ItemTableRank };
export default TableRank;
