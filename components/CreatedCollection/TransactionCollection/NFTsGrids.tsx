import MediaNFT from "@/components/Common/MediaNFT";
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
    return (
      <div className="grid grid-cols-3 pb-[34px] gap-3 mt-4 overflow-y-scroll overflow-x-hidden lg:grid-cols-4 md:grid-cols-3 text-shader_600 max-h-[400px] mb-8">
        {data?.pages.map((page: any, pageIndex: number) => (
          <Fragment key={pageIndex}>
            {page?.data?.map((item: any, index: number) => (
              <div
                key={index}
                className="relative overflow-hidden"
                onClick={() => handleChoiceNFT(item)}
              >
                <div
                  className={`relative items-center p-1 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:shadow-home dark:border-shader_600 ${
                    idNFT.includes(Number(item.nftID))
                      ? "border-primary_400 dark:border-primary_400"
                      : ""
                  }`}
                >
                  <div className="relative h-[78px] lg:h-[100px] group">
                    <MediaNFT data={item} isControls={false} hover zoom />
                    <div
                      className="absolute top-0 right-0 z-10 p-[2px] text-sm bg-white cursor-pointer rounded-bl-md text-shader_600"
                      onClick={async (e) => {
                        e.stopPropagation();
                        toast.success("Please wait a moment!", {
                          position: "top-right",
                          autoClose: 1000,
                          hideProgressBar: true,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "light",
                        });
                        await refreshNFTService(
                          chainId,
                          item.nftAddress,
                          item.nftID,
                          item.type
                        );
                      }}
                    >
                      <GrPowerReset />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex w-full mt-2">
                      <div className="w-full">
                        <h6
                          title={item.metadata?.name}
                          className="flex items-start gap-2 font-semibold uppercase"
                        >
                          <span className="flex-wrap max-w-full text-sm line-clamp-1">
                            {item.metadata?.name ? (
                              <ModalDocument data={item.metadata?.name} />
                            ) : (
                              <p>--</p>
                            )}
                          </span>
                        </h6>
                      </div>
                    </div>
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
