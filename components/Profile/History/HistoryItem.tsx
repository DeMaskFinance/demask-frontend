import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { LogoIconTable } from "@/components/Logo/Logo";
import AccountContext from "@/context/AccountContext";
import { getColorType } from "@/libs/utils/getColorType";
import { useContext } from "react";

const HistoryItem = ({ item }: any) => {
  const { demask, chainId } = useContext(AccountContext);
  console.log(item);

  return (
    <tr className="flex px-2 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_700 border-y border-shader_500">
      <td className="py-2 flex items-center justify-start  md:basis-1/7 w-[140px]">
        <div className="flex items-center justify-end ">
          <span
            className={`bg-opacity-[0.15] w-[73px] text-center ${getColorType(
              item.action
            )} py-1 rounded-lg`}
          >
            {item.action}
          </span>
        </div>
      </td>

      <td className="flex items-center justify-start py-2 md:basis-1/7 w-[200px] gap-x-2">
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

      <td className="flex items-center justify-start py-2 md:basis-1/7 w-[140px]">
        <LogoIconTable width={18} height={18} chainId={chainId} />
      </td>
      <td className="flex items-center justify-start py-2 md:basis-1/7 w-[140px]">
        <FormatNumber number={item.amountNFT} />
      </td>
      <td className="flex items-center justify-start py-2 md:basis-1/7 w-[140px]">
        <FormatNumber number={item.price} />
      </td>
      <td className="flex items-center justify-start py-2 md:basis-1/7 w-[140px] text-primary_400">
        <a
          href={`${demask.urltxHash}tx/${item.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >{`${item.transactionHash.slice(0, 8)}...${item.transactionHash.slice(
          -5
        )}`}</a>
      </td>
      <td className="flex items-center justify-end py-2 md:basis-1/7 w-[140px]">
        2 days ago
      </td>
    </tr>
  );
};
export default HistoryItem;
