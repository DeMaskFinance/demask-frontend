import MediaNFT from "@/components/Common/MediaNFT";
import { EyeIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import showToast, { ToastType } from "@/components/Toast/ToastCustom";
import AccountContext from "@/context/AccountContext";
import { refreshNFTService } from "@/libs/service/nftService";
import React, { Fragment, MouseEvent, forwardRef, useContext } from "react";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "react-toastify";
interface NFTGridProps {
  data: any;
  isFetching: boolean;
  hasNextPage: boolean | undefined;
  handleChoiceNFT: (item: any) => void;
  idNFT: number[];
}

const NFTGrid = forwardRef<HTMLDivElement, NFTGridProps>(
  ({ data, isFetching, hasNextPage, handleChoiceNFT, idNFT }, ref) => {
    const { demask, chainId } = useContext(AccountContext);
    const handleReset = async (e: MouseEvent<HTMLDivElement>, item: any) => {
      e.stopPropagation();

      try {
        showToast("Please wait a moment!", ToastType.Success);

        await refreshNFTService(
          chainId,
          item.nftAddress,
          item.nftID,
          item.type
        );
      } catch (error) {
        console.error("Error occurred while refreshing NFT:", error);
        showToast(
          "An error occurred. Please try again later.",
          ToastType.Error
        );
      }
    };
    console.log(data);

    return (
      <div className="grid grid-cols-3 pb-[34px] gap-3 mt-4 overflow-y-scroll overflow-x-hidden lg:grid-cols-5 md:grid-cols-3 text-shader_600 max-h-[400px] mb-8">
        {data?.pages.map((page: any, pageIndex: number) => (
          <Fragment key={pageIndex}>
            {page?.data?.map((item: any, index: number) => (
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
                    <EyeIcon
                      width={16}
                      height={16}
                      className="text-primary_300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
        {isFetching && hasNextPage && <SkeletonItemTransaction />}
        <div ref={ref} style={{ height: "1px" }}></div>
      </div>
    );
  }
);

export default NFTGrid;
