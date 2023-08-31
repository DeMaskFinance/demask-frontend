import { AvatarUser } from "@/components/Avatars";
import useNetWork from "@/hooks/useNetwork";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Creators() {
  const { chainId } = useNetWork();
  const { isLoading, data, isFetching, refetch, isPreviousData } = useQuery({
    queryKey: ["creator-fl",chainId],
    queryFn: async () => {
      const res = await categoryAPI(`/v2/created-nft-list?chainId=${chainId}&page=1`);
      return res;
    },

    keepPreviousData: true,
  });
  console.log(data);

  return (
    <div className="mt-4 border rounded-lg border-dark4 max-h-[168px] ">
      <h4 className="px-2 pt-4 pb-2 text-xl font-semibold">
        Creators to follow
      </h4>

      <div className="overflow-y-auto px-2 h-[106px]">
        {isLoading ? (
          <>
            <div className="w-full h-[38px] mt-4 border rounded-lg mb-2 bg-slate-200 animate-pulse"></div>
            <div className="w-full h-[38px] border rounded-lg bg-slate-200 animate-pulse"></div>
          </>
        ) : (
          <>
            {data?.creatorDataList.map((item: any,index:number) => (
              <div key={index} className="w-full p-2 mt-2 border rounded-lg cursor-pointer hover:border-secondary4 hover:text-secondary4">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between w-full gap-2">
                    <h2 className="flex items-center">
                      <div className="w-[24px] mr-2 flex-shrink-0 h-[24px] overflow-hidden rounded-lg">
                        <AvatarUser width={24} height={24} />
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="block text-sm font-light">
                          {item.to.slice(0, 3)}...
                          {item.to.slice(-4)}
                        </span>
                      </div>

                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
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

                    <span className="text-xs font-light">
                      {item.blockTimestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Creators;
