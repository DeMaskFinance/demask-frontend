import { Fragment } from "react";
import ChartTradingViewSwap from "../Charts/ChartTradingViewSwap";
import Maintenance from "../Common/Maintenance";
import TransactionCollection from "../Collection/TransactionCollection";
import HistorySwap from "../Trade/History";
import { LoadingIcon } from "../Icons";
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
    <div className="min-h-[94vh] text-white">
      <Maintenance />
      {isLoading && (
        <div className="flex w-full justify-center h-[80vh] items-center">
          <LoadingIcon width={64} height={64} className="animate-spin" />
        </div>
      )}
      {!isLoading && (
        <Fragment>
          {data && (
            <div className="flex  flex-col-reverse border-y md:flex-row border-shader_600">
              <div className="flex flex-col items-center flex-auto border-r border-shader_600 min-w-[160px] z-0">
                {data && (
                  <Fragment>
                    <ChartTradingViewSwap
                      dataSwap={data}
                      typeERC="erc721"
                      height={518}
                    />

                    <HistorySwap data={data} typeERC="erc1155" />
                  </Fragment>
                )}
              </div>
              <TransactionCollection />
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default DetailERC721;
