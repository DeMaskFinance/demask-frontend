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
import { nftsUserService } from "@/libs/service/profileService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import DetailERC721 from "../ERC721/DetailERC721";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { collectionDetail } from "@/libs/service/collectionService";

export default function CreatedCollection() {
  const { account, chainId, demask } = useContext(AccountContext);
  const [typeERC, setTypeERC] = useQueryParam(
    "typeERC",
    withDefault(StringParam, "")
  );
  const collectionAddress = useRouter().query.created;
  const { ref, inView } = useInView();
  // const fetchDataNFTs = async (
  //   typeERC: string,
  //   collectionAddress: string,
  //   chain: string | string[],
  //   pageParam = 1
  // ) => {
  //   const data = await collectionDetail(
  //     collectionAddress,
  //     chain,
  //     pageParam,
  //     10
  //   );
  //   return data.data;
  // };

  // const {
  //   data,
  //   fetchNextPage,
  //   isFetchingNextPage,
  //   isSuccess,
  //   isLoading,
  //   isFetching,
  // } = useInfiniteQuery(
  //   ["NFTsUser", chainId, collectionAddress, typeERC],
  //   ({ pageParam = 1 }) =>
  //     fetchDataNFTs(typeERC, collectionAddress, chainId, pageParam),
  //   {
  //     getNextPageParam: (page) =>
  //       page?.currentPage === page?.totalPages
  //         ? undefined
  //         : page?.currentPage + 1,
  //   }
  // );
  // useEffect(() => {
  //   if (inView) {
  //     fetchNextPage();
  //   }
  // }, [inView]);
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => {
      if (collectionAddress) {
        const res = await collectionDetail(collectionAddress, chainId);
        return res.data;
      }
    },
  });
  console.log(data);

  return (
    <div className="pb-6 min-h-[75vh] max-w-[1440px] mx-auto flex flex-col gap-y-6 mb-[100px]">
      <div className="h-[120px] lg:h-[240px]">
        <div className="w-full h-full bg-dark4 rounded-b-lg group-hover:brightness-[0.8]"></div>
      </div>
      <section className="justify-between p-4 rounded-lg lg:flex bg-dark5">
        <div className="items-center text-xs lg:flex gap-x-6 ">
          <div className="h-[120px] w-[120px]">
            <Image
              src="/images/test.png"
              width={620}
              height={620}
              className="object-cover w-full h-full rounded-lg"
              alt="1"
            />
          </div>
          <div className="lg:max-w-[45%] mt-4 lg:mt-0">
            <div className="flex items-center gap-x-2">
              <p className="text-2xl font-semibold">123</p>
              <Link href="/edit/123">
                <EditIcon width={24} height={24} className="fill-dark3" />
              </Link>
            </div>
            <p className="text-xs">
              {data.description}
            </p>

            <div className="flex justify-between mt-4 gap-x-10">
              <div className="flex gap-x-2">
                <Link href="/">
                  <WebsiteIcon width={24} height={24} />
                </Link>
                <Link href="/">
                  <TwitterIcon width={24} height={24} />
                </Link>
              </div>
              <div className="flex gap-x-6">
                <p className="px-2 py-1 rounded-full bg-dark4">ERC 1155</p>
                <LogoIconCard chainId={chainId} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex self-center mt-4 overflow-auto rounded-lg lg:overflow-visible lg:p-4 lg:gap-x-20 gap-x-10 lg:mt-0">
          <div className="text-dark2">
            <p className="mb-1 text-sm whitespace-nowrap">Total Volume</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
              <EtherIcon width={16} height={16} className="fill-dark2" />
            </div>
          </div>
          <div className="text-dark2">
            <p className="mb-1 text-sm whitespace-nowrap">Total Sale</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
              <EtherIcon width={16} height={16} className="fill-dark2" />
            </div>
          </div>
          <div className="text-dark2 gird">
            <p className="mb-1 text-sm whitespace-nowrap">Listed/Supply</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
            </div>
          </div>
          <div className="text-dark2">
            <p className="mb-1 text-sm whitespace-nowrap">Owner</p>
            <div className="flex items-center text-xl font-semibold ">
              <FormatNumber number={"1245"} />
            </div>
          </div>
        </div>
      </section>
      {/* {typeERC === 'erc721' ? (
        <DetailERC721 />
      ) : (
        <ItemList isLoading={isLoading} isSuccess={isSuccess} data={data} />
      )} */}
      {/* <ItemList isLoading={isLoading} isSuccess={isSuccess} data={data} /> */}
      <div ref={ref} style={{ height: "1px" }}></div>
    </div>
  );
}
