import { SearchIcon } from "@/components/Icons";
import SearchNotFound from "@/components/Search/SearchNotFound";
import SearchResultItem from "@/components/Search/SearchResultItem";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { checkIsERC1155Service } from "@/libs/service/checkIsERC1155";
import { searchCollectionService } from "@/libs/service/searchService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import TopCollection from "./TopCollection";

const ModalSearchCollection = () => {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  let debouncedCollection = useDebounce(searchTerm);
  const router = useRouter();
  const { chainId, demask } = useContext(AccountContext);

  const { isLoading, data, isFetching, isSuccess } = useQuery({
    queryKey: ["checkNFT", debouncedCollection, chainId],
    queryFn: async () => {
      const res = await checkIsERC1155Service(
        debouncedCollection.toLowerCase(),
        chainId
      );
      return res;
    },
  });
  const {
    isLoading: isLoadingNFT,
    data: dataNFT,
    isFetching: isFetchingNFT,
    isSuccess: isSuccessNFT,
  } = useQuery({
    queryKey: ["searchCollection", debouncedCollection, chainId],
    queryFn: async () => {
      const res = await searchCollectionService(
        chainId,
        debouncedCollection.toLowerCase()
      );
      return res;
    },
  });
  const { currency } = router.query;
  const { slug } = router.query;
  let newURL = "";
  const handleChangeRouteNFT = () => {
    if (currency) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(currency[0], debouncedCollection)
        .replace(currency[2], idNFT);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(slug[0], debouncedCollection)
        .replace(slug[2], idNFT);
      router.push(newURL);
    }
    setNftAddress("");
    setIdNFT("");
    router.push(newURL);
  };
  {
    /* <div className="flex items-center justify-between">
        <p className="py-2 mb-4 title">Select a Collection</p>
      </div>
      <div>
        <div className="relative mb-4">
          <input
            className="input_item"
            placeholder="Search address or paste address"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
          />
          {isLoading && (
            <div className="absolute top-[50%] right-2 -translate-y-1/2">
              <BiLoaderAlt className="animate-spin text-primary_400" />
            </div>
          )}
        </div>
        <ul className={`${debouncedCollection ? "hidden" : "block"}`}>
          <li
            className="flex items-center font-semibold text-white cursor-pointer gap-x-2 group "
            onClick={() => setNftAddress(demask.CREATOR)}
          >
            <span>
              <Image
                src="/logoDefault.png"
                alt="logo"
                width={24}
                height={24}
                className="object-cover w-6 h-auto"
              />
            </span>
            <span>DEMASK CREATOR</span>
          </li>
        </ul>
        <div className={`${debouncedCollection ? "hidden" : "block"} `}>
          <div>
            <TopCollection />
          </div>
        </div>
        {data?.status === true && debouncedCollection && (
          <input
            className="input_item"
            placeholder="Address id or paste id"
            value={idNFT}
            onChange={(e) => setIdNFT(e.target.value)}
          />
        )}
        {data?.status === false && debouncedCollection && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalPayment">
            Your NFT address must be an ERC1155
          </p>
        )}
      </div> */
  }
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

export default memo(ModalSearchCollection);
