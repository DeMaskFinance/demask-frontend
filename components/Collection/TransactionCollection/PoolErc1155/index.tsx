import { Button } from "@/components/Buttons";
import { PoolListIcon } from "@/components/Icons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import { useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import PoolItemErc1155 from "./PoolItemErc1155";
const PoolErc1155 = ({ data, isLoadingLiquidity, isSuccess }: any) => {
    const { account } = useContext(AccountContext);

    return (
        <div className="h-full text-shader_500">
            <div className="px-4 py-2 my-4 bg-primary_500 bg-opacity-10 text-white gap-x-2 border border-primary_500 border-opacity-25 rounded-lg">
                💰 Pools accrue trading fees towards depositors
            </div>
            {!account ? (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="absolute bottom-0 flex items-end w-full py-2"
                            gradient
                        >
                            Connect Wallet
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[350px] p-0 border-none">
                        <ModalWallet />
                    </DialogContent>
                </Dialog>
            ) : (
                <div>
                    {isLoadingLiquidity ? (
                        <BiLoaderAlt className="mb-6 text-2xl animate-spin text-primary_400" />
                    ) : (
                        isSuccess && (
                            <>
                                {data?.dmlAddress ===
                                    "0x0000000000000000000000000000000000000000" ? (
                                    <div className="pool_empty">
                                        <PoolListIcon width={72} height={72} />
                                        Your active liquidity positions will appear here.
                                    </div>
                                ) : (
                                    <div className="w-full mx-auto">
                                        <PoolItemErc1155 liquidity={data} />
                                    </div>
                                )}
                            </>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default PoolErc1155;
