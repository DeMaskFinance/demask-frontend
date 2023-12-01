import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon, ZkSyncIcon } from "@/components/Icons";
import React from "react";
import TableRowSkeleton from "../../Skeleton/SkeletonTablev2";
interface HistorySwapProps {
    data: any,
    isLoading: boolean,
    isFetching: boolean
}
const HistoryItem: React.FunctionComponent<HistorySwapProps> = ({
    data,
    isLoading,
    isFetching
}) => {

    return (
        <>
            {isLoading || isFetching ? (
                <TableRowSkeleton length={7} col={6} />
            ) : (
                <>
                    {data &&
                        data?.nftDataList?.map((item: any, idx: number) => (
                            <tr onClick={() => {
                                const newTab = window.open(`${process.env.NEXT_PUBLIC_LINK_APP}/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftID}`, '_blank', 'noopener,noreferrer');
                                if (newTab) {
                                    newTab.opener = null;
                                }
                            }} className="text-dark2 text-base max-md:text-[12px] bg-transparent group rounded-lg border-gray-700 bg-white hover:bg-slate-100 cursor-pointer">
                                <td scope="row" className="sticky left-0 z-10 flex items-center px-1 py-2 font-medium bg-white group-hover:bg-slate-100 md:min-w-max md:px-3 whitespace-nowrap" style={{ width: "100%" }}>
                                    <div
                                        className="flex items-center justify-start transition-all "
                                    >
                                        26/11 08:40:59
                                    </div>
                                </td>
                                <td className="min-w-max">
                                    <div className="flex items-center justify-end text-green">
                                        Buy
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex items-center justify-end md:gap-2">
                                        5
                                        <EtherIcon width={18} height={18} className="fill-dark2" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex items-center justify-end md:gap-2">
                                        6
                                        <EtherIcon width={18} height={18} className="fill-dark2" /></div>
                                </td>
                                <td className="">
                                    <div className="flex items-center justify-end md:gap-2">
                                        7
                                        <EtherIcon width={18} height={18} className="fill-dark2" />
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex items-center justify-end md:gap-2">
                                        a15a51
                                    </div>
                                </td>
                                <td className="">
                                    <div className="flex justify-end pr-2">
                                        bcx
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