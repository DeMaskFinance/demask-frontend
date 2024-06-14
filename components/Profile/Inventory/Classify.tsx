import { Button } from "@/components/Buttons";
import { DownIcon, FilterIcon, SearchIcon } from "@/components/Icons";
import Tippy from "@tippyjs/react/headless";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import "tippy.js/dist/tippy.css";

interface ClassifyProps {
  setSearchCollection: React.Dispatch<React.SetStateAction<string>>;
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  isFilter: boolean;
}
const Classify: React.FC<ClassifyProps> = ({
  setSearchCollection,
  setIsFilter,
  isFilter,
}) => {
  const optionPrice = [
    {
      type: "dec",
      typeNumber: "Low to High",
    },
    {
      type: "low",
      typeNumber: "High to Low",
    },
  ];
  const subMenuCateData = [
    { name: "All", type: "" },
    { name: "Art", type: "Art" },
    { name: "Film", type: "Film" },
    { name: "Music", type: "Music" },
    { name: "Gaming", type: "Gaming" },
    { name: "Memberships", type: "Memberships" },
    { name: "Others", type: "Others" },
  ];

  return (
    <div>
      <div className="flex text-sm font-normal gap-x-4 text-shader_500">
        <Button
          primary
          className={`w-10 bg-opacity-15 ${isFilter && "bg-opacity-100"}`}
          onClick={() => setIsFilter(!isFilter)}
        >
          <FilterIcon
            width={24}
            height={24}
            className="cursor-pointer group-hover:fill-primary_400"
          />
        </Button>
        <Tippy
          className=""
          interactive
          hideOnClick
          placement="bottom"
          render={(attrs) => (
            <div
              className="w-full p-2  rounded-lg shadow-home bg-shader_700 border-shader_700"
              tabIndex={-1}
              {...attrs}
            >
              {optionPrice.map((item, index) => (
                <li
                  key={index}
                  // className={`item_menu w-[160px] my-1 gap-x-1 text-shader_200 ${
                  //   item.type === typeERC && "bg-shader_600 "
                  // }`}
                  className={`item_menu w-[160px] my-1 gap-x-1 text-shader_200 `}
                  // onClick={() => setTypeERC(item.type)}
                >
                  {item.typeNumber}
                </li>
              ))}
            </div>
          )}
        >
          <div>
            <div className="flex items-center p-2 h-10 input_item group gap-x-4 text-shader_200 font-semibold">
              <p className="hidden lg:block">Price: Low to High</p>
              <FaAngleDown className=" transition-all duration-150 group-hover:rotate-180" />
            </div>
          </div>
        </Tippy>
        <div className="relative flex-grow">
          <div className="flex h-full rounded-lg bg-shader_600 border-shader_700 px-3">
            <div className="flex items-center justify-center  h-full mr-2">
              <SearchIcon width={20} height={20} className="text-white" />
            </div>
            <input
              type="text"
              placeholder="Search by name"
              onChange={(e) => {
                setSearchCollection(e.target.value);
              }}
              className="relative w-full text-white transition-all bg-transparent outline-none placeholder:text-shader_300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classify;
