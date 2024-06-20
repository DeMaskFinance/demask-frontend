import MediaNFT from "@/components/Common/Media/MediaNFT";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { checkIsERC1155Service } from "@/libs/service/checkIsERC1155";
import {
  searchCollectionService,
  searchNFTService,
} from "@/libs/service/searchService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import TopCollection from "./TopCollection";

const ModalSearchCollection = () => {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState("");
  let debouncedCollection = useDebounce(nftAddress);
  const router = useRouter();
  const { chainId, demask } = useContext(AccountContext);

  const { isLoading, data, isFetching, isSuccess } = useQuery({
    queryKey: ["checkNFT", debouncedCollection, chainId],
    queryFn: async () => {
      const res = await checkIsERC1155Service(
        debouncedCollection.toLowerCase(),
        chainId
      );
      return res;
    },
  });
  const {
    isLoading: isLoadingNFT,
    data: dataNFT,
    isFetching: isFetchingNFT,
    isSuccess: isSuccessNFT,
  } = useQuery({
    queryKey: ["searchCollection", debouncedCollection, chainId],
    queryFn: async () => {
      const res = await searchCollectionService(
        chainId,
        debouncedCollection.toLowerCase()
      );
      return res;
    },
  });
  const { currency } = router.query;
  const { slug } = router.query;
  let newURL = "";
  const handleChangeRouteNFT = () => {
    if (currency) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(currency[0], debouncedCollection)
        .replace(currency[2], idNFT);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(slug[0], debouncedCollection)
        .replace(slug[2], idNFT);
      router.push(newURL);
    }
    setNftAddress("");
    setIdNFT("");
    router.push(newURL);
  };
  const handleSelectCollection = (item: any) => {
    item.type === "erc1155"
      ? router.replace(
          `/add/${item.nftAddress}/${demask.NATIVE_ADDRESS}/${item.nftID}`
        )
      : router.replace(`/swap/type/${item.nftAddress}&tab=pool`);
  };

  return (
    <div className="h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg px-4 pb-4 relative min-h-[45vh] overflow-scroll">
      <div className="flex items-center justify-between">
        <p className="py-2 mb-4 title">Select a Collection</p>
      </div>
      <div>
        <div className="relative mb-4">
          <input
            className="input_item"
            placeholder="Search address or paste address"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
          />
          {isLoading && (
            <div className="absolute top-[50%] right-2 -translate-y-1/2">
              <BiLoaderAlt className="animate-spin text-primary_400" />
            </div>
          )}
        </div>
        <ul className={`${debouncedCollection ? "hidden" : "block"}`}>
          <li
            className="flex items-center font-semibold text-white cursor-pointer gap-x-2 group "
            onClick={() => setNftAddress(demask.CREATOR)}
          >
            <span>
              <Image
                src="/logoDefault.png"
                alt="logo"
                width={24}
                height={24}
                className="object-cover w-6 h-auto"
              />
            </span>
            <span>DEMASK CREATOR</span>
          </li>
        </ul>
        <div className={`${debouncedCollection ? "hidden" : "block"} `}>
          <div>
            <TopCollection />
          </div>
        </div>
        {data?.status === true && debouncedCollection && (
          <input
            className="input_item"
            placeholder="Address id or paste id"
            value={idNFT}
            onChange={(e) => setIdNFT(e.target.value)}
          />
        )}
        {data?.status === false && debouncedCollection && (
          <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalPayment">
            Your NFT address must be an ERC1155
          </p>
        )}
      </div>
      {isSuccessNFT && dataNFT[0]?.metadata && (
        <div
          className="flex items-center rounded-lg cursor-pointer hover:bg-shader_500 group gap-x-2"
          onClick={handleChangeRouteNFT}
        >
          <div className="w-8 h-8 overflow-hidden rounded-lg">
            <MediaNFT data={dataNFT[0]} isControls={false} />
          </div>
          <div>
            <h2 className="font-medium group-hover:text-primary_400">
              {dataNFT[0]?.metadata?.symbol}
            </h2>
            <p className="text-sm text-shader_500">
              {dataNFT[0]?.metadata?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ModalSearchCollection);
