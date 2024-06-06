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
          {data && (
            <div className="flex min-h-[94vh] flex-col-reverse border-y md:flex-row border-shader_600">
              <div className="flex flex-col items-center flex-auto border-r border-shader_600 min-w-[160px] z-0">
                {data && (
                  <ChartTradingViewSwap
                    dataSwap={data}
                    typeERC="erc721"
                    height={518}
                  />
                )}
                <HistorySwap data={data} typeERC="erc1155" />
              </div>
              <TransactionCollection />
            </div>
          )}
        </div>
      ) : (
        <SkeletonSwap />
      )}
    </div>
  );
};

export default DetailERC721;
