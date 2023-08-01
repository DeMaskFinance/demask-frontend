import React, { useState, useRef, useEffect } from "react";
import Icons from "@/public/icons/icon";
import Image from "next/image";
import Tippy from "@tippyjs/react/headless";
import { FunctionComponent } from "react";
import Link from "next/link";
import { SearchIcon } from "../Icons";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { AvatarUser } from "../Avatars";

interface SearchProps {
  isFocused: any;
  handleFocus: any;
}

const Search: FunctionComponent<SearchProps> = ({ isFocused, handleFocus }) => {
  const router = useRouter();
  const inputRef = useRef<HTMLParagraphElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };
  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["categories", searchTerm],
    queryFn: async () => {
      const res = await categoryAPI(`/search?search=${searchTerm}`);
      return res;
    },
  });
  const [active, setActive] = useState(false);
  

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setActive(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleActive = () => {
    setActive(true);
  };

  return (
    <>
      <li className="">
        <div className="relative">
          <div
            ref={inputRef}
            className={`flex ${isFocused} text-secondary5  rounded-lg`}
          >
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search NFT"
              className={`border rounded-lg relative placeholder:text-dark2 transition-all ${
                active
                  ? "w-64 h-[32px]  border-secondary5 pl-10"
                  : "w-[32px] h-[32px] placeholder:text-transparent bg-transparent transition-all"
              } outline-none text-sm cursor-pointer text-dark2`}
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
              searchTerm !== "" && active ? "block" : "hidden"
            }  bg-white w-64 rounded-lg mt-1  p-4 absolute top-8 right-0 left-0`}
          >
            <p className="pb-2 text-base">Collections</p>
            {data && data.length > 0 ? (
              <>
                <span className="flex text-xs item-center">
                  <span className="block pb-2 mr-1 font-semibold">
                    {data.length}
                  </span>{" "}
                  items
                </span>
                <div className="flex flex-col gap-4">
                  {data.map((item: any) => (
                    <>
                      <Link
                        href={`swap/${item.nft}/${item.tokenId}/${item.tokenId}?dmlAddress=${item.dmlAddress}`}
                      >
                        <div className="flex items-center justify-between w-full gap-2 p-1 rounded-lg cursor-pointer hover:bg-secondary5 hover:text-white">
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
          </ul>
        </div>
      </li>
    </>
  );
};

export default Search;
