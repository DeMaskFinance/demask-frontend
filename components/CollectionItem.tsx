import React from "react";
interface CollectionItemProps {}
import { BiChevronDown, } from "react-icons/bi";
const CollectionItem: React.FC<CollectionItemProps> = () => {
  return (
    <tr className="flex px-8 my-4 font-semibold text-black24">
      <td className="flex basis-3/12 gap-x-6">
        <p>1</p>
        <p>Azuiki</p>
      </td>
      <td className="basis-2/12">$712</td>
      <td className="flex items-center basis-2/12 text-red">
        <BiChevronDown className="text-2xl"/>
        <p>2.29%</p>
      </td>
      <td className="basis-2/12">$188.00</td>
      <td className="basis-2/12">$15.123</td>
      <td className="basis-1/12 ">7541</td>
    </tr>
  );
};

export default CollectionItem;
