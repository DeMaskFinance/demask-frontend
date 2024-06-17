import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { LogoIconTable } from "@/components/Logo/Logo";
import AccountContext from "@/context/AccountContext";
import { useContext } from "react";

const HistoryItem = ({ item }: any) => {
  const { demask, chainId } = useContext(AccountContext);
  return (
    <tr className="flex text-sm lg:text-base md:text-base text-white hover:bg-slate-100 lg:px-2">
      <td className="flex justify-start items-center md:basis-1/6 w-[140px]">
        {item.action}
      </td>

      <td className="flex items-center justify-start py-2 md:basis-1/6 w-[200px]">
        <div className="w-8 h-8 mr-1 overflow-hidden rounded-lg">
          <MediaNFT data={item} isControls={false} />
        </div>
        <div className="max-w-[120px] truncate">
          {item?.tokenSymbol ? (
            <>
              <span>
                {item?.metadata?.symbol}/{item?.tokenSymbol}
              </span>
            </>
          ) : (
            <span>{item?.metadata?.symbol}</span>
          )}
        </div>
      </td>

      <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
        <LogoIconTable width={18} height={18} chainId={chainId} />
      </td>
      <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
        <FormatNumber number={item.amountNFT} />
      </td>
      <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
        <FormatNumber number={item.price} />
      </td>
      <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px] text-primary_400">
        <a
          href={`${demask.urltxHash}tx/${item.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >{`${item.transactionHash.slice(0, 5)}...${item.transactionHash.slice(
          -4
        )}`}</a>
      </td>
    </tr>
  );
};
export default HistoryItem;
