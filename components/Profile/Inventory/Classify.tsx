import React, { useState } from "react";
import Items from "./Items";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { SearchInventory } from "@/components/Search";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import { DownIcon, FilterIcon } from "@/components/Icons";
import Created from "./Created";
const styles = {
  itemSub:
    "flex items-center justify-between text-sm  w-[182px] px-2 py-2 my-1 transition-all duration-150 ease-in rounded-lg cursor-pointer border hover:border-secondary5 border-white hover:text-secondary5 active:text-secondary3",
};
interface ClassifyProps {
  typeERC: string;
  category: string;
  setTypeERC: any;
  setCategory: any;
}
const Classify: React.FC<ClassifyProps> = ({
  typeERC,
  category,
  setCategory,
  setTypeERC,
}) => {
  const [tab, setTab] = useQueryParam("tab", withDefault(StringParam, "items"));
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
  console.log(tab);

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
              className="w-full p-2 bg-white shadow-home"
              tabIndex={-1}
              {...attrs}
            >
              {ERCType.map((item) => (
                <li
                  className={`${styles.itemSub} gap-x-1 ${
                    item.type === typeERC && "bg-dark5"
                  }`}
                  onClick={() => setTypeERC(item.type)}
                >
                  {item.typeNumber}
                </li>
              ))}
            </div>
          )}
        >
          <div className="flex items-center p-2 rounded-lg bg-dark5 group gap-x-8">
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
            <DownIcon
              width={24}
              height={24}
              className="cursor-pointer group-hover:fill-secondary5"
            />
          </div>
        </Tippy>
        <SearchInventory />
        <Tippy
          className=""
          interactive
          hideOnClick
          placement="bottom"
          render={(attrs) => (
            <div
              className="w-full p-2 bg-white shadow-home"
              tabIndex={-1}
              {...attrs}
            >
              {subMenuCateData.map((cateItem) => (
                <li
                  className={`${styles.itemSub} ${
                    cateItem.name === category && "bg-dark5"
                  }`}
                  onClick={() => setCategory(cateItem.type)}
                >
                  {cateItem.name}
                </li>
              ))}
            </div>
          )}
        >
          <div className="p-2 rounded-lg bg-dark5 group">
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
