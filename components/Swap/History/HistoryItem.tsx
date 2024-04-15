import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon } from "@/components/Icons";
import Link from "next/link";
import React from "react";
import { SkeletonTable } from "@/components/Skeleton";
interface HistorySwapProps {
  data: any;
  isLoading: boolean;
  isFetching: boolean;
  demask: any;
}
const HistoryItem: React.FunctionComponent<HistorySwapProps> = ({
  data,
  isLoading,
  isFetching,
  demask,
}) => {
  return (
    <>
      {isLoading || isFetching ? (
        <SkeletonTable length={9} />
      ) : (
        <>
          {data &&
            data?.data?.map((item: any, idx: number) => (
              <tr
                key={idx}
                className="flex px-2 text-xs hover:cursor-pointer text-dark2 group hover:bg-slate-100"
              >
                <td className="py-2 flex items-center justify-start md:w-[70%] w-[100px]">
                  <div className="flex items-center justify-end text-green">
                    <span
                      className={`border text-xs bg-opacity-10 w-16 text-center ${
                        item.action === "Buy" || item.action === "Add"
                          ? "border-green text-green bg-green "
                          : "border-red text-red bg-red"
                      } p-1 rounded-lg`}
                    >
                      {item.action}
                    </span>
                  </div>
                </td>
                <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[100px]">
                  <FormatNumber number={item.amountNFT} />
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <div className="flex items-center justify-between md:gap-2">
                    <FormatNumber number={item.price} />
                    <EtherIcon width={18} height={18} className="fill-dark2" />
                  </div>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <div className="flex items-center justify-end md:gap-2">
                    <FormatNumber number={item.amountToken} />
                    <EtherIcon width={18} height={18} className="fill-dark2" />
                  </div>
                </td>
                <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                  <div className="flex items-center justify-end md:gap-2 text-secondary5">
                    <Link
                      href={`${demask.urltxHash}address/${item.sender}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary5"
                    >
                      {item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
                    </Link>
                  </div>
                </td>
                <td className="py-2 flex items-center justify-center lg:w-full md:w-full w-[140px]">
                  <div className="flex justify-end pr-2 text-secondary5">
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
                <td className="py-2 lg:w-full md:w-[175px] w-[200px]">
                  <div className="flex items-center justify-end transition-all w-[inherit]">
                    {item.blockTime}
                  </div>
                </td>
              </tr>
            ))}
        </>
      )}
    </>
  );
};

export default HistoryItem;
