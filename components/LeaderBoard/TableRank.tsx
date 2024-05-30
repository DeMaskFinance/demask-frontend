import AccountContext from "@/context/AccountContext";
import { leaderBoardAPI } from "@/libs/service/leaderBoard";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { MdNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { AvatarCustom } from "../Avatars";
import FormatNumber from "../Common/FormatNumber";
import { EtherIcon, RankIcon } from "../Icons";
import { SkeletonTable } from "../Skeleton/SkeletonTable";

const ItemTableRank = ({ item, currentRank }: any) => {
  const { demask } = useContext(AccountContext);
  return (
    <tr
      className={`flex px-2 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_700 border-y border-shader_500 ${
        currentRank
          ? "bg-gradient-to-b from-[#BA8DE6] text-white to-[#7B54E8]"
          : "text-white"
      }`}
    >
      <td className="py-4 flex items-center justify-start md:w-[70%] w-[100px]">
        <div className="flex items-center justify-end gap-x-1">
          {item?.rank}
          <RankIcon
            width={18}
            height={18}
            className={`${
              currentRank
                ? "fill-white"
                : `${
                    item?.rank === 1
                      ? "fill-yellow"
                      : item?.rank === 2
                      ? "fill-blue"
                      : item?.rank === 3
                      ? "fill-red"
                      : ""
                  } `
            }`}
          />
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
        className={`py-4 flex ${
          currentRank ? "text-white" : "text-primary_400"
        } items-center justify-center lg:w-full md:w-full w-[140px]`}
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
  const prevPage = () => {
    const prevPageNumber = Math.max(page - 1, 1);
    setPage(prevPageNumber);
  };

  const nextPage = () => {
    const nextPageNumber = Math.min(page + 1, data?.totalPages);
    setPage(nextPageNumber);
  };

  useEffect(() => {
    if (data === null) {
      setPage(1);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [page, refetch, account]);

  return (
    <div className=" mt-10 overflow-x-scroll overflow-y-hidden border rounded-lg bg-shader_800 text-shader_200 border-shader_500 shadow-home min-h-[500px] flex flex-col justify-between">
      <table className="w-full text-left border-collapse">
        <thead className="bg-shader_600 text-shader_200">
          <tr className="flex px-2 pb-2 text-base">
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

        <tbody className="flex flex-col">
          {isLoading || isFetching ? (
            <SkeletonTable length={9} />
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
      <div className="flex justify-center gap-4 pt-6 text-sm">
        <button
          onClick={prevPage}
          disabled={isPreviousData || page === 1 || isFetching}
          className={`${
            isPreviousData || page === 1 || isFetching
              ? "text-white bg-slate-300"
              : "hover:text-white hover:bg-primary_500 transition-all"
          } w-5 flex items-center text-center justify-center rounded-full transition-all`}
        >
          <MdNavigateBefore />
        </button>
        <p>
          Page
          <span className="px-2 font-medium text-primary_500">{page}</span> of
          <span
            className="px-2 font-medium cursor-pointer text-primary_500"
            onClick={() =>
              page !== data?.totalPages && setPage(data?.totalPages)
            }
          >
            {data?.totalPages}
          </span>
        </p>
        <button
          onClick={nextPage}
          disabled={isPreviousData || page === data?.totalPages || isFetching}
          className={`${
            isPreviousData || page === data?.totalPages || isFetching
              ? "text-white bg-slate-300"
              : "hover:text-white hover:bg-primary_500 transition-all"
          } w-5 flex items-center text-center justify-center rounded-full transition-all`}
        >
          <MdOutlineNavigateNext />
        </button>
      </div>
    </div>
  );
};
export { ItemTableRank };
export default TableRank;
