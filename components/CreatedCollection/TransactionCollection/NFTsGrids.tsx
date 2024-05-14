import MediaNFT from "@/components/Common/MediaNFT";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import React, { Fragment, forwardRef } from "react";
import { GrPowerReset } from "react-icons/gr";
interface NFTGridProps {
  data: any;
  isFetching: boolean;
  hasNextPage: boolean | undefined;
  handleChoiceNFT: (item: any) => void;
  idNFT: number[];
}

const NFTGrid = forwardRef<HTMLDivElement, NFTGridProps>(
  ({ data, isFetching, hasNextPage, handleChoiceNFT, idNFT }, ref) => {
    return (
      <div className="grid grid-cols-3 pb-[34px] gap-3 mt-4 overflow-y-scroll overflow-x-hidden lg:grid-cols-4 md:grid-cols-3 text-dark2 max-h-[400px] mb-8">
        {data?.pages.map((page: any, pageIndex: number) => (
          <Fragment key={pageIndex}>
            {page?.data?.map((item: any, index: number) => (
              <div
                key={index}
                className="relative overflow-hidden"
                onClick={() => handleChoiceNFT(item)}
              >
                <div
                  className={`relative items-center p-1 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:shadow-home dark:border-dark2 ${
                    idNFT.includes(Number(item.nftID))
                      ? "border-secondary5 dark:border-secondary5"
                      : ""
                  }`}
                >
                  <div className="relative h-[78px] lg:h-[100px] group">
                    <MediaNFT data={item} isControls={false} hover zoom />
                    <GrPowerReset
                      className="absolute top-0 right-0 cursor-pointer text-dark2"
                      onClick={() => {}}
                    />
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
