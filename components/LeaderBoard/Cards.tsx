import React, { useContext } from "react";
import CardList from "./CardList";
import { useQuery } from "@tanstack/react-query";
import { leaderBoardAPI } from "@/libs/service/leaderBoard";
import AccountContext from "@/context/AccountContext";
import SkeletonLeaderBoard from "../Skeleton/SkeletonLeaderBoard";

const Cards = () => {
  const { chainId } = useContext(AccountContext);
  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["leaderBoard", chainId],
    queryFn: async () => {
      const res = await leaderBoardAPI(chainId, 1, "");
      return res;
    },
  });
  return (
    <div>
      {isLoading ? (
        <SkeletonLeaderBoard />
      ) : isSuccess ? (
        <div className="max-w-[400px] lg:max-w-[800px] mx-auto flex gap-x-4">
          {data && data.data ? (
            <>
              <div className="mt-6 basis-1/3">
                <CardList data={data.data[1]} />
              </div>
              <div className="basis-1/3">
                <CardList data={data.data[0]} />
              </div>
              <div className="mt-10 basis-1/3">
                <CardList data={data.data[2]} />
              </div>
            </>
          ) : (
            <p>No leaderboard data available</p>
          )}
        </div>
      ) : (
        <SkeletonLeaderBoard />
      )}
    </div>
  );
};

export default Cards;
