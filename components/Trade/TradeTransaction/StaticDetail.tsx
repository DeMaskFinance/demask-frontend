import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import TokenIcon from "@/components/Logo/TokenIcon";
interface BaseProps {
  inputNFTValue: number;
  isFetching: boolean;
}
interface StaticDetailBuyProps extends BaseProps {
  data: DataBuy | undefined;
}

interface StaticDetailSellProps extends BaseProps {
  data: DataSell | undefined;
}
const StaticDetailBuy: React.FC<StaticDetailBuyProps> = ({
  data,
  inputNFTValue,
  isFetching,
}) => {

  return (
    <div className="w-full">
      {inputNFTValue > 0 && (
        <ul className="text-sm text-shader_200">
          <li className="flex items-center justify-between mb-1">
            Send:
            <div className="flex items-center font-bold text-white gap-x-1">
              <div className="flex items-center font-bold text-white gap-x-1">
                {isFetching ? (
                  <p className="rounded-full animate-pulse bg-slate-600 w-16 h-3"></p>
                ) : (
                  <FormatNumber number={data?.maxAmount || 0} />
                )}

                <TokenIcon token={data?.paymentToken?.symbol || ""} w={16} h={16} />
              </div>
            </div>
          </li>
          <li className="flex items-center justify-between mb-1">
            Receive: NFTs
            <div className="flex items-center font-bold text-white gap-x-1">
              {inputNFTValue}
              <NFTIcon width={16} height={16} />
            </div>
          </li>
          <li className="flex items-center justify-between mb-4">
            Price:
            <div className="flex items-center font-bold text-white gap-x-1">
              {isFetching ? (
                <p className="rounded-full animate-pulse bg-slate-600 w-20 h-3"></p>
              ) : (
                <FormatNumber number={data?.price || 0} />
              )}

              <TokenIcon token={data?.paymentToken?.symbol || ""} w={16} h={16} />
            </div>
          </li>
          <li>
            <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
              <div className="">Total Pay</div>
              <div className="flex items-center px-2 py-1 text-white gap-x-1">
                {isFetching ? (
                  <p className="rounded-full animate-pulse bg-slate-600 w-16 h-3"></p>
                ) : (
                  <FormatNumber number={data?.totalPay || 0} />
                )}
                <TokenIcon token={data?.paymentToken?.symbol || ""} w={16} h={16} />
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};
const StaticDetailSell: React.FC<StaticDetailSellProps> = ({
  data,
  inputNFTValue,
  isFetching,
}) => {

  return (
    <div className="w-full">
      {inputNFTValue > 0 && (
        <ul className="text-sm text-shader_200">
          <li className="flex items-center justify-between mb-1">
            Receive: NFTs
            <div className="flex items-center font-bold text-white gap-x-1">
              {inputNFTValue}
              <NFTIcon width={16} height={16} />
            </div>
          </li>
          <li className="flex items-center justify-between mb-4">
            Price:
            <div className="flex items-center font-bold text-white gap-x-1">
              {isFetching ? (
                <p className="rounded-full animate-pulse bg-slate-600 w-20 h-3"></p>
              ) : (
                <FormatNumber number={data?.price || 0} />
              )}

              <TokenIcon token={data?.paymentToken?.symbol || ""} w={16} h={16} />
            </div>
          </li>
          <li>
            <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
              <div className="">Total Receipts</div>
              <div className="flex items-center px-2 py-1 text-white gap-x-1">
                {isFetching ? (
                  <p className="rounded-full animate-pulse bg-slate-600 w-16 h-3"></p>
                ) : (
                  <FormatNumber number={data?.totalReceipts || 0} />
                )}
                <TokenIcon token={data?.paymentToken?.symbol || ""} w={16} h={16} />
              </div>
            </div>
          </li>
        </ul>
      )}
    </div>
  );
};
export { StaticDetailBuy, StaticDetailSell };
