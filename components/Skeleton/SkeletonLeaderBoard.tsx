import { CardListLoading } from "../LeaderBoard/CardList";
const SkeletonLeaderBoard = () => {
  return (
    <div>
      <div className="max-w-[400px] lg:max-w-[800px] mx-auto flex gap-x-4">
        <div className="mt-6 basis-1/3">
          <CardListLoading />
        </div>
        <div className="basis-1/3">
          <CardListLoading />
        </div>
        <div className="mt-10 basis-1/3">
          <CardListLoading />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLeaderBoard;
