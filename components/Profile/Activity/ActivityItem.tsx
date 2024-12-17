import FormatNumber from "@/components/Common/FormatNumber";
import { MediaCollection } from "@/components/Common/Media";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { LogoIconTable } from "@/components/Logo/Logo";
import AccountContext from "@/context/AccountContext";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import { getColorType } from "@/libs/utils/getColorType";
import Tippy from "@tippyjs/react";
import { useContext } from "react";

const ListNFT: React.FC<any> = ({ item }) => {
  return (
    <div className="grid grid-cols-3 gap-1 w-max bg-shader_400 p-1 rounded-lg max-h-32 overflow-y-auto">
      {item.map((nft: any, index: number) => (
        <div
          className="rounded-lg overflow-hidden aspect-square w-8 h-8"
          key={index}
        >
          <MediaNFT data={nft} isControls={false} zoom />
        </div>
      ))}
    </div>
  );
};
const HistoryItem = ({ item }: any) => {
  const { demask, chainId } = useContext(AccountContext);

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
        <div className="flex items-center gap-x-2 ">
          <div className="flex-shrink-0 block relative ">
            {/* <Tippy
              interactive
              render={(attrs) => (
                <div
                  className=" p-1 w-fit block rounded-md"
                  tabIndex={-1}
                  {...attrs}
                >
                  <ListNFT item={item.metadataList} />
                </div>
              )}
            > */}
            <div className="flex-shrink-0 rounded-md overflow-hidden w-8 h-8 flex items-center">
              <MediaCollection avatar={formatLinkIPFS(item?.avatar)} zoom />
            </div>
            {/* </Tippy> */}
          </div>
          <span className="line-clamp-1 truncate  max-w-[100px] block">
            {item?.collectionName}
          </span>
        </div>
        <div className="max-w-[120px] truncate">
          {item?.tokenSymbol ? (
            <>
              <span>
                {item?.metadata?.symbol}/{item?.tokenSymbol}
              </span>
            </>
          ) : (
            <span>{item?.collectionName}</span>
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
