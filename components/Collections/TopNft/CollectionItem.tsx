import { AvatarCustom } from "@/components/Avatars";
import FormatNumber from "@/components/Common/FormatNumber";
import { MediaCollection } from "@/components/Common/Media";
import { EtherIcon, LoadingIcon } from "@/components/Icons";
import ModalNumber from "@/components/Modal/ModalLength/ModalNumber";
import AccountContext from "@/context/AccountContext";
import { formatLinkIPFS, formatPercent } from "@/libs/utils/formatComon";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
interface CollectionItemProps {
  data: any;
  isFetching: boolean;
  isLoading: boolean;
  isPreviousData: boolean;
  page: number;
  setPage: any;
  refetch: any;
}
const CollectionItem: React.FC<CollectionItemProps> = ({
  data,
  isFetching,
  isLoading,
  isPreviousData,
  page,
  setPage,
  refetch,
}) => {
  const skeleton = (
    <div className="w-full h-8 bg-slate-700 animate-pulse rounded-xl" />
  );
  const router = useRouter();
  return (
    <>
      {isLoading || isFetching ? (
        <div className="w-full h-full flex-auto justify-center items-center flex">
          <LoadingIcon width={30} height={30} className="animate-spin" />
        </div>
      ) : (
        <>
          {data &&
            data?.data?.map((item: any, idx: number) => (
              <tr
                key={idx}
                className="flex px-4 text-sm font-semibold text-white hover:cursor-pointer group hover:bg-shader_500 border-y border-shader_500"
                onClick={() => {
                  router.push(`/collection/${item.contractAddress}`);
                }}
              >
                <td className="py-2 lg:w-full md:w-full w-[200px]">
                  <div className="relative flex items-center gap-2 group">
                    <div className="flex-shrink-0 rounded-md overflow-hidden w-[32px] h-[32px] flex items-center">
                      <MediaCollection avatar={formatLinkIPFS(item?.avatar)} />
                    </div>

                    <span className="line-clamp-1 truncate  max-w-[133px] block">
                      {isFetching ? skeleton : item?.name}
                    </span>
                  </div>
                </td>
                <td className="py-2 flex items-center gap-x-1 justify-end lg:w-full md:w-full w-[140px]">
                  {isFetching ? (
                    skeleton
                  ) : (
                    <ModalNumber data={item.floorPrice} />
                  )}
                  <p>
                    <EtherIcon width={18} height={18} className="fill-dark2" />
                  </p>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  <div
                    className={`flex items-center ${
                      item.changePrice24h > 0
                        ? "text-green"
                        : item.changePrice24h === 0
                        ? "text-dark2"
                        : "text-red"
                    } `}
                  >
                    {/* {item.changePrice24h > 0 ? <BsArrowUp /> : item.changePrice24h === 0 ? <p></p> : <BsArrowDown />} */}
                    {isFetching ? (
                      skeleton
                    ) : (
                      <p>{formatPercent(item.changePrice24h)}</p>
                    )}
                    %
                  </div>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] gap-x-1">
                  {isFetching ? (
                    skeleton
                  ) : (
                    <FormatNumber number={item.volume24h} />
                  )}
                  <p>
                    <EtherIcon width={18} height={18} className="fill-dark2" />
                  </p>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px] gap-x-1">
                  {isFetching ? skeleton : <FormatNumber number={item.TVL} />}
                  <p>
                    <EtherIcon width={18} height={18} className="fill-dark2" />
                  </p>
                </td>
                <td className="py-2 flex items-center justify-end lg:w-full md:w-full w-[140px]">
                  {isFetching ? (
                    skeleton
                  ) : (
                    <p>{Number(item.totalSupply).toLocaleString()}</p>
                  )}
                </td>
              </tr>
            ))}
        </>
      )}
    </>
  );
};

export default CollectionItem;
