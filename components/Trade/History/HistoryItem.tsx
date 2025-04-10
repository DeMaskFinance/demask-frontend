import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, LoadingIcon } from "@/components/Icons";
import Link from "next/link";
import React from "react";
import { SkeletonTable } from "@/components/Skeleton";
import SearchNotFound from "@/components/Search/SearchNotFound";
import { getColorType } from "@/libs/utils/getColorType";
import TokenIcon from "@/components/Logo/TokenIcon";
interface HistorySwapProps {
  data: any;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  demask: any;
}

const HistoryItem: React.FunctionComponent<HistorySwapProps> = ({
  data,
  isLoading,
  isFetching,
  isSuccess,
  demask,
}) => {

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center w-full h-full">
          <LoadingIcon width={30} height={30} className="animate-spin" />
        </div>
      ) : (
        <>
          {isSuccess && data && data.totalRecords > 0 ? (
            data.data.map((item: any, idx: number) => (
              <tr
                key={idx}
                className="flex px-2 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_700 border-y border-shader_500"
              >
                <td className="py-4 flex items-center justify-start md:w-[70%] w-[100px]">
                  <div className="flex items-center justify-end ">
                    <span
                      className={`bg-opacity-[0.15] w-[73px] text-center ml-3 ${getColorType(
                        item.action
                      )} py-1 rounded-lg`}
                    >
                      {item.action}
                    </span>
                  </div>
                </td>
                <td className="py-4 flex items-center justify-center lg:w-full md:w-full w-[100px]">
                  <FormatNumber number={item.amountNFT} />
                </td>
                <td className="py-4 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <div className="flex items-center justify-between md:gap-1">
                    <FormatNumber number={item.txPrice} />
                    <TokenIcon token={item?.paymentToken?.symbol} w={18} h={18} />
                  </div>
                </td>
                <td className="py-4 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <div className="flex items-center justify-end md:gap-1">
                    <FormatNumber number={item.amountToken} />
                    <TokenIcon token={item?.paymentToken?.symbol} w={18} h={18} />
                  </div>
                </td>
                <td className="py-4 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                  <div className="flex items-center justify-end md:gap-2 text-primary_400">
                    <Link
                      href={`${demask.urltxHash}address/${item.sender}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary_400"
                    >
                      {item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
                    </Link>
                  </div>
                </td>
                <td className="py-4 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                  <div className="flex justify-end pr-2 text-primary_400">
                    <Link
                      target="_blank"
                      href={`${demask.urltxHash}tx/${item.transactionHash}`}
                      className="relative group"
                    >
                      {item.transactionHash.slice(0, 4) +
                        "..." +
                        item.transactionHash.slice(-4)}
                    </Link>
                  </div>
                </td>
                <td className="py-4 lg:w-full md:w-[175px] w-[200px]">
                  <div className="flex items-center justify-end transition-all w-[inherit]">
                    {item.blockTime}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <div className="h-[350px]">
              <SearchNotFound />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default HistoryItem;
