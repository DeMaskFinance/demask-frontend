import React from "react";
import Link from "next/link";
import { MediaCollection } from "../Common/Media";
import { formatLinkIPFS } from "@/libs/utils/formatComon";

interface SearchResultItemProps {
  item: any;
  type: "collection" | "account";
  handleFocus: () => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  type,
  handleFocus,
}) => {
  const linkHref =
    type === "collection"
      ? `/collection/${item.contractAddress}`
      : `/account/${item.account}`;

  return (
    <Link
      className="flex items-center p-3 cursor-pointer hover:bg-shader_500 group gap-x-2 border-y border-shader_600"
      href={linkHref}
      onClick={handleFocus}
    >
      <div className="item_search">
        <div className="flex items-center gap-x-[10px]">
          <div className="flex-shrink-0 w-10 h-10 overflow-hidden rounded-lg">
            <MediaCollection avatar={formatLinkIPFS(item.avatar)} />
          </div>
          <div className="flex flex-col justify-center">
            <span className="block text-sm font-semibold text-white">
              <span className="line-clamp-1">{item?.name}</span>
            </span>
            {type === "collection" && (
              <span className="flex text-xs item-center">
                <span className="block font-normal text-shader_200">
                  {item?.totalSupply} items
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultItem;
