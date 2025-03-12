import CardList from "./CardList";
import SkeletonLeaderBoard from "../Skeleton/SkeletonLeaderBoard";

const Cards = ({ leaderboardData }: { leaderboardData: any }) => {
  return (
    <div>
      {!leaderboardData ? (
        <SkeletonLeaderBoard />
      ) : (
        <div className="max-w-[400px] lg:max-w-[800px] mx-auto flex gap-x-2 md:gap-x-4">
          {leaderboardData?.data ? (
            <>
              <div className="mt-6 basis-1/3">
                <CardList data={leaderboardData.data[1]} />
              </div>
              <div className="basis-1/3">
                <CardList data={leaderboardData.data[0]} />
              </div>
              <div className="mt-10 basis-1/3">
                <CardList data={leaderboardData.data[2]} />
              </div>
            </>
          ) : (
            <p>No leaderboard data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cards;
