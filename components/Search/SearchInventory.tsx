import { useRef, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { SearchIcon } from "../Icons";
const SearchInventory = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchCollection, setSearchCollection] = useQueryParam(
    "searchCollection",
    withDefault(StringParam, "")
  );
  const inputRef = useRef<HTMLParagraphElement>(null);
  // useEffect(() => {
  //   function handleClickOutside(event: any) {
  //     if (inputRef.current && !inputRef.current.contains(event.target)) {
  //       if (showSearch) {
  //         setShowSearch(false);
  //       }
  //     }
  //   }
  //   document.addEventListener("click", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, [showSearch]);
  return (
    <div className="relative flex-grow">
      <div className="flex h-full rounded-lg bg-shader_600" ref={inputRef}>
        <div className="flex items-center justify-center w-8 h-full">
          <SearchIcon width={20} height={20} className="text-white" />
        </div>
        <input
          type="text"
          placeholder="Search by name"
          onChange={(e) => {
            setSearchCollection(e.target.value);
          }}
          onClick={() => {
            setShowSearch(true);
          }}
          className="relative w-full text-white transition-all bg-transparent outline-none placeholder:text-xs"
        />
      </div>
      {/* {showSearch && (
        <div className="absolute left-0 w-full bg-shader_600 top-[120%] p-4">
          <p className="font-semibold">Collections</p>
        </div>
      )} */}
    </div>
  );
};

export default SearchInventory;
