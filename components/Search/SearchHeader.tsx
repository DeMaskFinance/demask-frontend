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
import { AiOutlineClose } from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import MediaNFT from "../Common/MediaNFT";
import { SearchIcon } from "../Icons";

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
  const [active, setActive] = useState(false);
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
        if (active) {
          setActive(false);
          setClick(false);
        }
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [active]);

  const handleResultItemClick = (item: any) => {
    setSearchTerm(item.metadata.name);
    let newURL = "";
    const { slug } = router.query;
    if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(slug[0], item.nftAddress)
        .replace(slug[1], item.tokenAddress)
        .replace(slug[2], item.nftID);
      router.push(newURL);
    } else {
      router.replace(
        `/swap/${item.nftAddress}/${item.tokenAddress}/${item.nftID}?chain=${chainId}`
      );
    }
    document.body.style.overflowY = "auto";
    // setShowSearch(false);
    const existingItemIndex = searchHistory.findIndex(
      (historyItem) =>
        historyItem.metadata.name === item.metadata.name &&
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
    setActive(true);
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
          className={`flex ${isFocused} text-secondary5  rounded-lg`}
        >
          <input
            value={searchTerm}
            onChange={handleSearch}
            ref={searchRef}
            placeholder="Search all of Demask"
            onClick={() => {
              setClick(true);
            }}
            className={`hide-clear rounded-xl w-full relative duration-200 ease-linear bg-dark5 placeholder:text-dark2 transition-all ${
              active
                ? "w-full lg:h-[32px] h-[40px] lg:pl-10"
                : " lg:w-0 lg:h-[32px] h-[40px] bg-transparent"
            } outline-none text-sm  text-dark2`}
            onFocus={handleActive}
          />
          {debouncedSearch && (
            <div
              className="absolute right-2 top-[50%] -translate-y-1/2 cursor-pointer"
              onClick={() => setSearchTerm("")}
            >
              <CgClose className="text-lg text-gray-500 transition-colors duration-100 ease-linear hover:text-red" />
            </div>
          )}
          <div onClick={handleActive}>
            <SearchIcon
              width={32}
              height={32}
              className={`${
                active ? "" : ""
              } cursor-pointer absolute top-0 right-0 left-0 bottom-0 hidden lg:block`}
            />
          </div>
        </div>

        <ul
          className={`max-h-[83vh] lg:max-h-72 overflow-y-auto overflow-x-hidden z-50 area_input ${
            click ? "block" : "block lg:hidden"
          }  bg-dark5 w-full rounded-lg mt-3 lg:mt-1 py-4 lg:px-4 absolute top-8 right-0 left-0`}
        >
          <div className={`${debouncedSearch === "" ? "block" : "hidden"}`}>
            <p className="block mb-2 text-sm text-dark2">
              <span className="">Searched</span>
              {isMounted && (
                <span className="text-sm text-dark2">
                  ({searchHistory.length})
                </span>
              )}
            </p>
            {domLoaded && (
              <div>
                {searchHistory.map((item: any, index: number) => (
                  <div key={index}>
                    {isMounted && (
                      <div
                        className={`flex justify-between items-center text-dark2 hover:bg-dark4 rounded-lg area_input_hover`}
                      >
                        <div
                          onClick={() => handleResultItemClick(item)}
                          className="flex items-center justify-between w-full gap-2 p-1 rounded-lg cursor-pointer "
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-lg">
                              <MediaNFT data={item} isControls={false} />
                            </div>
                            <div className="flex flex-col items-baseline">
                              <span className="block text-sm font-semibold">
                                <span className="line-clamp-1">
                                  {item.metadata.name}
                                </span>
                              </span>
                              <span className="flex text-xs item-center">
                                <span className="block pb-2 mr-1 font-semibold">
                                  {item.dmlAddress?.slice(0, 8)}...
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
                          className="p-1 rounded-lg text-dark2 h-fit hover:text-white"
                        >
                          <CgClose className="text-xl transition-colors duration-100 ease-linear text-dark2 hover:text-red" />
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
              <p className="pb-2 text-sm font-semibold text-dark2">
                Collections
              </p>
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
                        className="flex-1"
                        //
                      >
                        <div className="flex items-center justify-between w-full gap-2 p-1 rounded-lg cursor-pointer hover:bg-dark4">
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
                                  {item.dmlAddress?.slice(0, 8)}...
                                  {item.dmlAddress?.slice(-8)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {searchFetching ? (
                    <div className="bg-slate-200 animate-pulse h-[24px] w-full rounded-lg"></div>
                  ) : (
                    <span className="text-base text-secondary3">No Result</span>
                  )}
                </>
              )}
            </div>
          ) : (
            <div>
              {topNftData && topNftData.nftDataList.length > 0 ? (
                <div>
                  {topNftData && topNftData?.nftDataList?.length > 0 ? (
                    <div>
                      <div className="block mb-2">
                        <span className="title">NFTs Top</span>
                        {topNftData.nftDataList
                          .slice(0, 4)
                          .map((item: any, index: number) => (
                            <div
                              onClick={() => handleResultItemClick(item)}
                              className="flex-1"
                              //
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
                                        {item.dmlAddress?.slice(0, 8)}...
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
          )}
        </ul>
      </div>
    </>
  );
};

export default Search;
