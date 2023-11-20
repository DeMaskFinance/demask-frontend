import MediaNFT from "@/components/Common/MediaNFT";
import { ZkSyncIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import formatToUnit from "@/libs/utils/formatToUnit";

const HistoryItem = ({ item }: any) => {
    console.log(item);

    return (
        <tr className="flex text-sm border-b rounded-lg lg:text-base md:text-base text-dark2 hover:bg-slate-100 lg:px-2">
            <td className="flex justify-start items-center md:basis-1/6 w-[140px]">
                {item.action}
            </td>

            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[200px]">
                <div className="w-8 h-8 mr-1">
                    <MediaNFT data={item} isControls={false} />
                </div>
                <div className="max-w-[120px] truncate">
                    {item?.tokenSymbol ? (
                        <>
                            <span>{item?.tokenSymbol}/{item?.metadata?.symbol}</span>
                        </>
                    ) : (
                        <span>{item?.metadata?.symbol}</span>
                    )}
                </div>
            </td>

            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                {item.chainId === '280' && (
                    <>
                        <span><ZkSyncIcon /></span>
                        <span className="ml-1">ZkSync</span></>
                )}
            </td>
            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                {formatToUnit(item.amountNFT)}
            </td>
            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                {formatToUnit(item.price)}
            </td>
            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                <a href={`https://goerli.explorer.zksync.io/tx/${item.transactionHash}`} target="_blank" rel="noopener noreferrer">{`${item.transactionHash.slice(0, 5)}...${item.transactionHash.slice(-4)}`}</a>
            </td>
        </tr>
    )
}
export default HistoryItem;