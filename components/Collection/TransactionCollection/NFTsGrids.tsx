import React, { useContext, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/Buttons";
import MediaImageNFT from "@/components/Common/Media/MediaImageNFT";
import { EyeIcon, ImgIcon } from "@/components/Icons";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalSearchCollectionSwap } from "@/components/Modal/ModalSearchCollection";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface NFTGridProps {
  data: any[];
  idNFT: number[];
  isSearch: boolean;
  setIdNFT: React.Dispatch<React.SetStateAction<number[]>>;
  maxNft?: number;
}

const NFTGrid: React.FC<NFTGridProps> = ({ data, idNFT, isSearch, setIdNFT, maxNft }) => {
  const [val, setVal] = useState([0]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleChoiceNFT = useCallback(
    (item: any) => {
      const isExist = idNFT.includes(item.nftID);
      let newList = isExist ? idNFT.filter((nft) => nft !== item.nftID) : [...idNFT, item.nftID];

      if (!isExist && maxNft && newList.length > maxNft) return;

      setIdNFT(newList);
      setVal([newList.length]);
    },
    [idNFT, maxNft, setIdNFT]
  );

  const displayedNFTs = useMemo(() => {
    const minNFTs = 200;
    return data.slice(0, Math.max(minNFTs, val[0]));
  }, [data, val]);


  return (
    <div className="p-4 border rounded-lg border-shader_600 bg-shader_700">
      <div className="grid grid-cols-3 gap-2 overflow-y-scroll overflow-x-hidden lg:grid-cols-4 md:grid-cols-3 max-h-[260px]">
        {displayedNFTs.map((item) => (
          <div key={item.nftID} className="relative overflow-hidden rounded-lg bg-primary_500 bg-opacity-10">
            <div
              className={`relative items-center text-sm border-[2px] rounded-lg cursor-pointer lg:text-base ${idNFT.includes(item.nftID) ? "border-primary_400" : "border-shader_400"
                }`}
              onClick={() => handleChoiceNFT(item)}
            >
              <div className="relative h-[98px] group rounded-t-lg overflow-hidden">
                <MediaImageNFT data={item} isControls={false} hover zoom />
              </div>
              <div className="flex justify-between w-full px-2 py-1 text-xs font-semibold text-white">
                <p>#{item.nftID}</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                    >
                      <EyeIcon width={16} height={16} className="text-primary_300" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl bg-shader_800 border border-shader_500 p-0">
                    <DialogHeader>
                      <DialogDescription>
                        {selectedItem && <ModalDetail type="erc721" idNFT={selectedItem.nftID} nftAddress={selectedItem.nftAddress} />}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slider + Input */}
      <div className="flex items-center h-10 my-4 border rounded-lg border-shader_400">
        <div className="flex-grow px-4">
          <Slider
            max={maxNft ?? data.length}
            value={val}
            step={1}
            onValueChange={(i) => {
              setVal(i);
              setIdNFT(data.slice(0, i[0]).map((n) => n.nftID));
            }}
          />
        </div>
        <input
          type="number"
          className="w-16 h-full font-semibold text-white text-center rounded-e-lg bg-shader_600 outline-none"
          value={val[0]}
          min={0}
          max={data.length}
          onChange={(e) => {
            let value = Number(e.target.value);
            if (isNaN(value)) value = 0;
            value = Math.max(0, Math.min(value, data.length));
            setVal([value]);
            setIdNFT(data.slice(0, value).map((n) => n.nftID));
          }}
        />
      </div>

      {/* Search Button */}
      {isSearch && (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex mx-auto whitespace-nowrap gap-x-2" green_2>
              <ImgIcon width={20} height={20} />
              Select
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl bg-shader_800 border border-shader_500">
            <DialogHeader>
              <DialogDescription>
                <ModalSearchCollectionSwap />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NFTGrid;
