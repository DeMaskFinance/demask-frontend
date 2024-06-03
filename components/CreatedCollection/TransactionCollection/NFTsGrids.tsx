import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/MediaNFT";
import { EyeIcon, ImgIcon } from "@/components/Icons";
import { ModalSearchNFTSwap } from "@/components/Modal/ModalSearchNFT";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import showToast, { ToastType } from "@/components/Toast/ToastCustom";
import { Slider } from "@/components/ui/slider";
import AccountContext from "@/context/AccountContext";
import { refreshNFTService } from "@/libs/service/nftService";
import React, { Fragment, MouseEvent, useContext, useState } from "react";
interface NFTGridProps {
  data: any;
  isFetching: boolean;
  handleChoiceNFT: (item: any) => void;
  idNFT: number[];
  isSearch: boolean;
}

const NFTGrid: React.FC<NFTGridProps> = ({
  data,
  isFetching,
  handleChoiceNFT,
  idNFT,
  isSearch,
}) => {
  const { chainId } = useContext(AccountContext);
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const handleSearchNFT = () => {
    setIsOpenSearchNFT(true);
    document.body.style.overflowY = "hidden";
  };
  const handleReset = async (e: MouseEvent<HTMLDivElement>, item: any) => {
    e.stopPropagation();

    try {
      showToast("Please wait a moment!", ToastType.Success);

      await refreshNFTService(chainId, item.nftAddress, item.nftID, item.type);
    } catch (error) {
      console.error("Error occurred while refreshing NFT:", error);
      showToast("An error occurred. Please try again later.", ToastType.Error);
    }
  };
  console.log(data, idNFT);

  const [val, setVal] = useState([0]);
  return (
    <div className="p-4 mt-4 border rounded-lg border-shader_600 bg-shader_700">
      <div className="grid grid-cols-3 gap-2  overflow-y-scroll overflow-x-hidden lg:grid-cols-4 md:grid-cols-3  max-h-[400px] ">
        {data?.data?.map((item: any, index: number) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg bg-primary_500 bg-opacity-10"
            onClick={() => handleChoiceNFT(item)}
          >
            <div
              className={`relative items-center text-sm   rounded-lg cursor-pointer lg:text-base ${
                idNFT.includes(Number(item.nftID))
                  ? "border-primary_400 border-[2px]"
                  : ""
              }`}
            >
              <div className="relative h-[78px] lg:h-[100px] group">
                <MediaNFT data={item} isControls={false} hover zoom />
              </div>
              <div className="flex justify-between w-full p-2 text-xs font-semibold text-white">
                <p>#{item.nftID}</p>
                <EyeIcon width={16} height={16} className="text-primary_300" />
              </div>
            </div>
          </div>
        ))}
        {/* {isFetching && <SkeletonItemTransaction />} */}
      </div>
      <div className="flex items-center h-10 my-4 border rounded-lg border-shader_400">
        <div className="flex-grow px-4">
          <Slider
            defaultValue={val}
            max={100}
            step={1}
            className=""
            onValueChange={(i) => {
              setVal(i);
              console.log(i);
            }}
          />
        </div>
        <div className="flex items-center justify-center w-16 h-full font-semibold text-white rounded-e-lg bg-shader_600">
          {val}
        </div>
      </div>
      {isSearch && (
        <Button
          className="flex mx-auto whitespace-nowrap gap-x-2"
          green_2
          onClick={handleSearchNFT}
        >
          <ImgIcon width={20} height={20} />
          Select NFT
        </Button>
      )}
      <ModalSearchNFTSwap
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
      />
    </div>
  );
};

export default NFTGrid;
