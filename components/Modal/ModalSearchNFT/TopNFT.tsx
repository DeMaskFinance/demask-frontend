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
    <div className="">
      {topNftData && topNftData.nftDataList.length > 0 ? (
        <div>
          <span className="ml-2 text-sm font-semibold text-primary_400">
            Top NFT
          </span>
          <div className="block mb-2 max-h-[300px] ">
            {topNftData.nftDataList.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => handleSelectNFT(item)}
                className="flex-1 p-3 cursor-pointer border-y border-shader_600 hover:bg-shader_500"
              >
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
                      <span className="block font-normal text-shader_200">
                        {item.dmlAddress?.slice(0, 4)}...
                        {item.dmlAddress?.slice(-8)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {topNftFetching ? (
            <div className="bg-slate-700  animate-pulse h-[24px] w-full rounded-lg"></div>
          ) : (
            <span className="text-base text-primary_400"></span>
          )}
        </>
      )}
    </div>
  );
};

export default TopNFT;
