import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon, ZkSyncIcon } from "@/components/Icons";
import React from "react";
import TableRowSkeleton from "../../Skeleton/SkeletonTablev2";
import FormatNumber from "@/components/Common/FormatNumber";
import Link from "next/link";
interface HistorySwapProps {
    data: any,
    isLoading: boolean,
    isFetching: boolean,
    demask: any
}
const HistoryItem: React.FunctionComponent<HistorySwapProps> = ({
    data,
    isLoading,
    isFetching,
    demask
}) => {

    return (
        <>
            {isLoading || isFetching ? (
                <TableRowSkeleton length={7} col={6} />
            ) : (
                <>
                    {data &&
                        data?.data?.map((item: any, idx: number) => (
                            <tr className="text-dark2 text-base max-md:text-[12px] bg-transparent group rounded-lg border-gray-700 bg-white hover:bg-slate-100 cursor-pointer">
                                <td scope="row" className="sticky left-0 z-10 flex items-center px-1 py-2 font-medium bg-white group-hover:bg-slate-100 md:min-w-max md:px-3 whitespace-nowrap" style={{ width: "100%" }}>
                                    <div
                                        className="flex items-center justify-start transition-all "
                                    >
                                        {item.blockTime}
                                    </div>
                                </td>
                                <td className="min-w-max">
                                    <div className="flex items-center justify-end text-green">
                                        <span
                                            className={`border text-sm ${item.action === "Buy" || item.action === "Add"
                                                ? "border-green text-green"
                                                : "border-red text-red"
                                                } p-1 rounded-lg`}
                                        >
                                            {item.action}
                                        </span>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex items-center justify-end md:gap-2">
                                        <FormatNumber number={item.amountNFT} />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex items-center justify-end md:gap-2">
                                        <FormatNumber number={item.amountTokenETH} />
                                        <EtherIcon width={18} height={18} className="fill-dark2" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex items-center justify-end md:gap-2 text-secondary5">
                                        <Link href={`https://goerli.explorer.zksync.io/address/${item.sender}`} target="_blank" rel="noopener noreferrer" className="text-secondary5">
                                            {item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
                                        </Link>
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex justify-end pr-2 text-secondary5">
                                        <Link
                                            target="_blank"
                                            href={`${demask.urltxHash}${item.transactionHash}`}
                                            className="relative group"
                                        >
                                            {item.transactionHash.slice(0, 4) + "..." + item.transactionHash.slice(-4)}
                                        </Link>
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