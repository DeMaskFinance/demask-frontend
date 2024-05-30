import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { NFTTopService } from "@/libs/service";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { getCookie, setCookie } from "@/libs/utils/cookieUtils";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CgClose } from "react-icons/cg";
import MediaNFT from "../Common/MediaNFT";
import { SearchIcon } from "../Icons";
import TopNFT from "../Modal/ModalSearchNFT/TopNFT";

interface SearchProps {
  isFocused: boolean;
  handleFocus: any;
  setShowSearch?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Search: FunctionComponent<SearchProps> = ({
  isFocused,
  setShowSearch,
}) => {
  const router = useRouter();
  const inputRef = useRef<HTMLParagraphElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const getHistory = getCookie("searchHistory");
  const searchsHistory = getHistory ? JSON.parse(getHistory) : [];
  const [searchHistory, setSearchHistory] = useState<any[]>(searchsHistory);
  const { chainId } = useContext(AccountContext);
  const [domLoaded, setDomLoaded] = useState(false);
  const [click, setClick] = useState(false);
  let debouncedSearch = useDebounce(searchTerm, 1000);
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    setDomLoaded(true); //fix Hydration failed because the initial UI does not match what was rendered on the server.
  }, []);
  const {
    isLoading: searchLoading,
    data: searchData,
    isFetching: searchFetching,
    refetch: searchRefetch,
    isPreviousData: isSearchPreviousData,
  } = useQuery({
    queryKey: ["categories", debouncedSearch, chainId],
    queryFn: async () => {
      if (debouncedSearch.includes("/")) {
        const [param1, param2] = debouncedSearch.split(":");
        const id = param1.includes("x") ? param2 : param1;
        const nftAddress = param1.includes("x") ? param1 : param2;
        const res = await categoryAPI(
          `search?chainId=${chainId}&nftAddress=${nftAddress}&id=${id}`
        );
        return res;
      } else {
        const res = await categoryAPI(
          `search?chainId=${chainId}&search=${debouncedSearch}`
        );
        return res;
      }
    },
  });

  const {
    isLoading: topNftLoading,
    data: topNftData,
    isFetching: topNftFetching,
    refetch: topNftRefetch,
    isPreviousData: isTopNftPreviousData,
  } = useQuery({
    queryKey: ["topNftSearch", chainId],
    queryFn: async () => {
      const res = await NFTTopService(chainId);
      return res;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        if (click) {
          setClick(false);
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [click]);

  const handleResultItemClick = (item: any) => {
    setSearchTerm(item.metadata?.name);
    router.replace(
      `/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftID}?chain=${chainId}`
    );
    document.body.style.overflowY = "auto";
    // @ts-ignore
    setShowSearch(false);
    const existingItemIndex = searchHistory.findIndex(
      (historyItem) =>
        historyItem.metadata.name === item.metadata?.name &&
        historyItem.dmlAddress === item.dmlAddress
    );

    if (existingItemIndex === -1) {
      const newHistory = [...searchHistory, item];
      setSearchHistory(newHistory);
      setCookie("searchHistory", JSON.stringify(newHistory), { expires: 7 });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedHistory = [...searchHistory];
    updatedHistory.splice(index, 1);
    setSearchHistory(updatedHistory);
    setCookie("searchHistory", JSON.stringify(updatedHistory), { expires: 7 });
  };

  const handleActive = () => {
    searchRef.current?.focus();
    setClick(true);
  };
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const savedHistory = getCookie("searchHistory");
    const searchsHistory = savedHistory ? JSON.parse(savedHistory) : [];
    setSearchHistory(searchsHistory);
  }, []);

  return (
    <>
      <div className="relative w-full">
        <div
          ref={inputRef}
          className={`flex ${isFocused} text-primary_400  rounded-lg items-center relative `}
        >
          <input
            value={searchTerm}
            onChange={handleSearch}
            ref={searchRef}
            placeholder="Search all of Demask"
            onClick={() => {
              setClick(true);
            }}
            className={`hide-clear rounded-lg h-10 pl-8 relative duration-200 ease-linear bg-shader_600 border-shader_500 lg:border-none border p-2 placeholder:text-shader_200 transition-all  w-full outline-none text-sm  text-white`}
            onFocus={handleActive}
          />
          {debouncedSearch && click && (
            <div
              className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer"
              onClick={() => setSearchTerm("")}
            >
              <CgClose className="text-lg text-gray-500 transition-colors duration-100 ease-linear hover:text-red" />
            </div>
          )}
          <div onClick={handleActive}>
            <SearchIcon
              width={20}
              height={20}
              className={`cursor-pointer absolute top-1/2 right-0 left-2 bottom-0 hidden lg:block -translate-y-1/2 text-white`}
            />
          </div>
        </div>

        <ul
          className={`max-h-[83vh] lg:max-h-72 overflow-y-auto overflow-x-hidden z-50 bg-shader_700 border-shader_700 ${
            click ? "block" : "block lg:hidden"
          }  bg-shader_600 w-full rounded-lg mt-3 lg:mt-1 absolute top-12 right-0 left-0`}
        >
          <div className={`${debouncedSearch === "" ? "block" : "hidden"}`}>
            <p className="my-2 ml-2 text-sm font-semibold text-primary_400">
              <span className="">Top NFT</span>
              {isMounted && <span className="">({searchHistory.length})</span>}
            </p>
            {domLoaded && (
              <div>
                {searchHistory.map((item: any, index: number) => (
                  <div key={index}>
                    {isMounted && (
                      <div
                        className={`flex justify-between items-center text-shader_600 hover:bg-shader_500 rounded-lg `}
                      >
                        <div
                          key={index}
                          onClick={() => handleResultItemClick(item)}
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click from reaching document
                            handleRemoveItem(index);
                          }}
                          className="absolute right-0 p-1 rounded-lg text-shader_600 h-fit hover:text-white"
                        >
                          <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {debouncedSearch ? (
            <div className="">
              <span className="ml-2 text-sm font-semibold text-primary_400">
                Collections
              </span>
              {searchData && searchData.length > 0 ? (
                <>
                  <div className="flex text-xs item-center">
                    <span className="block pb-2 mr-1 font-semibold">
                      {searchData.length}
                    </span>{" "}
                    items
                  </div>
                  <div className="flex flex-col gap-4">
                    {searchData.map((item: any, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleResultItemClick(item)}
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
                </>
              ) : (
                <>
                  {searchFetching ? (
                    <div className="bg-slate-700  animate-pulse h-[24px] w-full rounded-lg"></div>
                  ) : (
                    <span className="text-base text-primary_400">
                      No Result
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <TopNFT handleSelectNFT={handleResultItemClick} />
          )}
        </ul>
      </div>
    </>
  );
};

export default Search;
