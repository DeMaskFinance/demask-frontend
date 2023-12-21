import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { NFTTopService } from "@/libs/service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { checkIsERC1155Service } from "@/libs/service/checkIsERC1155";
import axios from "axios";
import MediaNFT from "@/components/Common/MediaNFT";
import { searchNFTService } from "@/libs/service/searchService";
interface ModalAddressNFTProps {
  isOpenSearchNFT: boolean;
  setIsOpenSearchNFT: any;
}
const styles = {
  inputItem:
    "w-full p-2 mb-4 border rounded-lg border-dark3 placeholder:text-sm block",
};
const ModalAddressNFT: React.FunctionComponent<ModalAddressNFTProps> = ({
  isOpenSearchNFT,
  setIsOpenSearchNFT,
}) => {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [isERC1155, setIsERC1155] = useState<boolean>(false);
  const [metadata, setMetadata] = useState(null);
  const [uri, setUri] = useState("");
  const [idNFT, setIdNFT] = useState("");
  let debouncedNFT = useDebounce(nftAddress);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameNFT, setNameNFT] = useState("");
  const [imageNFT, setImageNFT] = useState("");
  const [symbolNFT, setSymbolNFT] = useState("");
  const router = useRouter();
  const { chainId, demask } = useContext(AccountContext);

  const { isLoading, data, isFetching, isSuccess } = useQuery({
    queryKey: ["checkNFT", nftAddress, chainId],
    queryFn: async () => {
      const res = await checkIsERC1155Service(nftAddress.toLowerCase(), chainId)
      return res;
    },
  });
  const { isLoading: isLoadingNFT, data: dataNFT, isFetching: isFetchingNFT, isSuccess: isSuccessNFT } = useQuery({
    queryKey: ["searchNFT", nftAddress, chainId, idNFT],
    queryFn: async () => {
      const res = await searchNFTService(chainId, nftAddress.toLowerCase(), idNFT)
      return res;
    },
  });
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
  };
  const handleChangeRouteNFT = () => {
    const { currency } = router.query;
    const { slug } = router.query;
    let newURL = "";
    if (currency) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(currency[0], nftAddress)
        .replace(currency[2], idNFT);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL.replace(slug[0], nftAddress).replace(slug[2], idNFT);
      router.push(newURL);
    }
    setNftAddress('')
    setIdNFT('');
    setMetadata(null);
    setUri('');
    router.push(newURL);
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
  };
  const { isLoading: topNftLoading,
    data: topNftData,
    isFetching: topNftFetching,
    refetch: topNftRefetch,
    isPreviousData: isTopNftPreviousData, } = useQuery({
      queryKey: ["topNFT", chainId],
      queryFn: async () => {
        const res = await NFTTopService(1, chainId);
        return res;
      },

      keepPreviousData: true,
    });
  const handleSelectNFT = (item: any) => {
    const { currency } = router.query;
    const { slug } = router.query;
    let newURL = "";
    if (currency) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(currency[0], item.nftAddress)
        .replace(currency[2], item.nftID);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL.replace(slug[0], item.nftAddress).replace(slug[2], item.nftID);
    }
    router.push(newURL);
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
  }

  return (
    <Wrapper isOpen={isOpenSearchNFT} onClick={handleClose}>
      <div className="z-50 flex flex-col justify-center h-full">
        <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg px-4 pb-4 relative">
          <p className="py-2 mb-4 border-b-[1px] border-dark3 text-xl font-medium">
            Select a NFT
          </p>
          <div>
            <div className="relative">
              <input
                className={styles.inputItem}
                placeholder="Search address or paste address"
                value={nftAddress}
                onChange={(e) => setNftAddress(e.target.value)}
              />
              {isLoading && (
                <div className="absolute top-[50%] right-2 -translate-y-1/2">
                  <BiLoaderAlt className="animate-spin text-secondary5" />
                </div>
              )}
            </div>
            <ul className={`${nftAddress ? 'hidden' : 'block'}`}>
              <li className="flex items-center cursor-pointer gap-x-2 hover:text-secondary5 group active:text-secondary3" onClick={() => setNftAddress(demask.CREATOR)}>
                <span><Image src='/logo.png' alt="logo" width={24} height={24} /></span>
                <span>DEMASK CREATOR</span>
              </li>
            </ul>
            <div className={`${nftAddress ? 'hidden' : 'block'}`}>
              <div className="mt-3">
                {topNftData && topNftData.nftDataList.length > 0 ? (
                  <div>
                    <div className="block mb-2">
                      <span className="text-base">NFTs Top</span>
                      {topNftData.nftDataList.slice(0, 4).map((item: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => handleSelectNFT(item)}
                          className="flex-1"
                        >
                          <div className="flex items-center justify-between w-full gap-2 p-1 rounded-lg cursor-pointer hover:bg-secondary5 hover:text-white">
                            <div className="flex items-center gap-2">
                              <div className="flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-lg">
                                <MediaNFT data={item} isControls={false} />
                              </div>
                              <div className="flex flex-col items-baseline">
                                <span className="block text-sm font-semibold">
                                  <span className="line-clamp-1">
                                    {item?.metadata?.name}
                                  </span>
                                </span>
                                <span className="flex text-xs item-center">
                                  <span className="block pb-2 mr-1 font-semibold">
                                    {item.dmlAddress?.slice(0, 4)}...
                                    {item.dmlAddress?.slice(-8)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {topNftFetching ? (
                      <div className="bg-slate-200 animate-pulse h-[24px] w-full rounded-lg"></div>
                    ) : (
                      <span className="text-base text-secondary3"></span>
                    )}
                  </>
                )}
              </div>
            </div>
            {data?.status === true && nftAddress && (
              <input
                className={styles.inputItem}
                placeholder="Address id or paste id"
                value={idNFT}
                onChange={(e) => setIdNFT(e.target.value)}
              />
            )}
            {data?.status === false && nftAddress && (
              <p
                className="mb-2 ml-3 -mt-1 text-xs text-red"
                key="totalPayment"
              >
                Your NFT address must be an ERC1155
              </p>
            )}
          </div>
          {isSuccessNFT && dataNFT[0]?.metadata && (
            <div
              className="flex items-center rounded-lg cursor-pointer hover:bg-dark4 group gap-x-2"
              onClick={handleChangeRouteNFT}
            >
              <div className="w-8 h-8">
                <MediaNFT data={dataNFT[0]} isControls={false} />
              </div>
              <div>
                <h2 className="font-medium group-hover:text-secondary5">
                  {dataNFT[0]?.metadata?.symbol}
                </h2>
                <p className="text-sm text-dark3">{dataNFT[0]?.metadata?.name}</p>
              </div>
            </div>
          )}
          <button
            className="absolute top-0 right-0 p-2 text-lg"
            onClick={handleClose}
          >
            <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default memo(ModalAddressNFT);
