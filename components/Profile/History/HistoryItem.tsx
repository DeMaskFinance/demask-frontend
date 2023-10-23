import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import formatNumber from "@/libs/utils/formatNumer";
import formatToUnit from "@/libs/utils/formatToUnit";
import Link from "next/link";
import { useContext } from "react";

const HistoryItem = ({ item }: any) => {
    const { account, wallet } = useContext(AccountContext);

    console.log(item);
    return (
        <tr className="flex text-sm border-b rounded-lg lg:text-base md:text-base text-dark2 hover:bg-slate-100 lg:px-2">
            <td className="flex justify-start md:basis-1/6 w-[140px]">
               {item.action}
            </td>

            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[200px]">
                <span className="max-w-[150px] relative">
                    <ModalDocument data={item.metadata.name}/>
                </span>
            </td>

            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                {item.chainId}
            </td>
            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                {formatToUnit(item.amountNFT)}
            </td>
            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                {formatToUnit(item.price)}
            </td>
            <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                <span className="">
                    123
                </span>
            </td>
        </tr>
    )
}
export default HistoryItem;