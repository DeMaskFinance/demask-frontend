import Copy from "@/components/Common/Copy";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { RefetchIcon, ShareIcon, TwitterIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { refreshNFTService } from "@/libs/service/nftService";

import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react/headless";
import React, { memo, useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { HiChevronDown } from "react-icons/hi2";
import ModalDocument from "../ModalLength/ModalDocument";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <div className="rounded-lg relative min-h-[500px] md:w-[838px] flex justify-center items-center ">
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-full w-full">
          <BiLoaderAlt className="text-2xl text-center animate-spin text-primary_400" />
        </div>
      ) : (
        isSuccess && (
          <div className="w-full">
            <div className="flex justify-between p-4 border-b text-primary_200 border-shader_500">
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
            <div className="p-4 overflow-y-scroll min-h-[500px] max-h-[60vh]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex max-h-[350px] aspect-square rounded-xl h-fit overflow-hidden">
                  <MediaNFT data={data} isControls />
                </div>
                <div className="w-full max-w-lg mx-auto flex-1">
                  <Accordion
                    type="multiple"
                    className="w-full"
                    defaultValue={["item-1", "item-2", "item-3"]}
                  >
                    <AccordionItem value="item-1" className=" border-none">
                      <AccordionTrigger className="p-3 mb-2 rounded-lg  bg-shader_700">
                        <span className="title">Description</span>
                      </AccordionTrigger>
                      <AccordionContent className="mt-2 text-sm text-shader_200 px-2">
                        {data?.metadata?.description ? (
                          <p>{formattedDescription}</p>
                        ) : (
                          <p>No data</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className=" border-none">
                      <AccordionTrigger className="p-3 mb-2 rounded-lg bg-shader_700">
                        <span className="title">Attributes</span>
                      </AccordionTrigger>
                      <AccordionContent className="mt-2 text-sm px-2">
                        {data.metadata?.attributes.length > 0 ? (
                          <div className="grid grid-cols-3 gap-4">
                            {data.metadata?.attributes.map(
                              (item: any, index: number) => (
                                <ul
                                  className="p-3 rounded-lg bg-primary_500 bg-opacity-10"
                                  key={index}
                                >
                                  <li className="text-primary_200">
                                    <ModalDocument data={item.trait_type} />
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
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className=" border-none">
                      <AccordionTrigger className="p-3 mb-2 border rounded-lg border-shader_600 bg-shader_700">
                        <span className="title">Detail</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-shader_200 px-2">
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
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
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
