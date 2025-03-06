import { Button } from "@/components/Buttons";
import { FilterIcon, SearchIcon } from "@/components/Icons";
import Tippy from "@tippyjs/react/headless";
import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { FaAngleDown } from "react-icons/fa";
import "tippy.js/dist/tippy.css";

interface ClassifyProps {
  setSearchCollection: React.Dispatch<React.SetStateAction<string>>;
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
  isFilter: boolean;
  setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;

}
const Classify: React.FC<ClassifyProps> = ({
  setSearchCollection,
  setIsFilter,
  isFilter,
  setSortOrder

}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [selectedPrice, setSelectedPrice] = useState("High to Low");
  const [visible, setVisible] = useState(false);

  const optionPrice = [
    {
      type: "desc",
      typeNumber: "High to Low",
    },
    {
      type: "asc",
      typeNumber: "Low to High",
    },
  ];

  return (
    <div className="flex text-sm font-normal gap-x-4 text-shader_500">
      <div
        className={`flex gap-x-4 flex-1 md:flex-grow-0`}
      >
        <Button
          primary
          className={`bg-opacity-15 ${isFilter && "bg-opacity-100"}`}
          onClick={() => setIsFilter(!isFilter)}
        >
          <div className="w-10">
            <FilterIcon
              width={24}
              height={24}
              className="cursor-pointer group-hover:fill-primary_400 mx-auto"
            />
          </div>
        </Button>
        <Tippy
          interactive
          trigger="click"
          visible={visible}
          onClickOutside={() => setVisible(false)}
          placement="bottom"
          render={(attrs) => (
            <div
              className="w-full p-2 rounded-lg shadow-home bg-shader_700 border-shader_700"
              tabIndex={-1}
              {...attrs}
            >
              {optionPrice.map((item: any, index) => (
                item.typeNumber !== selectedPrice && (
                  <li
                    key={index}
                    className={`item_menu w-[160px] my-1 gap-x-1 text-shader_200 cursor-pointer`}
                    onClick={() => {
                      setSelectedPrice(item.typeNumber);
                      setSortOrder(item.type);
                      setVisible(false);
                    }}
                  >
                    {item.typeNumber}
                  </li>
                )
              ))}
            </div>
          )}
        >
          <div
            className="flex items-center p-2 h-10 input_item group gap-x-4 text-shader_200 font-semibold whitespace-nowrap w-full justify-between cursor-pointer"
            onClick={() => setVisible(!visible)}
          >
            <p>{selectedPrice}</p>
            <FaAngleDown className="transition-all duration-150" />
          </div>
        </Tippy>
      </div>
      <div
        className={`relative md:flex-1 md:w-full h-10 w-full`}
        onClick={() => setIsFocused(true)}
      >
        <div className="flex h-full rounded-lg bg-shader_600 border-shader_700 px-3  w-full items-center">
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
          <CgClose
            className="w-5 h-5 text-white md:hidden"
            onClick={(e) => {
              e.stopPropagation();
              setIsFocused(false);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Classify;
