import ChartTradingViewSwap from "../Charts/ChartTradingViewSwap";
import TransactionCollection from "../CreatedCollection/TransactionCollection";
import { SkeletonSwap } from "../Skeleton";
import HistorySwap from "../Swap/History";
interface DetailERC721Props {
  data: any;
  isSuccess: boolean;
  isLoading: boolean;
}
const DetailERC721: React.FC<DetailERC721Props> = ({
  data,
  isSuccess,
  isLoading,
}) => {
  return (
    <div>
      {isLoading ? (
        <SkeletonSwap />
      ) : isSuccess ? (
        <div className="min-h-[94vh]">
          <div>
            {data && (
              <div className="flex border-y border-shader_500">
                <div className="flex flex-col items-center flex-auto border-r border-shader_600 min-w-[160px]">
                  {data && (
                    <ChartTradingViewSwap
                      dataSwap={data}
                      typeERC="erc1155"
                      height={518}
                    />
                  )}
                  <HistorySwap data={data} typeERC="erc1155" />
                </div>
                <div className="w-full md:w-[480px] flex-shrink-0">
                  <TransactionCollection />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <SkeletonSwap />
      )}
    </div>
  );
};

export default DetailERC721;
