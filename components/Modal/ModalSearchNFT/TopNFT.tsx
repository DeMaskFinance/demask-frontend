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

  return (
    <div className="mt-3">
      {topNftData && topNftData.nftDataList.length > 0 ? (
        <div>
          <div className="block mb-2 max-h-[250px] overflow-y-scroll">
            <span className="text-base font-semibold text-dark2">NFTs Top</span>
            {topNftData.nftDataList.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => handleSelectNFT(item)}
                className="flex-1"
              >
                <div className="item_search">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-lg">
                      <MediaNFT data={item} isControls={false} />
                    </div>
                    <div className="flex flex-col items-baseline">
                      <span className="block text-sm font-semibold">
                        <span className="line-clamp-1">
                          {item?.metadata?.name}
                        </span>
                      </span>
                      <span className="flex text-xs item-center">
                        <span className="block pb-2 mr-1 font-semibold">
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
            <div className="bg-slate-200 animate-pulse h-[24px] w-full rounded-lg"></div>
          ) : (
            <span className="text-base text-secondary3"></span>
          )}
        </>
      )}
    </div>
  );
};

export default TopNFT;
