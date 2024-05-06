import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import React, { memo, useContext } from "react";
import MediaNFT from "@/components/Common/MediaNFT";
import Copy from "@/components/Common/Copy";
import AccountContext from "@/context/AccountContext";
import ModalDocument from "../ModalLength/ModalDocument";
import { RefetchIcon } from "@/components/Icons";
import { useQuery } from "@tanstack/react-query";
import { refreshNFTService } from "@/libs/service/nftService";
import { BiLoaderAlt } from "react-icons/bi";
interface ModalDetailProps {
  type: string;
  nftAddress: string;
  idNFT: string;
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenDetail: boolean;
}

const ModalDetail: React.FunctionComponent<ModalDetailProps> = ({
  type,
  nftAddress,
  idNFT,
  setIsOpenDetail,
  isOpenDetail,
}) => {
  const { demask, chainId } = useContext(AccountContext);
  const { isLoading, data, isSuccess, refetch, isFetching } = useQuery({
    queryKey: ["refreshNFTService", chainId, nftAddress, idNFT, type],
    queryFn: async () => {
      const res = await refreshNFTService(chainId, nftAddress, idNFT, type);
      return res.data;
    },
  });
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenDetail(false);
  };
  const formattedDescription = data?.metadata?.description
    ?.split("\n")
    ?.map((line: number, index: number) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));

  return (
    <Wrapper isOpen={isOpenDetail} onClick={handleClose}>
      <div className="flex items-center">
        <div className="cursor-default container_modal">
          <div className="w-[360px] md:w-[400px] lg:w-[550px] h-[560px] rounded-lg p-8 relative overflow-y-scroll">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center h-full">
                <BiLoaderAlt className="text-2xl text-center animate-spin text-secondary5" />
              </div>
            ) : (
              isSuccess && (
                <div>
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center gap-x-3">
                      <p className="py-2 text-xl font-medium">NFT Details</p>
                      <div className="cursor-pointer" onClick={() => refetch()}>
                        <RefetchIcon width={20} height={20} />
                      </div>
                    </div>
                    <button className="text-lg " onClick={handleClose}>
                      <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
                    </button>
                  </div>
                  <div className="flex gap-x-4">
                    <div className="w-[240px] h-[240px]">
                      <MediaNFT data={data} isControls />
                    </div>
                    <ul>
                      {data?.metadata?.name && (
                        <li className="mb-4">
                          <p className="font-medium text-dark2">Name</p>
                          <div className="flex gap-x-2">
                            <div className="w-6 h-6">
                              <MediaNFT data={data} isControls />
                            </div>
                            <a
                              href={data?.metadata?.uri}
                              rel="noreferrer noopener"
                              target="_blank"
                              className="text-dark3 max-w-[140px]"
                            >
                              <ModalDocument data={data?.metadata?.name} />
                            </a>
                          </div>
                        </li>
                      )}
                      {data?.metadata?.symbol && (
                        <li className="mb-4">
                          <p className="font-medium text-dark2">Symbol</p>
                          <div className="text-sm font-light text-dark3 max-w-[140px]">
                            <ModalDocument data={data?.metadata?.symbol} />
                          </div>
                        </li>
                      )}
                      <li className="mb-4">
                        <p className="font-medium text-dark2">Type</p>
                        <p className="text-sm font-light uppercase text-dark3">
                          {type}
                        </p>
                      </li>
                      <li className="mb-4">
                        <p className="font-medium text-dark2">
                          Contract Address
                        </p>
                        <div className="flex gap-x-1">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${demask.urltxHash}address/${nftAddress}`}
                            className="text-sm font-light cursor-pointer text-secondary2"
                          >{`${nftAddress.slice(0, 2)}...${nftAddress.slice(
                            -4
                          )}`}</a>
                          <Copy content={nftAddress} />
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    {data.metadata?.description && (
                      <div className="mb-4">
                        <p className="font-medium text-dark2">Description</p>
                        <p className="text-sm font-light text-dark3">
                          {formattedDescription}
                        </p>
                      </div>
                    )}
                    <div className="mb-4">
                      <p className="font-medium text-dark2">Attributes</p>
                      {data.metadata?.attributes.length > 0 ? (
                        <div className="text-sm font-light text-dark3">
                          {data.metadata?.attributes.map(
                            (item: any, index: number) => (
                              <ul
                                className="flex flex-wrap gap-x-4"
                                key={index}
                              >
                                <li>{item.trait_type}</li>
                                <li>{item.value}</li>
                              </ul>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-sm font-light text-dark3">None</p>
                      )}
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="">
                        <p className="mb-1 font-medium text-dark2">Category</p>
                        {data?.metadata?.category ? (
                          <div className="flex flex-wrap gap-4">
                            {data.metadata?.category.map(
                              (item: any, index: number) => (
                                <p
                                  className="px-4 py-1 text-sm font-medium border rounded-lg text-dark2 border-dark3"
                                  key={index}
                                >
                                  {item}
                                </p>
                              )
                            )}
                          </div>
                        ) : (
                          <p>None</p>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-dark2">Token ID</p>
                        <div className="flex items-center gap-x-1">
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={data.uri}
                            className="text-sm font-light cursor-pointer text-secondary5"
                          >
                            {idNFT}
                          </a>
                          <Copy content={idNFT} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-dark2">
                          Royalty Fee (%)
                        </p>
                        <p className="text-sm font-light text-dark3">
                          {data?.royaltyFee}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-dark2">Last Updated</p>
                        <p className="text-sm font-light text-dark3">
                          20 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default memo(ModalDetail);
