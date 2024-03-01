import { swapAPI } from "@/libs/service";
import { useQuery } from "@tanstack/react-query";
import ChartTradingViewSwap from "../Charts/ChartTradingViewSwap";
import TransactionCollection from "../CreatedCollection/TransactionCollection";
import { SkeletonSwap } from "../Skeleton";
import HistorySwap from "../Swap/History";

const DetailERC721 = () => {
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["swap123"],
    queryFn: async () => {
      const res = await swapAPI(
        "0x4200000000000000000000000000000000000023",
        "168587773",
        "0xa0fd2a9477d37ee9b5f36d0f8103db6a1b6d8da8",
        "1268626181"
      );
      return res;
    },
    keepPreviousData: true,
  });
  console.log(data);
  return (
    <div>
      {isLoading || isFetching ? (
        <SkeletonSwap />
      ) : isSuccess ? (
        <div className="min-h-[80vh]">
          <div>
            {data && (
              <div className="flex gap-x-6">
                <div className="hidden basis-1/2 lg:block">
                  <ChartTradingViewSwap dataSwap={data} />
                </div>
                <div className="w-full lg:basis-1/2">
                  <TransactionCollection />
                </div>
              </div>
            )}
          </div>
          <HistorySwap data={data} />
        </div>
      ) : (
        <SkeletonSwap />
      )}
    </div>
  );
};

export default DetailERC721;
