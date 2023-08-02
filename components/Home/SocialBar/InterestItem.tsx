import { categoryAPI } from "@/libs/service/categoriesChartService";
import formatNumber from "@/libs/utils/formatNumer";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function InterestItem() {
  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
    queryKey: ["topNftHome"],
    queryFn: async () => {
      const res = await categoryAPI(`/topNFT-list?page=1`);
      return res;
    },

    keepPreviousData: true,
  });
  return (
    <div className="px-2 border rounded-lg border-dark4 max-h-[416px] overflow-auto">
      <h4 className="px-2 pt-4 text-xl font-semibold">You may be interested</h4>

      {data?.nftDataList?.map((item: any) => (
        <Link
          href={`/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftId}?dmlAddress=${item.dml}`}
        >
          <div className="flex items-start gap-4 max-h-[105px] p-2 mt-4 overflow-hidden transition-all border rounded-lg cursor-pointer group hover:text-secondary3 hover:border-secondary3">
            <div className="w-[88px]  transition-all flex-shrink-0 h-[88px] overflow-hidden rounded-lg">
              {item.metadata?.image && (
                <Image
                  loading="lazy"
                  unoptimized
                  width={88}
                  height={88}
                  src={item.metadata?.image}
                  alt="NFT Image"
                  className="w-full h-full"
                />
              )}
              {item.metadata?.animation_url && !item.metadata?.image && (
                <video
                  src={item.metadata?.animation_url}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              {item.metadata?.image && item.metadata?.animation_url && (
                <audio
                  autoPlay
                  loop
                  muted
                  controls
                  src={item.metadata?.animation_url}
                  className=""
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              )}
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex flex-wrap justify-between w-full gap-2 pb-2">
                <h2 className="flex ">
                  <span className="text-lg font-semibold">
                    <span className="line-clamp-1 w-fit">
                      {item.metadata?.name}
                    </span>
                  </span>
                  <svg
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    className=" flex-shrink-0"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                      fill="#9075FE"
                    />
                    <path
                      d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                      fill="#9075FE"
                    />
                  </svg>
                </h2>

                {/* <Link
                className="flex items-center px-2 py-1 text-sm rounded-lg bg-dark4"
                href="/"
              >
                ART
              </Link> */}
              </div>
              <p className="text-sm line-clamp-2 group-hover:hidden transition-all">
                {item.metadata?.description}
              </p>

              <span
                className="px-4 py-1  border rounded-lg w-max translate-y-[190%]  border-secondary3 text-secondary3
             group-hover:translate-y-2 transition-all"
              >
                {formatNumber(item.lastPrice)}$
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default InterestItem;
