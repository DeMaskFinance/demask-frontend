import Copy from "@/components/Common/Copy";
import MediaNFT from "@/components/Common/MediaNFT";
import { RefetchIcon, ShareIcon, TwitterIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { refreshNFTService } from "@/libs/service/nftService";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react/headless";
import React, { memo, useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { HiChevronDown } from "react-icons/hi2";
import ModalDocument from "../ModalLength/ModalDocument";
interface ModalDetailProps {
  type: string;
  nftAddress: string;
  idNFT: string;
}

const ModalDetail: React.FunctionComponent<ModalDetailProps> = ({
  type,
  nftAddress,
  idNFT,
}) => {
  const { demask, chainId } = useContext(AccountContext);
  const { isLoading, data, isSuccess, refetch, isFetching } = useQuery({
    queryKey: ["refreshNFTService", chainId, nftAddress, idNFT, type],
    queryFn: async () => {
      const res = await refreshNFTService(chainId, nftAddress, idNFT, type);
      return res.data;
    },
  });

  const formattedDescription = data?.metadata?.description
    ?.split("\n")
    ?.map((line: number, index: number) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  return (
    <div className="min-w-[20vw] rounded-lg relative min-h-[500px] flex justify-center items-center">
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-full">
          <BiLoaderAlt className="text-2xl text-center animate-spin text-primary_400" />
        </div>
      ) : (
        isSuccess && (
          <div>
            <div className="flex justify-between pb-4 border-b text-primary_200 border-shader_500">
              <div>
                <div className="flex items-center gap-x-[6px]">
                  <p className="text-lg font-semibold text-white max-w-[100px]">
                    <ModalDocument data={data?.metadata?.name} />
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
                  <Tippy
                    interactive
                    placement="bottom"
                    render={(attrs) => (
                      <div className="" tabIndex={-1} {...attrs}>
                        <ul className="pb-2 w-[160px] menu font-semibold">
                          <li className="item_menu">
                            <Copy content="123" title="Copy Link" />
                          </li>
                          <li className="item_menu gap-x-2">
                            <TwitterIcon width={20} height={20} />
                            Share on Twitter
                          </li>
                          <li></li>
                        </ul>
                      </div>
                    )}
                  >
                    <div
                      className="border rounded-full border-shader_400 p-[7px]"
                      onClick={() => refetch()}
                    >
                      <ShareIcon
                        width={16}
                        height={16}
                        className="cursor-pointer text-primary_200"
                      />
                    </div>
                  </Tippy>
                </div>
                <p className="text-primary_300">{data?.metadata?.symbol}</p>
              </div>
            </div>
            <div className="p-4 overflow-y-scroll min-h-[500px]">
              <div className="flex gap-x-4">
                <div className="w-[40%]  max-h-[350px] aspect-square rounded-xl h-fit overflow-hidden">
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
                          <div className="grid grid-cols-3 gap-4 ">
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
                            <p className="font-semibold text-shader_100">Art</p>
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
  );
};

export default memo(ModalDetail);
