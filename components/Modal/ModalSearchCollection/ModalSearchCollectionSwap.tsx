import { SearchIcon } from "@/components/Icons";
import SearchNotFound from "@/components/Search/SearchNotFound";
import SearchResultItem from "@/components/Search/SearchResultItem";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { searchCollectionService } from "@/libs/service/searchService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import TopCollection from "./TopCollection";

const ModalSearchCollectionSwap = () => {
  const [searchTerm, setSearchTerm] = useState("");
  let debouncedCollection = useDebounce(searchTerm);
  const { chainId, demask } = useContext(AccountContext);

  const { isLoading, data, isFetching, isSuccess } = useQuery({
    queryKey: ["searchCollection", debouncedCollection, chainId],
    queryFn: async () => {
      if (searchTerm) {
        const res = await searchCollectionService(
          chainId,
          debouncedCollection.toLowerCase()
        );
        return res;
      }
    },
  });

  return (
    <div className="h-fit w-[360px] md:w-[400px] lg:w-[500px] rounded-lg relative min-h-[45vh] flex flex-col">
      <div className="p-4 border-b border-shader_600">
        <div className="flex items-center justify-between mb-3">
          <p className=" title">COLLECTIONS</p>
        </div>
        <div className="relative">
          <SearchIcon
            width={20}
            height={20}
            className="absolute text-white -translate-y-1/2 top-1/2 left-2"
          />
          <input
            className="pl-8 input_item"
            placeholder="Search Collection"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoading && (
            <div className="absolute top-[50%] right-2 -translate-y-[50%]">
              <BiLoaderAlt className="animate-spin text-primary_400" />
            </div>
          )}
        </div>
      </div>
      <>
        {searchTerm ? (
          isSuccess && data.collectionList.length > 0 ? (
            <div className="overflow-y-auto max-h-[300px]">
              {data.collectionList.map((item: any, index: number) => (
                <SearchResultItem key={index} item={item} type="collection" />
              ))}
            </div>
          ) : (
            <>
              {isFetching ? (
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
            <TopCollection />
          </div>
        )}
      </>
    </div>
  );
};

export default memo(ModalSearchCollectionSwap);
