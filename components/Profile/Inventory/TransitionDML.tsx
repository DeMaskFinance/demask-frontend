import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import AccountContext from "@/context/AccountContext";
import { searchNFTService } from "@/libs/service/searchService";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useContext } from "react";
import { CgClose } from "react-icons/cg";

interface TransionDMLProps {
    item: any,
    chainId: string,
    selectedAction: string,
    index: number,
    selectedItemIndex: number | null,
    setSelectedItemIndex: any
}
const TransionDML: React.FC<TransionDMLProps> = (
    {
        item,
        chainId,
        selectedAction,
        index,
        selectedItemIndex,
        setSelectedItemIndex
    }
) => {
    const { demask } = useContext(AccountContext);
    const { NATIVE_ADDRESS: nativeAddress } = demask;
    const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
        queryKey: ["dml", item],
        queryFn: async () => {
            const res = await searchNFTService(item.nftAddress, item.nftID, chainId);
            return res;
        },
        keepPreviousData: true,
    });
    console.log(data);
    console.log(selectedAction);

    return (
        <div className={`absolute border p-2 top-0 left-0 w-full h-full bg-white rounded-md transition-all ease-linear duration-150 ${selectedItemIndex === index ? 'translate-y-0' : 'translate-y-full'}`}>
            {selectedAction}
            {(isLoading || isFetching) ? (
                <p>Loading...</p>
            ) : isSuccess && data.length > 0 ? (
                data.map((dmlItem: any, index: number) => (
                    <div>
                        {dmlItem.dmlAddress ? (
                            <Link href={`/details/${dmlItem.dmlAddress}`} key={index} className='relative flex items-center mt-2'>
                                <div className="max-w-[80%]">
                                    <ModalDocument data={dmlItem.metadata.symbol} />
                                </div>
                                <span className="block overflow-hidden leading-3">/</span>
                                <span>{dmlItem.tokenSymbol}</span>
                            </Link>
                        ) : (
                            <div>
                                {selectedAction === "Add" ? (
                                    <Link href={`/add/${item.nftAddress}/${nativeAddress}/${item.nftID}`}>
                                        <p>Go to Add Liquidity.</p>
                                    </Link>
                                ) : (
                                    <Link href={`/swap/${item.nftAddress}/${nativeAddress}/${item.nftID}`}>
                                        <p>Go to Swap NFT.</p>
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div>
                    {selectedAction === "Add" ? (
                        <Link href={`/add/${item.nftAddress}/${nativeAddress}/${item.nftID}`}>
                            <p>Go to Add Liquidity.</p>
                        </Link>
                    ) : (
                        <Link href={`/swap/${item.nftAddress}/${nativeAddress}/${item.nftID}`}>
                            <p>Go to Swap NFT.</p>
                        </Link>
                    )}
                </div>
            )}
            <button
                className="absolute top-0 right-0 p-2 text-lg"
                onClick={() => setSelectedItemIndex(null)}
            >
                <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
            </button>
        </div>
    )
}
export default TransionDML;