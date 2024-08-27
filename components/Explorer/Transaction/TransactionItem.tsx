import { MediaCollection } from "@/components/Common/Media";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import ModalNumber from "@/components/Modal/ModalLength/ModalNumber";
import AccountContext from "@/context/AccountContext";
import { formatLinkIPFS, formatTypeChain } from "@/libs/utils/formatComon";
import { getColorType } from "@/libs/utils/getColorType";
import Tippy from "@tippyjs/react/headless";
import Link from "next/link";
import React, { useContext } from "react";
interface TransactionItemProps {
  data: any;
  isFetching: boolean;
}

const skeleton = (
  <div className="w-[100%] h-8 bg-slate-700 animate-pulse mr-2 rounded-xl" />
);
interface ListNFTProps {
  item: any;
}
const ListNFT: React.FC<ListNFTProps> = ({ item }) => {
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
const TransactionItem: React.FC<TransactionItemProps> = ({
  data,
  isFetching,
}) => {
  const { demask } = useContext(AccountContext);

  return (
    <>
      {data?.data.map((item: any, idx: number) => (
        <tr
          key={idx}
          className="flex px-4 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_500 border-y border-shader_500"
        >
          <td className="py-2 hover:text-secondary3 relative flex items-center justify-start lg:w-full md:w-full w-[200px]">
            <Link
              target="_blank"
              href={`${demask.urltxHash}tx/${item.transactionHash}`}
              className="relative group"
            >
              <div className="flex items-center gap-x-2 ">
                <div className="flex-shrink-0 block relative ">
                  <Tippy
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
                  >
                    <div className="flex-shrink-0 rounded-md overflow-hidden w-8 h-8 flex items-center">
                      <MediaCollection
                        avatar={formatLinkIPFS(item?.avatar)}
                        zoom
                      />
                    </div>
                  </Tippy>
                </div>
                <span className="line-clamp-1 truncate  max-w-[100px] block">
                  {isFetching ? skeleton : item?.collectionName}
                </span>
              </div>
            </Link>
          </td>
          <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] ">
            <span
              className={`bg-opacity-[0.15] w-[73px] text-center ml-3 ${getColorType(
                item.action
              )} py-1 rounded-lg`}
            >
              {item.action}
            </span>
          </td>
          <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] ">
            <span className="">
              {isFetching ? (
                skeleton
              ) : (
                <p>{Number(item.amountNFT).toLocaleString()}</p>
              )}
            </span>
          </td>

          <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
            <span className="">
              {isFetching ? (
                skeleton
              ) : (
                <div className="flex gap-x-1">
                  <ModalNumber data={item.amountToken} />
                  <p>
                    <EtherIcon width={18} height={18} className="fill-dark2" />
                  </p>
                </div>
              )}
            </span>
          </td>
          <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] gap-x-1">
            <p>{formatTypeChain(item.type)}</p>
          </td>
          <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
            <a
              href={`${demask.urltxHash}address/${item.sender}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary_400 hover:text-primary_500"
            >
              {isFetching
                ? skeleton
                : item.sender.slice(0, 4) + "..." + item.sender.slice(-4)}
            </a>
          </td>

          <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
            {isFetching ? skeleton : item.blockTime}
          </td>
        </tr>
      ))}
    </>
  );
};

export default TransactionItem;
