import Copy from "@/components/Common/Copy";
import MediaNFT from "@/components/Common/MediaNFT";
import { RefetchIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { refreshNFTService } from "@/libs/service/nftService";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import React, { memo, useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { HiChevronDown } from "react-icons/hi2";
import Wrapper from "../Wrapper";
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
          <div className="w-[42vw] h-[560px] rounded-lg relative overflow-y-scroll">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center h-full">
                <BiLoaderAlt className="text-2xl text-center animate-spin text-primary_400" />
              </div>
            ) : (
              isSuccess && (
                <div>
                  <div className="px-4 pt-4">
                    <div className="flex justify-between pb-4 border-b text-primary_200 border-shader_500">
                      <div>
                        <div className="flex items-center gap-x-[6px]">
                          <p className="text-lg font-semibold text-white ">
                            {data?.metadata?.name}
                          </p>
                          <div className="px-2 py-1 text-sm font-normal rounded-lg bg-primary_500 bg-opacity-[0.15]">
                            {data?.nftID}
                          </div>
                          <div
                            className="border rounded-full border-shader_400 p-[7px]"
                            onClick={() => refetch()}
                          >
                            <RefetchIcon
                              width={16}
                              height={16}
                              className="cursor-pointer text-primary_200"
                            />
                          </div>
                        </div>
                        <p className="text-primary_300">
                          {data?.metadata?.symbol}
                        </p>
                      </div>
                      <div onClick={handleClose}>
                        <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-x-4">
                      <div className="w-[40%] max-h-[350px] aspect-square rounded-xl h-fit overflow-hidden">
                        <MediaNFT data={data} isControls />
                      </div>
                      <div className="flex-grow">
                        <div className="w-full max-w-lg mx-auto ">
                          <Disclosure
                            as="div"
                            className="p-3 mb-2 border rounded-lg border-shader_600 bg-shader_700"
                            defaultOpen={true}
                          >
                            <DisclosureButton className="flex items-center justify-between w-full group">
                              <span className="title">Description</span>
                              <HiChevronDown className="size-5 fill-white  group-data-[open]:rotate-180" />
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 text-sm text-shader_200">
                              {data?.metadata?.description ? (
                                <p>{formattedDescription}</p>
                              ) : (
                                <p>No data</p>
                              )}
                            </DisclosurePanel>
                          </Disclosure>
                          <Disclosure
                            as="div"
                            className="p-3 mb-2 border rounded-lg border-shader_600 bg-shader_700"
                            defaultOpen={true}
                          >
                            <DisclosureButton className="flex items-center justify-between w-full group">
                              <span className="title">Attributes</span>
                              <HiChevronDown className="size-5 fill-white  group-data-[open]:rotate-180" />
                            </DisclosureButton>
                            <DisclosurePanel className="mt-2 text-sm ">
                              {data.metadata?.attributes.length > 0 ? (
                                <div className="grid grid-cols-3 gap-x-4 ">
                                  {data.metadata?.attributes.map(
                                    (item: any, index: number) => (
                                      <ul
                                        className="p-3 rounded-lg bg-primary_500 bg-opacity-10"
                                        key={index}
                                      >
                                        <li className="text-primary_200">
                                          {item.trait_type}
                                        </li>
                                        <li className="font-bold text-white">
                                          {item.value}
                                        </li>
                                      </ul>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-shader_200">No data</p>
                              )}
                            </DisclosurePanel>
                          </Disclosure>
                          <Disclosure
                            as="div"
                            className="p-3 mb-2 border rounded-lg border-shader_600 bg-shader_700"
                            defaultOpen={true}
                          >
                            <DisclosureButton className="flex items-center justify-between w-full group">
                              <span className="title">Detail</span>
                              <HiChevronDown className="size-5 fill-white  group-data-[open]:rotate-180" />
                            </DisclosureButton>
                            <DisclosurePanel className="text-sm text-shader_200">
                              <ul>
                                <li className="flex justify-between py-2 border-b border-shader_500">
                                  <p>Name</p>
                                  <p className="font-semibold text-shader_100">
                                    {data?.metadata?.name}
                                  </p>
                                </li>
                                <li className="flex justify-between py-2 border-b border-shader_500">
                                  <p>Type</p>
                                  <p className="font-semibold text-shader_100">
                                    Art
                                  </p>
                                </li>
                                <li className="flex justify-between py-2 border-b border-shader_500">
                                  <p>Token Standard</p>
                                  <p className="font-semibold uppercase text-shader_100">
                                    {type}
                                  </p>
                                </li>
                                <li className="flex justify-between py-2 border-b border-shader_500">
                                  <p>ID</p>
                                  <a
                                    href={data?.uri}
                                    target="_blank"
                                    className="flex items-center font-semibold text-primary_400 gap-x-1"
                                  >
                                    {data?.nftID}
                                    <Copy content={data?.nftID} />
                                  </a>
                                </li>
                                <li className="flex justify-between py-2 border-b border-shader_500">
                                  <p>Contract</p>
                                  <div className="flex items-center font-semibold text-primary_400 gap-x-1">
                                    <a
                                      href={`${demask.urltxHash}address/${nftAddress}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {`${nftAddress.slice(
                                        0,
                                        6
                                      )}...${nftAddress.slice(-8)}`}
                                    </a>
                                    <Copy content={nftAddress} />
                                  </div>
                                </li>
                                <li className="flex justify-between pt-2">
                                  <p>Last Update</p>
                                  <p className="font-semibold text-shader_100">
                                    {data?.updatedTime}
                                  </p>
                                </li>
                              </ul>
                            </DisclosurePanel>
                          </Disclosure>
                        </div>
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
