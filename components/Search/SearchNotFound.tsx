import React from "react";
import { SearchIcon } from "../Icons";

const SearchNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow h-full text-sm font-semibold text-shader_200">
      <div className="flex items-center justify-center w-10 h-10 mb-1 border rounded-lg border-primary_500 bg-primary_500 bg-opacity-20">
        <SearchIcon width={20} height={20} className="text-primary_400" />
      </div>
      <p>Oops, We couldn’t find anything.</p>
    </div>
  );
};

export default SearchNotFound;
