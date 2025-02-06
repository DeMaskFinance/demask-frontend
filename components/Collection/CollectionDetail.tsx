import FormatNumber from "@/components/Common/FormatNumber";
import {
  EditIcon,
  EtherIcon,
  FacebookIcon,
  PlusIcon,
  SeeMoreIcon,
  SwapIcon,
  TeleIcon,
  TickSuccessIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import { LogoIconCard } from "@/components/Logo/Logo";
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
import formatNumber from "@/libs/utils/formatNumer";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { Fragment, useContext, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import ShowMoreText from "react-show-more-text";
import { Button } from "../Buttons";
import Copy from "../Common/Copy";
import { MediaCollection } from "../Common/Media";
import ModalRoyalty from "../Modal/ModalRoyalty";
import { toast } from "sonner";
interface CollectionDetailProps {
  collectionAddress: string;
}
const CollectionDetail: React.FunctionComponent<CollectionDetailProps> = ({
  collectionAddress,
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
  const socialIcons = [
    { url: data?.socials?.website, Icon: WebsiteIcon },
    { url: data?.socials?.twitter, Icon: TwitterIcon },
    { url: data?.socials?.facebook, Icon: FacebookIcon },
    { url: data?.socials?.telegram, Icon: TeleIcon },
  ];

  return (
    <section className="bg-shader_700 p-4 w-full">
      <div className="justify-between  3xl:flex gap-2">
        <div className="text-xs ">
          <div className="flex gap-x-1">
            <div
              className={`relative rounded-full w-fit h-fit group ${data?.collaborators.includes(account) && "cursor-pointer"
                }`}
            >
              <div
                className={` w-16 h-16 rounded-xl overflow-hidden ${data?.collaborators.includes(account) &&
                  "group-hover:brightness-[0.8]"
                  }`}
              >
                <MediaCollection avatar={formatLinkIPFS(data?.avatar)} />
              </div>
              {data?.collaborators.includes(account) && (
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
                      <p className="text-xs">64px x 64px</p>
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
                  <LogoIconCard chainId={chainId} />
                  {data?.name}
                  {data?.isVerified && (
                    <TickSuccessIcon width={20} height={19} />
                  )}
                  <Button
                    third
                    className="flex items-center px-3 h-[28px] text-sm gap-x-1"
                  >
                    Royalties {formatNumber((data?.royalty / 10000).toString())}
                    %
                  </Button>
                  {data?.collaborators.includes(account) &&
                    data?.dmlAddress && (
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
                {data?.creatorAddress ? (
                  <Fragment>
                    <span className="text-sm text-shader_100">Created by</span>
                    <span className="text-sm text-primary_300">
                      {briefDocument(data.creatorAddress, 8, 6)}
                    </span>
                    <Copy content={data.creatorAddress} />
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
              {data?.description}
            </ShowMoreText> */}
            <div className="flex items-center gap-x-2 mb-2">
              {data?.collaborators.includes(account) && (
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
              {data?.type === "erc721" && (
                <div className="flex gap-x-2 text-white text-sm">
                  <Link
                    href={`/trade/erc721/${collectionAddress}?tab=pool`}
                    className="basis-1/2"
                  >
                    <Button className="flex items-center w-full h-10 border gap-x-2 border-shader_400 bg-shader_500 hover:bg-shader_400 px-4 ">
                      <PlusIcon width={20} height={20} />
                      <p>Add</p>
                    </Button>
                  </Link>
                  <Link
                    href={`/trade/erc721/${collectionAddress}`}
                    className="basis-1/2"
                  >
                    <Button
                      className="flex items-center w-full h-10 gap-x-2 px-4"
                      primary
                    >
                      <SwapIcon
                        width={20}
                        height={20}
                        className="fill-shader_700"
                      />
                      <p>Swap</p>
                    </Button>
                  </Link>
                </div>
              )}
              <p className="w-[1px] h-4 bg-shader_400"></p>
              <div className="flex items-center gap-x-2">
                {data?.dmlAddress && (
                  <Link
                    href={`${demask.urltxHash}address/${data.dmlAddress}`}
                    target="_blank"
                  >
                    <LogoIconCard chainId={chainId} width={18} height={18} />
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
          {data?.type && (
            <div className="">
              <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
                Floor price
              </p>
              <div className="flex items-center text-lg font-bold gap-x-1">
                <FormatNumber number={data?.floorPrice || 0} />
                <EtherIcon width={16} height={16} />
              </div>
            </div>
          )}
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Total Volume
            </p>
            <div className="flex items-center text-lg font-bold gap-x-1">
              <FormatNumber number={data?.volume || 0} />
              <EtherIcon width={16} height={16} />
            </div>
          </div>
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              TVL
            </p>
            <div className="flex items-center text-lg font-bold gap-x-1">
              <FormatNumber
                number={(+data?.reserveToken || 0 * 2).toString() || "0"}
              />
              <EtherIcon width={16} height={16} />
            </div>
          </div>
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Standard
            </p>
            <div className="flex items-center text-lg font-bold gap-x-1 whitespace-nowrap">
              {data?.type ? <p>{formatTypeChain(data?.type)}</p> : <p>--</p>}
            </div>
          </div>
          <div className=" gird">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Pool
            </p>
            <div className="flex items-center text-lg font-bold ">
              <FormatNumber number={data?.countNFTsInPool || "0"} />/
              <div className="flex items-center text-lg font-bold gap-x-1">
                <FormatNumber number={data?.reserveToken || 0} />
                <EtherIcon width={16} height={16} />
              </div>
            </div>
          </div>
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Supply
            </p>
            <div className="flex items-center text-lg font-bold ">
              <FormatNumber number={data?.totalSupply || "0"} />
            </div>
          </div>

          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Owners
            </p>
            <div className="flex items-center text-lg font-bold ">
              <FormatNumber number={data?.countOwner || 0} />
            </div>
          </div>
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Chain
            </p>
            <div className="flex items-center text-lg font-bold ">Ethereum</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionDetail;
