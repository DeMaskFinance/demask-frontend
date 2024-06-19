import MediaNFT from "@/components/Common/MediaNFT";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import TopNFT from "./TopNFT";
import { SearchIcon } from "@/components/Icons";
import SearchNotFound from "@/components/Search/SearchNotFound";

const ModalAddressNFT = () => {
  const [searchTerm, setSearchTerm] = useState("");
  let debouncedSearchNFT = useDebounce(searchTerm);
  const router = useRouter();
  const { chainId, demask } = useContext(AccountContext);

  const {
    isLoading: searchLoading,
    isSuccess,
    data: searchData,
    isFetching: searchFetching,
    refetch: searchRefetch,
    isPreviousData: isSearchPreviousData,
  } = useQuery({
    queryKey: ["categories", debouncedSearchNFT, chainId],
    queryFn: async () => {
      if (debouncedSearchNFT.includes("/")) {
        const [param1, param2] = debouncedSearchNFT.split(":");
        const id = param1.includes("x") ? param2 : param1;
        const nftAddress = param1.includes("x") ? param1 : param2;
        const res = await categoryAPI(
          `search?chainId=${chainId}&nftAddress=${nftAddress}&id=${id}`
        );
        return res;
      } else {
        const res = await categoryAPI(
          `search?chainId=${chainId}&search=${debouncedSearchNFT}`
        );
        return res;
      }
    },
  });

  const handleSelectNFT = (item: any) => {
    item.type === "erc1155"
      ? router.replace(
          `/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftID}`
        )
      : router.replace(`/collection/${item.nftAddress}?typeERC=erc721`);
    document.body.style.overflowY = "auto";
  };

  return (
    <div className="h-fit w-[360px] md:w-[400px] lg:w-[500px] rounded-lg relative min-h-[45vh] flex flex-col">
      <div className="p-4 border-b border-shader_600">
        <div className="flex items-center justify-between mb-3">
          <p className=" title">Select a NFT</p>
        </div>
        <div className="relative">
          <SearchIcon
            width={20}
            height={20}
            className="absolute text-white -translate-y-1/2 top-1/2 left-2"
          />
          <input
            className="pl-8 input_item"
            placeholder="Search NFTs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchLoading && (
            <div className="absolute top-[50%] right-2 -translate-y-[50%]">
              <BiLoaderAlt className="animate-spin text-primary_400" />
            </div>
          )}
        </div>
      </div>
      <>
        {searchTerm ? (
          isSuccess && searchData.length > 0 ? (
            <div className="overflow-y-auto max-h-[300px]">
              {searchData.map((item: any, index: number) => (
                <div key={index}>
                  <div
                    className="flex items-center p-3 cursor-pointer hover:bg-shader_500 group gap-x-2 border-y border-shader_600"
                    onClick={() => handleSelectNFT(item)}
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
                            <span className="block font-normal text-shader_200">
                              {item.dmlAddress?.slice(0, 4)}...
                              {item.dmlAddress?.slice(-8)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {searchFetching ? (
                <div className="px-3">
                  <div className="bg-slate-700 animate-pulse h-[24px] w-full rounded-lg"></div>
                </div>
              ) : (
                <SearchNotFound />
              )}
            </>
          )
        ) : (
          <div className="overflow-y-scroll">
            <TopNFT handleSelectNFT={handleSelectNFT} />
          </div>
        )}
      </>
    </div>
  );
};

export default memo(ModalAddressNFT);
