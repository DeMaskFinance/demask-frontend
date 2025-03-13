import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EyeIcon, ImgIcon } from "@/components/Icons";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchCollectionSwap } from "@/components/Modal/ModalSearchCollection";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
interface NFTGridProps {
    data: any;
    idNFT: number[];
    isSearch: boolean;
    setIdNFT: React.Dispatch<React.SetStateAction<number[]>>;
    isRemove?: boolean;
    maxNft?: number;
}

const NFTRemoveLiquidityGrids: React.FC<NFTGridProps> = ({
    data,
    idNFT,
    isSearch,
    setIdNFT,
    maxNft
}) => {
    const [selectedItem, setSelectedItem] = useState<ModalDetailProps | null>(
        null
    );

    console.log(idNFT)



    return (
        <div className="p-4 mt-4 border rounded-lg border-shader_600 bg-shader_700">
            <div className="grid grid-cols-3 gap-2  overflow-y-scroll overflow-x-hidden lg:grid-cols-4 md:grid-cols-3  max-h-[260px] ">
                {data?.map((item: any, index: number) => {

                    return <div
                        key={index}
                        className="relative overflow-hidden rounded-lg bg-primary_500 bg-opacity-10"
                    >
                        <div
                            className={`relative items-center text-sm  border-[2px]  rounded-lg lg:text-base ${idNFT.includes(Number(item.nftID))
                                ? "border-primary_400 border-opacity-100 border-[2px]"
                                : "border-shader_400"
                                }`}
                        >
                            <div
                                className="relative h-[98px] group rounded-t-lg overflow-hidden"
                            >
                                <MediaNFT data={item} isControls={false} hover zoom />
                            </div>
                            <div className="flex justify-between w-full px-2 py-1 text-xs font-semibold text-white">
                                <p>#{item.nftID}</p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <EyeIcon
                                                width={16}
                                                height={16}
                                                className="text-primary_300"
                                            />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-6xl bg-shader_800 border border-shader_500 p-0">
                                        <DialogHeader>
                                            <DialogDescription>
                                                {selectedItem && (
                                                    <ModalDetail
                                                        type="erc721"
                                                        idNFT={selectedItem.nftID}
                                                        nftAddress={selectedItem.nftAddress}
                                                    />
                                                )}
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                }

                )}
            </div>
            {/* <div className="flex items-center h-10 my-4 border rounded-lg border-shader_400">
                <div className="flex-grow px-4">
                    <Slider
                        max={maxNft ? maxNft : data?.length}
                        value={val}
                        step={1}
                        className=""
                        onValueChange={(i) => {
                            setVal(i);
                            hanldeListNFT(i[0]);
                        }}
                    />
                </div>
                <input
                    type="number"
                    className="w-16 h-full font-semibold text-white text-center rounded-e-lg bg-shader_600 outline-none"
                    //@ts-expect-error:error
                    value={val}
                    min={0}
                    max={data?.data?.length}
                    onChange={(e) => {
                        let value = Number(e.target.value);
                        if (isNaN(value)) value = 0;
                        value = Math.max(0, Math.min(value, data?.data?.length));
                        setVal([value]);
                        hanldeListNFT(value);
                    }}
                />
            </div> */}
            <Dialog>
                <DialogTrigger asChild>
                    {isSearch && (
                        <Button className="flex mx-auto whitespace-nowrap gap-x-2" green_2>
                            <ImgIcon width={20} height={20} />
                            Select
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="max-w-6xl bg-shader_800 border border-shader_500">
                    <DialogHeader>
                        <DialogDescription>
                            <ModalSearchCollectionSwap />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NFTRemoveLiquidityGrids;
