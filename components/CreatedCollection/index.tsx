import FormatNumber from "@/components/Common/FormatNumber";
import {
  EditIcon,
  EtherIcon,
  TwitterIcon,
  WebsiteIcon,
} from "@/components/Icons";
import { LogoIconCard } from "@/components/Logo/Logo";
import { ItemList } from "@/components/Profile/Inventory/Items";
import AccountContext from "@/context/AccountContext";
import {
  collectionDetail,
  collectionListERC1155,
} from "@/libs/service/collectionService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import DetailERC721 from "../ERC721/DetailERC721";
import * as collectionService from "@/libs/service/collectionService";
import { BiLoaderAlt } from "react-icons/bi";
export default function CreatedCollection() {
  const { account, chainId, demask } = useContext(AccountContext);
  const inputAvatar = useRef(null);
  const inputBanner = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
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
  const handleUploadBanner = async (file: any) => {
    try {
      setBannerLoading(true);
      const res = await collectionService.uploadFileCollection({
        banner: file,
        chainId,
        collectionAddress,
      });
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setBannerLoading(false);
    }
  };
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

  return (
    <div className="pb-6 min-h-[75vh] mx-auto flex flex-col gap-y-6 mb-[100px] lg:mb-0 ">
      <div
        className={`relative group h-[120px] lg:h-[240px] ${
          dataDetail?.collaborators.includes(account) && "cursor-pointer"
        }`}
      >
        {dataDetail?.banner ? (
          <Image
            src={dataDetail?.banner}
            alt="banner"
            width={1200}
            height={400}
            className={`w-full h-full object-cover ${
              dataDetail?.collaborators.includes(account) &&
              "group-hover:brightness-[0.8]"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-dark4 "></div>
        )}
        {dataDetail?.collaborators.includes(account) && (
          <div>
            {bannerLoading ? (
              <div className="absolute top-0 bottom-0 flex items-center justify-center w-full h-full bg-slate-600/[.7]">
                <BiLoaderAlt className="text-5xl text-white animate-spin" />
              </div>
            ) : (
              <div
                className="absolute top-0 left-0 flex-col items-center justify-center hidden w-full h-full text-white rounded-full group-hover:flex"
                onClick={() => {
                  if (inputBanner.current) {
                    (inputBanner.current as HTMLInputElement).click();
                  }
                }}
              >
                <EditIcon width={30} height={30} />
                <p className="text-xs">1200 x 400 Recommended</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-4 lg:px-14 xl:px-[164px] md:px-10">
        <section className="justify-between p-4 mb-6 rounded-lg lg:flex bg-dark5 ">
          <div className="items-center text-xs lg:flex gap-x-2 ">
            <div
              className={`relative rounded-full w-fit h-fit group ${
                dataDetail?.collaborators.includes(account) && "cursor-pointer"
              }`}
            >
              <div
                className={`${
                  dataDetail?.collaborators.includes(account) &&
                  "group-hover:brightness-[0.8]"
                }`}
              >
                {dataDetail?.avatar ? (
                  <Image
                    src={dataDetail?.avatar}
                    alt="banner"
                    width={600}
                    height={600}
                    className="object-cover rounded-lg w-[120px] h-[120px]"
                  />
                ) : (
                  <Image
                    src="/Placeholder.png"
                    width={120}
                    height={120}
                    className="object-cover w-full h-full rounded-lg"
                    alt="1"
                  />
                )}
              </div>
              {dataDetail?.collaborators.includes(account) && (
                <div>
                  {avatarLoading ? (
                    <div className="absolute top-0 bottom-0 z-10 flex items-center justify-center w-full h-full rounded-lg bg-slate-600/[.7]">
                      <BiLoaderAlt className="text-4xl text-white animate-spin" />
                    </div>
                  ) : (
                    <div
                      className="absolute top-0 left-0 flex-col items-center justify-center hidden w-full h-full text-white rounded-lg group-hover:flex"
                      onClick={() => {
                        if (inputAvatar.current) {
                          (inputAvatar.current as HTMLInputElement).click();
                        }
                      }}
                    >
                      <EditIcon width={24} height={24} />
                      <p className="text-xs">600 x 600px</p>
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
                className="hidden"
              />
            </div>
            <div>
              <input
                type="file"
                ref={inputBanner}
                accept="image/png,image/jpeg,image/gif"
                onChange={async (e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    if (file && file.size < 10485760) {
                      handleUploadBanner(file);
                    } else {
                      console.log("Oversize");
                    }
                  }
                }}
                className="hidden"
              />
            </div>
            <div className="lg:max-w-[45%] mt-4 lg:mt-0">
              <div className="flex items-center gap-x-2">
                <p className="text-2xl font-semibold whitespace-nowrap">
                  {dataDetail?.name}
                </p>
                {dataDetail?.collaborators.includes(account) && (
                  <Link href={`/edit/${collectionAddress}?chain=${chainId}`}>
                    <EditIcon width={24} height={24} className="fill-dark3" />
                  </Link>
                )}
              </div>
              <p className="text-xs">{dataDetail?.description}</p>
              <div className="flex mt-4">
                <div className="flex gap-x-2">
                  {dataDetail?.socials?.website && (
                    <Link
                      href={dataDetail.socials?.website}
                      target="_blank"
                      className="mr-3"
                    >
                      <WebsiteIcon width={24} height={24} />
                    </Link>
                  )}
                  {dataDetail?.socials?.twitter && (
                    <Link
                      href={dataDetail.socials?.twitter}
                      target="_blank"
                      className="mr-3"
                    >
                      <TwitterIcon width={24} height={24} />
                    </Link>
                  )}
                </div>
                <div className="flex gap-x-6">
                  <p className="px-2 py-1 uppercase rounded-full bg-dark4 whitespace-nowrap">
                    {dataDetail?.type}
                  </p>
                  <LogoIconCard chainId={chainId} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex self-center mt-4 overflow-auto rounded-lg lg:overflow-visible lg:p-4 lg:gap-x-20 gap-x-10 lg:mt-0">
            <div className="text-dark2">
              <p className="mb-1 text-sm whitespace-nowrap">Total Volume</p>
              <div className="flex items-center text-xl font-semibold ">
                <FormatNumber number={dataDetail?.volume} />
                <EtherIcon width={16} height={16} className="fill-dark2" />
              </div>
            </div>
            <div className="text-dark2">
              <p className="mb-1 text-sm whitespace-nowrap">Total Sale</p>
              <div className="flex items-center text-xl font-semibold ">
                <FormatNumber number={dataDetail?.totalSale} />
                <EtherIcon width={16} height={16} className="fill-dark2" />
              </div>
            </div>
            <div className="text-dark2 gird">
              <p className="mb-1 text-sm whitespace-nowrap">Listed/Supply</p>
              <div className="flex items-center text-xl font-semibold ">
                <FormatNumber
                  number={dataDetail?.countNFTsInPool}
                />/
                <FormatNumber
                  number={dataDetail?.totalSupply}
                />
              </div>
            </div>
            <div className="text-dark2">
              <p className="mb-1 text-sm whitespace-nowrap">Owner</p>
              <div className="flex items-center text-xl font-semibold ">
                <FormatNumber number={dataDetail?.countOwner} />
              </div>
            </div>
          </div>
        </section>
        {typeERC === "erc721" ? (
          <DetailERC721
            isLoading={isLoadingDetail}
            isSuccess={isSuccessDetail}
            data={dataDetail}
          />
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
