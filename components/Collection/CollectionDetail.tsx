import FormatNumber from "@/components/Common/FormatNumber";
import {
  EditIcon,
  FacebookIcon,
  PlusIcon,
  RightIcon,
  SeeMoreIcon,
  SwapIcon,
  TeleIcon,
  TickSuccessIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import * as collectionService from "@/libs/service/collectionService";
import {
  briefDocument,
  formatLinkIPFS,
  formatTypeChain,
} from "@/libs/utils/formatComon";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { toast } from "sonner";
import { Button } from "../Buttons";
import Copy from "../Common/Copy";
import { MediaCollection } from "../Common/Media";
import ModalRoyalty from "../Modal/ModalRoyalty";
import TokenIcon from "../Logo/TokenIcon";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { queryClient } from "@/libs/constants";
import { getInfoPool } from "@/libs/service/nftService";
import { useOutsideClick } from "@/hooks/useOutsideClick";
interface CollectionDetailProps {
  collectionAddress: string;
  initialData: any
}
const CollectionDetail: React.FunctionComponent<CollectionDetailProps> = ({
  collectionAddress,
  initialData,
}) => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const inputAvatar = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [searchCollection, setSearchCollection] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => {
      if (collectionAddress) {
        const res = await collectionService.collectionDetail(
          collectionAddress,
          chainId
        );
        return res.data;
      }
    },
    initialData: initialData || undefined
  });


  const handleUploadAvatar = async (file: any) => {
    try {
      setAvatarLoading(true);
      await collectionService.uploadFileCollection({
        avatar: file,
        chainId,
        collectionAddress,
      });
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setAvatarLoading(false);
    }
  };
  const handleDialogClose = () => setIsDialogOpen(false);

  const collectionData = data?.data || data;


  const socialIcons = [
    { url: collectionData?.socials?.website, Icon: WebsiteIcon },
    { url: collectionData?.socials?.twitter, Icon: TwitterIcon },
    { url: collectionData?.socials?.facebook, Icon: FacebookIcon },
    { url: collectionData?.socials?.telegram, Icon: TeleIcon },
  ];






  const dropdownRef = useRef(null);
  useOutsideClick(dropdownRef, () => setDropdownType(null));

  const [dropdownType, setDropdownType] = useState<"add" | "swap" | null>(null);
  const [activeTab, setActiveTab] = useState(0);


  const { data: infoPool, isLoading: isLoadingPool } = useQuery<any>({
    queryKey: ["poolInfo", collectionAddress, collectionData?.type, collectionData?.nftID],
    queryFn: async () => {
      const res = await getInfoPool({
        chainId: chainId,
        nftAddress: collectionAddress,
        type: collectionData?.type,
        nftID: String(collectionData?.nftID)
      });
      return res.data;
    },

    enabled: dropdownType !== null
  });

  const activeOption = infoPool?.dmlList?.filter((opt: any) => opt?.isActive)?.[activeTab];

  const renderDropdown = (type: "add" | "swap") => (
    <div
      ref={dropdownRef}
      className="absolute top-full mt-2 left-0 overflow-hidden border border-shader_400 rounded-xl bg-shader_500 z-10 w-full shadow-lg"
    >
      {isLoadingPool ? (
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-6 bg-gray-600 rounded w-2/4" />
            <div className="h-6 bg-gray-600 rounded w-2/4" />
          </div>
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <div className="space-y-1">
                  <div className="h-3 bg-gray-600 rounded w-24" />
                  <div className="h-3 bg-gray-600 rounded w-16" />
                </div>
              </div>

              <div className="w-16 h-4 bg-gray-600 rounded" />
            </div>
          ))}
          <div className="w-full h-8 bg-gray-600 rounded" />

        </div>
      ) : (
        <div className="flex flex-col gap-1 px-3 pb-3 mt-1">
          <div className="flex border-b border-white/10">
            {infoPool?.dmlList?.filter((opt: any) => opt?.isActive)?.map((option: any, idx: number) => (
              <button
                key={option?.tokenAddress}
                onClick={() => setActiveTab(idx)}
                style={{
                  background: activeTab === idx
                    ? "linear-gradient(180deg, rgba(144, 117, 254, 0) 0%, rgba(144, 117, 254, 0.15) 100%)"
                    : "",
                }}
                className={`w-1/2 py-2 flex items-center justify-center gap-2 text-sm  ${activeTab === idx
                  ? 'text-white border-b border-primary_300'
                  : 'text-white/60'
                  }`}
              >
                {option?.symbol}
                <TokenIcon token={option?.symbol} w={16} h={16} />
              </button>
            ))}
          </div>

          <div className="pt-2"
          >
            <p className="flex justify-between text-sm text-white/70 mb-1">
              <span className="text-primary_300">TVL:</span>
              <span className="text-white font-bold"><FormatNumber number={activeOption?.tvl || 0} /></span>
            </p>
            <p className="flex justify-between text-sm text-white/70">
              <span className="text-primary_300">Last Sale:</span>
              <span className="text-white font-bold"><FormatNumber number={activeOption?.lastSale || 0} /></span>
            </p>
          </div>

          <Button third className="mt-4 w-full h-10">
            <Link
              href={
                type === "add"
                  ? collectionData.type === "erc1155"
                    ? `/add/${collectionData.nftAddress}/${activeOption?.tokenAddress}/${collectionData.nftID}`
                    : `/trade/erc721/${collectionData.nftAddress}/${activeOption?.tokenAddress}?tab=pool`
                  : collectionData.type === "erc1155"
                    ? `/trade/erc1155/${collectionData.nftAddress}/${activeOption?.tokenAddress}/${collectionData.nftID}`
                    : `/trade/erc721/${collectionData.nftAddress}/${activeOption?.tokenAddress}`
              }
              className="w-full flex justify-center whitespace-pre items-center text-primary_300 gap-x-2"
            >
              Pool Details
              <RightIcon width={20} height={20} />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );


  return (
    <section className="bg-shader_700 p-4 w-full">
      {collectionData &&
        <div className="justify-between  3xl:flex gap-2">
          <div className="text-xs ">
            <div className="flex gap-x-1">
              <div
                className={`relative rounded-full w-fit h-fit group ${collectionData?.collaborators?.includes(account) && "cursor-pointer"
                  }`}
              >
                <div
                  className={` w-16 h-16 rounded-xl overflow-hidden ${collectionData?.collaborators?.includes(account) &&
                    "group-hover:brightness-[0.8]"
                    }`}
                >
                  <MediaCollection avatar={formatLinkIPFS(collectionData?.avatar)} />
                </div>
                {collectionData?.collaborators?.includes(account) && (
                  <div>
                    {avatarLoading ? (
                      <div className="absolute top-0 bottom-0 z-10 flex items-center justify-center w-full h-full rounded-xl bg-slate-600/[.7]">
                        <BiLoaderAlt className="text-4xl text-white animate-spin" />
                      </div>
                    ) : (
                      <div
                        className="absolute top-0 left-0 flex-col items-center justify-center hidden w-full h-full text-white rounded-xl group-hover:flex"
                        onClick={() => {
                          if (inputAvatar.current) {
                            (inputAvatar.current as HTMLInputElement).click();
                          }
                        }}
                      >
                        <EditIcon width={16} height={16} />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={inputAvatar}
                  accept="image/png,image/jpeg,image/gif"
                  hidden
                  onChange={async (e) => {
                    if (e.target.files) {
                      const file = e.target.files[0];
                      if (file && file.size < 10485760) {
                        handleUploadAvatar(file);
                      } else {
                        toast.error("Oversize");
                      }
                    }
                  }}
                />
              </div>
              <div className="flex flex-col mt-4 font-bold lg:mt-0 ">
                <div className="flex items-center ">
                  <div className="flex items-center text-lg font-bold title whitespace-nowrap gap-x-1">
                    {/* <LogoIconCard chainId={chainId} /> */}
                    {collectionData?.name}
                    {collectionData?.isVerified && (
                      <TickSuccessIcon width={20} height={19} />
                    )}
                    {/* <Button
                    third
                    className="flex items-center px-3 h-[28px] text-sm gap-x-1"
                  >
                    Royalties {formatNumber((collectionData?.royalty / 10000).toString())}
                    %
                  </Button> */}
                    {collectionData?.collaborators?.includes(account) &&
                      collectionData?.dmlAddress && (
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button secondary className="px-[6px] h-[28px]">
                              <EditIcon
                                width={16}
                                height={16}
                                className="text-blue"
                              />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
                            <DialogDescription>
                              <ModalRoyalty
                                data={data}
                                onSuccess={handleDialogClose}
                              />
                            </DialogDescription>
                          </DialogContent>
                        </Dialog>
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-x-1 my-2 font-semibold">
                  {collectionData?.creatorAddress ? (
                    <Fragment>
                      <span className="text-sm text-shader_100">Created by</span>
                      <span className="text-sm text-primary_300">
                        {briefDocument(collectionData?.creatorAddress, 8, 6)}
                      </span>
                      <Copy content={collectionData?.creatorAddress} />
                    </Fragment>
                  ) : (
                    <p>--</p>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              {/* <ShowMoreText
              lines={1}
              more="See more"
              less="See less"
              className="text-white text-sm font-normal w-full my-2"
              anchorClass="show-more-less-clickable"
              expanded={false}
              truncatedEndingComponent={"... "}
            >
              {collectionData?.description}
            </ShowMoreText> */}
              <div className="flex items-center gap-x-2 my-2">
                {collectionData?.collaborators?.includes(account) && (
                  <Link href={`/edit/${collectionAddress}`}>
                    <Button
                      primary
                      className="flex h-8 px-3 text-sm font-bold gap-x-2"
                    >
                      Edit
                      <EditIcon width={16} height={16} />
                    </Button>
                  </Link>
                )}
                {collectionData?.type === "erc721" && (
                  <div className="flex gap-x-2 text-white text-sm relative" ref={dropdownRef}>
                    <div className="relative w-full">


                      <div className="flex flex-col gap-2 md:flex-row w-full">
                        <div className="relative w-full md:w-1/2">
                          <Button
                            className="flex items-center w-full lg:py-3 py-2 border gap-x-2 border-shader_400 bg-shader_500 hover:bg-shader_400"
                            onClick={() => setDropdownType(dropdownType === "add" ? null : "add")}
                          >
                            <PlusIcon width={20} height={20} />
                            <p>Add</p>
                          </Button>
                        </div>

                        <div className="relative w-full md:w-1/2">
                          <Button
                            className="flex items-center w-full lg:py-3 py-2 gap-x-2 hover:bg-primary_600 bg-primary_500 border border-shader_400"
                            onClick={() => setDropdownType(dropdownType === "swap" ? null : "swap")}
                          >
                            <SwapIcon width={20} height={20} className="fill-shader_700" />
                            <p>Swap</p>
                          </Button>
                        </div>
                      </div>

                      {dropdownType && renderDropdown(dropdownType)}

                    </div>
                  </div>
                )}
                <p className="w-[1px] h-4 bg-shader_400"></p>
                <div className="flex items-center gap-x-2">
                  {collectionData?.dmlAddress && (
                    <Link
                      href={`${demask.urltxHash}address/${collectionData?.dmlAddress}`}
                      target="_blank"
                    >
                      <TokenIcon token={""} w={18} h={18} />
                    </Link>
                  )}
                  {socialIcons.map(
                    ({ url, Icon }, index) =>
                      url && (
                        <Link key={index} href={url} target="_blank" className="">
                          <Icon width={18} height={18} />
                        </Link>
                      )
                  )}
                  <SeeMoreIcon />
                </div>
              </div>
            </div>
          </div>
          <div className="flex  mt-4 overflow-auto font-semibold text-white rounded-lg lg:overflow-visible gap-x-10 lg:mt-0">
            {collectionData?.type && (
              <div className="">
                <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                  Floor price
                </p>
                <div className="flex items-center text-lg font-bold gap-x-1">
                  <FormatNumber number={collectionData?.floorPrice?.floorPrice || 0} />
                  <TokenIcon token={""} w={16} h={16} />
                </div>
              </div>
            )}
            <div className="">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                Total Volume
              </p>
              <div className="flex items-center text-lg font-bold gap-x-1">
                <FormatNumber number={collectionData?.volume || 0} />
                <TokenIcon token={""} w={16} h={16} />
              </div>
            </div>
            <div className="">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                TVL
              </p>
              <div className="flex items-center text-lg font-bold gap-x-1">
                <FormatNumber
                  number={(+collectionData?.totalReserveToken || 0 * 2).toString() || "0"}
                />
                <TokenIcon token={""} w={16} h={16} />
              </div>
            </div>
            <div className="">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                Standard
              </p>
              <div className="flex items-center text-lg font-bold gap-x-1 whitespace-nowrap">
                {collectionData?.type ? <p>{formatTypeChain(collectionData?.type)}</p> : <p>--</p>}
              </div>
            </div>
            <div className=" gird">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                Pool
              </p>
              <div className="flex items-center text-lg font-bold ">
                <FormatNumber number={collectionData?.totalReserveNFT || "0"} />/
                <div className="flex items-center text-lg font-bold gap-x-1">
                  <FormatNumber number={collectionData?.totalReserveToken || 0} />
                  <TokenIcon token={""} w={16} h={16} />
                </div>
              </div>
            </div>
            <div className="">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                Supply
              </p>
              <div className="flex items-center text-lg font-bold ">
                <FormatNumber number={collectionData?.totalSupply || "0"} />
              </div>
            </div>

            <div className="">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                Owners
              </p>
              <div className="flex items-center text-lg font-bold ">
                <FormatNumber number={collectionData?.countOwner || 0} />
              </div>
            </div>
            <div className="">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                Chain
              </p>
              <div className="flex items-center text-lg font-bold ">Monad</div>
            </div>
          </div>
        </div>
      }
    </section>
  );
};

export default CollectionDetail;
