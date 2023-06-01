import React from "react";
interface CollectionItemProps {}
import { BiChevronDown, } from "react-icons/bi";
const CollectionItem: React.FC<CollectionItemProps> = () => {
  return (
    <tr className="flex px-8 pt-4 font-semibold text-black24">
      <td className="flex flex-1 font-normal gap-x-6">
        <p>1</p>
        <p>Azuiki</p>
      </td>
      <td className="w-[248px] font-normal">$712</td>
      <td className="flex items-center w-[280px] text-red">
        <BiChevronDown className="text-2xl"/>
        <p>2.29%</p>
      </td>
      <td className="w-[277px] font-normal">$188.00</td>
      <td className="w-[277px] font-normal">$15.123</td>
      <td className="w-[116px] font-normal">7541</td>
    </tr>
  );
};

export default CollectionItem;
