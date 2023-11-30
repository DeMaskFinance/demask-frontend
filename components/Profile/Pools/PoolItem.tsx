import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import formatToUnit from "@/libs/utils/formatToUnit";
import Link from "next/link";
import { useContext } from "react";

const PoolItem = ({ item }: any) => {
    const { account, wallet } = useContext(AccountContext);
    const { balanceOfDML, totalSupply, balanceDML } = useBananceOfDML(account, item.dmlAddress, wallet);
    // console.log(totalSupply.toString());
    // console.log(balanceDML.toString());

    // console.log(item);
    const notionSize = (Number(balanceDML) / Number(totalSupply)) * item.reserveToken * 2 / 1700
    return (
        <div>
            <Link href={`/details/${item.dmlAddress}`}>
                <tr className="flex text-sm border-b rounded-lg lg:text-base md:text-base text-dark2 hover:bg-slate-100 lg:px-2">
                    <td className="relative flex items-center justify-start py-2  md:basis-1/6 w-[140px]">
                        <FormatNumber number={balanceOfDML} />
                    </td>

                    <td className="flex items-center justify-start py-2 md:basis-3/6 w-[200px] ">
                        <a href={`https://goerli.explorer.zksync.io/address/${item.dmlAddress}`} target="_blank" rel="noopener noreferrer">
                            {`${item.dmlAddress.slice(0, 6)}...${item.dmlAddress.slice(-4)}`}
                        </a>
                    </td>

                    <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px]">
                        <span className="">
                            {formatToUnit(notionSize.toString())}
                        </span>
                    </td>
                    <td className="flex items-center justify-start py-2 md:basis-1/6 w-[140px] gap-x-2">
                        <div className="w-8 h-8">
                            <MediaNFT data={item} isControls={false} />
                        </div>
                        <div className="flex items-center">
                            <span>{item.metadata.symbol}</span>
                            <span className="block overflow-hidden leading-3">/</span>
                            <span>{item.tokenSymbol}</span>
                        </div>
                    </td>
                </tr>
            </Link>
        </div>
    )
}
export default PoolItem;