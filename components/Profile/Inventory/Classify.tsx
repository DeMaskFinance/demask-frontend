import { DownIcon, FilterIcon, SearchIcon } from "@/components/Icons";
import Tippy from "@tippyjs/react/headless";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import "tippy.js/dist/tippy.css";
const styles = {
  itemSub:
    "flex items-center area_input justify-between text-sm  w-[182px] px-2 py-2 my-1 transition-all duration-150 ease-in rounded-lg cursor-pointer border hover:border-secondary5 border-white hover:text-secondary5 active:text-secondary3",
};
interface ClassifyProps {
  typeERC: string;
  category: string;
  setTypeERC: any;
  setCategory: any;
  setSearchCollection: any;
}
const Classify: React.FC<ClassifyProps> = ({
  typeERC,
  category,
  setCategory,
  setTypeERC,
  setSearchCollection,
}) => {
  const ERCType = [
    {
      type: "",
      typeNumber: "All",
    },
    {
      type: "erc1155",
      typeNumber: "ERC - 1155",
    },
    {
      type: "erc721",
      typeNumber: "ERC - 721",
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
      <div className="flex text-sm font-normal gap-x-4 text-dark3">
        <Tippy
          className=""
          interactive
          hideOnClick
          placement="bottom"
          render={(attrs) => (
            <div
              className="w-full p-2 bg-white rounded-lg shadow-home area_input"
              tabIndex={-1}
              {...attrs}
            >
              {ERCType.map((item) => (
                <li
                  className={`item_menu w-[182px] my-1 gap-x-1 ${
                    item.type === typeERC && "bg-dark5 area_darkBG1"
                  }`}
                  onClick={() => setTypeERC(item.type)}
                >
                  {item.typeNumber}
                </li>
              ))}
            </div>
          )}
        >
          <div className="flex items-center p-2 rounded-lg bg-dark5 group gap-x-8 area_input">
            <p className="hidden lg:block">
              Token type:{" "}
              {`${
                typeERC === ""
                  ? "All"
                  : typeERC === "erc721"
                  ? "ERC - 721"
                  : "ERC - 1155"
              }`}
            </p>
            <FaAngleDown className="transition-all duration-150 text-dark2 group-hover:rotate-180" />
          </div>
        </Tippy>
        <div className="relative flex-grow">
          <div className="flex h-full rounded-lg bg-dark5 area_input">
            <div className="flex items-center justify-center w-8 h-full">
              <SearchIcon width={16} height={16} className="" />
            </div>
            <input
              type="text"
              placeholder="Search by name"
              onChange={(e) => {
                setSearchCollection(e.target.value);
              }}
              className="relative w-full transition-all bg-transparent outline-none placeholder:text-xs"
            />
          </div>
        </div>
        <Tippy
          className=""
          interactive
          hideOnClick
          placement="bottom"
          render={(attrs) => (
            <div
              className="w-full p-2 bg-white rounded-lg shadow-home area_input"
              tabIndex={-1}
              {...attrs}
            >
              {subMenuCateData.map((cateItem) => (
                <li
                  className={`item_menu w-[184px] my-1 ${
                    cateItem.name === category && "bg-dark5 area_darkBG1"
                  }`}
                  onClick={() => setCategory(cateItem.type)}
                >
                  {cateItem.name}
                </li>
              ))}
            </div>
          )}
        >
          <div className="p-2 rounded-lg bg-dark5 group area_input">
            <FilterIcon
              width={24}
              height={24}
              className="cursor-pointer group-hover:fill-secondary5"
            />
          </div>
        </Tippy>
      </div>
    </div>
  );
};

export default Classify;
