import FormatNumber from "@/components/Common/FormatNumber";
import {
  EditIcon,
  EtherIcon,
  EyeIcon,
  SeeMoreIcon,
  StarIcon,
  TickSuccessIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import { LogoIconCard } from "@/components/Logo/Logo";
import { ItemList } from "@/components/Profile/Inventory/Items";
import AccountContext from "@/context/AccountContext";
import * as collectionService from "@/libs/service/collectionService";
import {
  collectionDetail,
  collectionListERC1155,
} from "@/libs/service/collectionService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useContext, useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { Button } from "../Buttons";
import DetailERC721 from "../ERC721/DetailERC721";
import ModalRoyalty from "../Modal/ModalRoyalty";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  briefDocument,
  formatLinkIPFS,
  formatTypeChain,
} from "@/libs/utils/formatComon";
import Classify from "../Profile/Inventory/Classify";
import Copy from "../Common/Copy";
export default function DetailCollection() {
  const { account, chainId, demask } = useContext(AccountContext);
  const [isOpenRoyalty, setIsOpenRoyalty] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const inputAvatar = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [searchCollection, setSearchCollection] = useState<string>("");
  const [typeERC, setTypeERC] = useQueryParam(
    "typeERC",
    withDefault(StringParam, "")
  );
  const collectionAddress = useRouter().query.collection || "";
  const fetchDataNFTs = async (
    typeERC: string,
    collectionAddress: string | string[],
    chain: string | string[],
    pageParam = 1
  ) => {
    const data = await collectionListERC1155(
      typeERC,
      collectionAddress,
      chain,
      pageParam,
      10
    );
    return data.data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["NFTsUser", chainId, collectionAddress, typeERC],
    ({ pageParam = 1 }) =>
      fetchDataNFTs(typeERC, collectionAddress, chainId, pageParam),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  const {
    data: dataDetail,
    isLoading: isLoadingDetail,
    isSuccess: isSuccessDetail,
    refetch,
  } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => {
      if (collectionAddress) {
        const res = await collectionDetail(collectionAddress, chainId);
        return res.data;
      }
    },
  });

  const handleUploadAvatar = async (file: any) => {
    try {
      setAvatarLoading(true);
      const res = await collectionService.uploadFileCollection({
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
  console.log(dataDetail);

  return (
    <div className="pb-6 min-h-[94vh] mx-auto lg:mb-0 ">
      <section className="justify-between p-4 lg:flex bg-shader_700 gap-x-10 3xl:gap-x-80">
        <div className=" text-xs lg:flex gap-x-1 ">
          <div
            className={`relative rounded-full w-fit h-fit group ${
              dataDetail?.collaborators.includes(account) && "cursor-pointer"
            }`}
          >
            <div
              className={` w-16 h-16 ${
                dataDetail?.collaborators.includes(account) &&
                "group-hover:brightness-[0.8]"
              }`}
            >
              {dataDetail?.avatar ? (
                <Image
                  src={formatLinkIPFS(dataDetail?.avatar)}
                  alt="banner"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full rounded-xl "
                />
              ) : (
                <Image
                  src="/Placeholder.png"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full rounded-xl"
                  alt="1"
                />
              )}
            </div>
            {dataDetail?.collaborators.includes(account) && (
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
                    console.log("Oversize");
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-col mt-4 font-bold lg:mt-0 ">
            <div className="flex items-center ">
              <div className="flex items-center text-lg font-bold title whitespace-nowrap gap-x-1">
                <LogoIconCard chainId={chainId} />
                {dataDetail?.name}
                <TickSuccessIcon width={20} height={19} />
                <Button
                  secondary
                  className="flex items-center px-3 py-1 gap-x-1"
                >
                  <StarIcon width={16} height={16} />
                  Royalties {dataDetail?.royalty}%
                </Button>
                {dataDetail?.collaborators.includes(account) &&
                  dataDetail?.dmlAddress && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          secondary
                          className="px-[6px] h-[28px]"
                          onClick={() => {
                            document.body.style.overflowY = "hidden";
                            setIsOpenRoyalty(true);
                          }}
                        >
                          <EditIcon
                            width={16}
                            height={16}
                            className="text-blue"
                          />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full bg-shader_800 border border-shader_500 p-4">
                        <DialogHeader>
                          <DialogDescription>
                            <ModalRoyalty dmlAddress={dataDetail.dmlAddress} />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  )}
              </div>
            </div>
            <div className="flex items-center gap-x-1 my-[10px] font-semibold">
              {dataDetail?.creatorAddress ? (
                <Fragment>
                  <span className="text-sm  text-shader_100">Created by</span>
                  <span className="text-primary_300 text-sm">
                    {briefDocument(dataDetail.creatorAddress, 8, 6)}
                  </span>
                  <Copy content={dataDetail.creatorAddress} />
                </Fragment>
              ) : (
                <p>--</p>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              {dataDetail?.collaborators.includes(account) && (
                <Link
                  href={`/edit/${collectionAddress}?chain=${chainId}&type=${typeERC}`}
                >
                  <Button
                    primary
                    className="flex h-8 px-3 text-sm font-bold gap-x-2"
                  >
                    Edit
                    <EditIcon width={16} height={16} />
                  </Button>
                </Link>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="flex h-8 px-3 text-sm font-bold gap-x-2"
                    third
                  >
                    Description
                    <EyeIcon width={16} height={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[425px] bg-shader_800 border border-shader_500 p-4">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold text-white">
                      Description
                    </DialogTitle>
                    <DialogDescription>
                      <div className="flex gap-x-2 mt-4 mb-2">
                        <LogoIconCard
                          chainId={chainId}
                          width={24}
                          height={24}
                        />
                        <Button
                          third
                          className="!rounded-full text-primary_300 text-xs"
                        >
                          {formatTypeChain(dataDetail?.type)}
                        </Button>
                      </div>
                      <p className="font-semibold text-primary_400">
                        Joined {dataDetail?.createdAt}
                      </p>
                      <p className="mt-1 text-shader_200">
                        {dataDetail?.description
                          ? dataDetail.description
                          : "No data"}
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <p className="w-[1px] h-4 bg-shader_400"></p>
              <div className="flex gap-x-2">
                {dataDetail?.socials?.website && (
                  <Link
                    href={dataDetail.socials?.website}
                    target="_blank"
                    className="mr-3"
                  >
                    <WebsiteIcon width={18} height={18} />
                  </Link>
                )}
                {dataDetail?.socials?.twitter && (
                  <Link
                    href={dataDetail.socials?.twitter}
                    target="_blank"
                    className="mr-3"
                  >
                    <TwitterIcon width={18} height={18} />
                  </Link>
                )}
                <SeeMoreIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="flex self-center mt-4 overflow-auto text-white rounded-lg lg:overflow-visible lg:gap-x-14 gap-x-10 lg:mt-0 font-semibold">
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Total Volume
            </p>
            <div className="flex items-center text-lg font-bold gap-x-1">
              <FormatNumber number={dataDetail?.volume} />
              <EtherIcon width={16} height={16} />
            </div>
          </div>
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Total Sale
            </p>
            <div className="flex items-center text-lg font-bold gap-x-1">
              {dataDetail?.totalSale ? (
                <FormatNumber number={dataDetail?.totalSale} />
              ) : (
                0
              )}
              <EtherIcon width={16} height={16} />
            </div>
          </div>
          <div className=" gird">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Listed/Supply
            </p>
            <div className="flex items-center text-lg font-bold ">
              <FormatNumber number={dataDetail?.countNFTsInPool} />/
              <FormatNumber number={dataDetail?.totalSupply} />
            </div>
          </div>
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Owner
            </p>
            <div className="flex items-center text-lg font-bold ">
              <FormatNumber number={dataDetail?.countOwner} />
            </div>
          </div>
          <div className="">
            <p className="mb-1 text-sm whitespace-nowrap text-shader_200">
              Chain
            </p>
            <div className="flex items-center text-lg font-bold ">Ethereum</div>
          </div>
        </div>
      </section>
      <div className="px-4 pt-4">
        <Classify
          setIsFilter={setIsFilter}
          isFilter={isFilter}
          setSearchCollection={setSearchCollection}
        />
        {typeERC === "erc721" ? (
          // <DetailERC721
          //   isLoading={isLoadingDetail}
          //   isSuccess={isSuccessDetail}
          //   data={dataDetail}
          // />
          <div>123</div>
        ) : (
          <ItemList
            isLoading={isLoading}
            isSuccess={isSuccess}
            isFetching={isFetching}
            data={data}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </div>
    </div>
  );
}
