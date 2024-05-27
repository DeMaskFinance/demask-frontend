import MediaNFT from "@/components/Common/MediaNFT";
import AccountContext from "@/context/AccountContext";
import { NFTTopService } from "@/libs/service";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
interface TopNFTProps {
  handleSelectNFT: (item: any) => void;
}
const TopNFT: React.FC<TopNFTProps> = ({ handleSelectNFT }) => {
  const { chainId, demask } = useContext(AccountContext);
  const {
    isLoading: topNftLoading,
    data: topNftData,
    isFetching: topNftFetching,
    refetch: topNftRefetch,
    isPreviousData: isTopNftPreviousData,
  } = useQuery({
    queryKey: ["topNFT", chainId],
    queryFn: async () => {
      const res = await NFTTopService(chainId);
      return res;
    },

    keepPreviousData: true,
  });
  // console.log(topNftData);

  return (
    <div className="mt-3">
      {topNftData && topNftData.nftDataList.length > 0 ? (
        <div>
          <div className="block mb-2 max-h-[250px] overflow-y-scroll">
            <span className="title">NFTs Top</span>
            {topNftData.nftDataList.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => handleSelectNFT(item)}
                className="flex-1"
              >
                <div className="item_search">
                  <div className="flex items-center gap-x-[10px]">
                    <div className="flex-shrink-0 w-12 h-12 overflow-hidden rounded-lg">
                      <MediaNFT data={item} isControls={false} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="block text-sm font-semibold text-white">
                        <span className="line-clamp-1">
                          {item?.metadata?.name}
                        </span>
                      </span>
                      <span className="flex text-xs item-center">
                        <span className="block pb-2 mr-1 font-normal text-shader_200">
                          {item.dmlAddress?.slice(0, 4)}...
                          {item.dmlAddress?.slice(-8)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {topNftFetching ? (
            <div className="bg-slate-200 dark:bg-slate-700 animate-pulse h-[24px] w-full rounded-lg"></div>
          ) : (
            <span className="text-base text-primary_400"></span>
          )}
        </>
      )}
    </div>
  );
};

export default TopNFT;
