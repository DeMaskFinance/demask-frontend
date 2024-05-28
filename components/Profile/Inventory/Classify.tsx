import { DownIcon, FilterIcon, SearchIcon } from "@/components/Icons";
import Tippy from "@tippyjs/react/headless";
import React from "react";
import { FaAngleDown } from "react-icons/fa";
import "tippy.js/dist/tippy.css";
const styles = {
  itemSub:
    "flex items-center bg-shader_700 border-shader_700 justify-between text-sm  w-[182px] px-2 py-2 my-1 transition-all duration-150 ease-in rounded-lg cursor-pointer border hover:border-primary_400 border-white hover:text-primary_400 active:text-primary_400",
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
      <div className="flex text-sm font-normal gap-x-4 text-shader_500">
        <Tippy
          className=""
          interactive
          hideOnClick
          placement="bottom"
          render={(attrs) => (
            <div
              className="w-full p-2 bg-white rounded-lg shadow-home bg-shader_700 border-shader_700"
              tabIndex={-1}
              {...attrs}
            >
              {ERCType.map((item) => (
                <li
                  className={`item_menu w-[182px] my-1 gap-x-1 ${
                    item.type === typeERC && "bg-shader_600 area_shader_800"
                  }`}
                  onClick={() => setTypeERC(item.type)}
                >
                  {item.typeNumber}
                </li>
              ))}
            </div>
          )}
        >
          <div className="flex items-center p-2 rounded-lg bg-shader_600 group gap-x-8 bg-shader_700 border-shader_700">
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
            <FaAngleDown className="transition-all duration-150 text-shader_600 group-hover:rotate-180" />
          </div>
        </Tippy>
        <div className="relative flex-grow">
          <div className="flex h-full rounded-lg bg-shader_600 border-shader_700">
            <div className="flex items-center justify-center w-8 h-full">
              <SearchIcon width={20} height={20} className="text-white" />
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
              className="w-full p-2 bg-white rounded-lg shadow-home bg-shader_700 border-shader_700"
              tabIndex={-1}
              {...attrs}
            >
              {subMenuCateData.map((cateItem) => (
                <li
                  className={`item_menu w-[184px] my-1 ${
                    cateItem.name === category &&
                    "bg-shader_600 area_shader_800"
                  }`}
                  onClick={() => setCategory(cateItem.type)}
                >
                  {cateItem.name}
                </li>
              ))}
            </div>
          )}
        >
          <div className="p-2 rounded-lg bg-shader_600 group bg-shader_700 border-shader_700">
            <FilterIcon
              width={24}
              height={24}
              className="cursor-pointer group-hover:fill-primary_400"
            />
          </div>
        </Tippy>
      </div>
    </div>
  );
};

export default Classify;
