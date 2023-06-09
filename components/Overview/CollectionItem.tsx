import React from "react";
interface CollectionItemProps {}
import { BiChevronDown, } from "react-icons/bi";
const CollectionItem: React.FC<CollectionItemProps> = () => {
  return (
    <tr className="flex px-8 pt-4 text-dark2">
      <td className="flex flex-1 gap-x-6">
        <p>1</p>
        <p>Azuiki</p>
      </td>
      <td className="w-[248px] ">$712</td>
      <td className="flex items-center w-[280px] text-red">
        <BiChevronDown className="text-2xl"/>
        <p>2.29%</p>
      </td>
      <td className="w-[277px] ">$188.00</td>
      <td className="w-[277px] ">$15.123</td>
      <td className="w-[116px] ">7541</td>
    </tr>
  );
};

export default CollectionItem;
