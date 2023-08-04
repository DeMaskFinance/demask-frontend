import { categoryAPI } from "@/libs/service/categoriesChartService";
import { getCookie, setCookie } from "@/libs/utils/cookieUtils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { AvatarUser } from "../Avatars";
import { SearchIcon } from "../Icons";

interface SearchProps {
  isFocused: any;
  handleFocus: any;
}

const Search: FunctionComponent<SearchProps> = ({ isFocused, handleFocus }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLParagraphElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const getHistory = getCookie("searchHistory");
  const searchsHistory = getHistory ? JSON.parse(getHistory) : [];
  const [searchHistory, setSearchHistory] = useState<any[]>(searchsHistory);

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["categories", searchTerm],
    queryFn: async () => {
      if (searchTerm.includes("/")) {
        const [param1, param2] = searchTerm.split(":");
        const id = param1.includes("x") ? param2 : param1;
        const nftAddress = param1.includes("x") ? param1 : param2;
        const res = await categoryAPI(
          `/search?nftAddress=${nftAddress}&id=${id}`
        );
        return res;
      } else {
        const res = await categoryAPI(`/search?search=${searchTerm}`);
        return res;
      }
    },
  });
  const [active, setActive] = useState(false);
  const [click, setClick] = useState(false);

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
      <li className="list-none">
        <div className="relative">
          <div
            ref={inputRef}
            className={`flex ${isFocused} text-secondary5  rounded-lg`}
          >
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search name / liquidity pairs / crypto collectibles : id"
              onClick={() => {
                setClick(true);
              }}
              className={`border hide-clear rounded-lg relative pr-1 placeholder:text-dark2 transition-all ${
                active
                  ? "lg:w-72 w-full h-[32px]  border-secondary5 pl-10"
                  : "w-[32px] h-[32px] placeholder:text-transparent bg-transparent transition-all"
              } outline-none text-sm  text-dark2`}
              onFocus={handleActive}
            />
            <div onClick={handleActive}>
              <SearchIcon
                width={32}
                height={32}
                className={`${
                  active ? "" : ""
                } cursor-pointer absolute top-0 right-0 left-0 bottom-0`}
              />
            </div>
          </div>

          <ul
            className={`border max-h-72 overflow-y-auto ${
              click ? "block" : "hidden"
            }  bg-white lg:w-72 w-full rounded-lg mt-1  p-4 absolute top-8 right-0 left-0`}
          >
            <div className={`${searchTerm === "" ? "block" : "hidden"}`}>
              <p className="mb-2 block">
                <span className="text-base">Searched</span>
                {isMounted && (
                  <span className="text-sm text-dark2">
                    ({searchHistory.length})
                  </span>
                )}
              </p>
              <div>
                {searchHistory.map((item: any, index: number) => (
                  <>
                    {isMounted && (
                      <div
                        key={index}
                        className={`flex justify-between items-center`}
                      >
                        <div
                          onClick={() => handleResultItemClick(item)}
                          className="flex items-center justify-between w-full gap-2 p-1 rounded-lg cursor-pointer hover:bg-secondary5 hover:text-white"
                        >
                          <h2 className="flex items-center gap-2">
                            <div className="w-[24px] mr-2 flex-shrink-0 h-[24px] overflow-hidden rounded-lg">
                              <AvatarUser width={32} height={32} />
                            </div>
                            <div className="flex flex-col items-baseline">
                              <span className="block text-sm font-semibold">
                                <span className="line-clamp-1">
                                  {item.metadata.name}
                                </span>
                              </span>
                              <span className="flex text-xs item-center">
                                <span className="block pb-2 mr-1 font-semibold">
                                  {item.dmlAddress.slice(0, 8)}...
                                  {item.dmlAddress.slice(-8)}
                                </span>
                              </span>
                            </div>
                          </h2>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click from reaching document
                            handleRemoveItem(index);
                          }}
                          className="text-dark2 h-fit p-1 rounded-lg hover:bg-red hover:text-white"
                        >
                          <AiOutlineClose />
                        </button>
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
            <div className={`${searchTerm !== "" ? "block" : "hidden"}`}>
              <p className="pb-2 text-base">Collections</p>
              {data && data.length > 0 ? (
                <>
                  <div className="flex text-xs item-center">
                    <span className="block pb-2 mr-1 font-semibold">
                      {data.length}
                    </span>{" "}
                    items
                  </div>
                  <div className="flex flex-col gap-4">
                    {data.map((item: any, index: number) => (
                      <>
                        <Link
                          key={item?.metadata?.name}
                          onClick={() => handleResultItemClick(item)}
                          href={`swap/${item.nft}/${item.tokenId}/${item.tokenId}?dmlAddress=${item.dmlAddress}`}
                          className="flex-1"
                          //
                        >
                          <div className="flex items-center justify-between w-full gap-2 p-1 rounded-lg cursor-pointer hover:bg-secondary5 hover:text-white">
                            <h2 className="flex items-center gap-2">
                              <div className="w-[24px] mr-2 flex-shrink-0 h-[24px] overflow-hidden rounded-lg">
                                <AvatarUser width={32} height={32} />
                              </div>
                              <div className="flex flex-col items-baseline">
                                <span className="block text-sm font-semibold">
                                  <span className="line-clamp-1">
                                    {item?.metadata?.name}
                                  </span>
                                </span>
                                <span className="flex text-xs item-center">
                                  <span className="block pb-2 mr-1 font-semibold">
                                    {item.dmlAddress.slice(0, 8)}...
                                    {item.dmlAddress.slice(-8)}
                                  </span>
                                </span>
                              </div>
                            </h2>
                          </div>
                        </Link>
                      </>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {isFetching ? (
                    <div className="bg-slate-200 animate-pulse h-[24px] w-full rounded-lg"></div>
                  ) : (
                    <span className="text-base text-secondary3">No Result</span>
                  )}
                </>
              )}
            </div>
          </ul>
        </div>
      </li>
    </>
  );
};

export default Search;
