import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { useState, useEffect, useContext } from "react";
import useDebounce from "@/hooks/useDebounce";
import checkIsERC1155 from "@/libs/validation/checkIsERC1155";
import { ethers } from "ethers";
import abiErc1155 from "@/abi/abiErc1155.json";
import Image from "next/image";
import { BiLoaderAlt } from "react-icons/bi";
import { useRouter } from "next/router";
import { memo } from "react";
import images from "@/public/images";
import { NFTTopService } from "@/libs/service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import useNetWork from "@/hooks/useNetwork";
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
  const { chainId } = useNetWork();
  const handleAddressNFT = async (value: string) => {
    setLoading(true);
    const ERC1155 = await checkIsERC1155(value);
    console.log(ERC1155);

    setIsERC1155(ERC1155);
    setLoading(false);
  };
  console.log(isERC1155);
  console.log(debouncedNFT);

  useEffect(() => {
    if (debouncedNFT) {
      handleAddressNFT(debouncedNFT);
    }

    const handleSearch = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      const contract = new ethers.Contract(debouncedNFT, abiErc1155, provider);
      try {
        const uri = await contract.uri(idNFT);
        console.log(uri);

        if (uri) {
          setUri(uri);
          const res = await fetch(uri);
          const metadata = await res.json();
          setMetadata(metadata);

          if (metadata !== null) {
            const { name, symbol, image } = metadata;
            setNameNFT(name);
            setSymbolNFT(symbol);
            setImageNFT(image);
          } else {
            console.log("Metadata is null");
          }
        } else {
          setMetadata(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isERC1155 && idNFT && debouncedNFT) {
      handleSearch();
    }
  }, [debouncedNFT, idNFT]);
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const ipfsLink = uri;
        const res = await fetch(ipfsLink);
        const metadata = await res.json();
        setMetadata(metadata);
      } catch (error) { }
    };
    fetchMetadata();
  }, [uri]);
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
      queryKey: ["topNFT",chainId],
      queryFn: async () => {
        const res = await NFTTopService(1,chainId);
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
        .replace(currency[2], item.nftId);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL.replace(slug[0], item.nftAddress).replace(slug[2], item.nftId);
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
              {loading && (
                <div className="absolute top-[50%] right-2 -translate-y-1/2">
                  <BiLoaderAlt className="animate-spin text-secondary5" />
                </div>
              )}
            </div>
            <ul className={`${nftAddress ? 'hidden' : 'block'}`}>
              <li className="flex items-center cursor-pointer gap-x-2 hover:text-secondary5 group active:text-secondary3" onClick={() => setNftAddress(process.env.NEXT_PUBLIC_CREATOR as string)}>
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
                                {item.metadata?.image && (
                                  <Image
                                    loading="lazy"
                                    unoptimized
                                    width={32}
                                    height={32}
                                    src={item.metadata?.image}
                                    alt="NFT Image"
                                    className="object-cover w-full h-full"
                                  />
                                )}
                                {item.metadata?.animation_url &&
                                  !item.metadata?.image && (
                                    <video
                                      src={item.metadata?.animation_url}
                                      autoPlay={false}
                                      loop
                                      muted
                                      className="object-cover h-full"
                                    />
                                  )}
                                {item.metadata?.image &&
                                  item.metadata?.animation_url && (
                                    <audio
                                      autoPlay
                                      loop
                                      muted
                                      controls
                                      src={item.metadata?.animation_url}
                                      className=""
                                    >
                                      Your browser does not support the
                                      <code>audio</code> element.
                                    </audio>
                                  )}
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
            {isERC1155 && nftAddress && (
              <input
                className={styles.inputItem}
                placeholder="Address id or paste id"
                value={idNFT}
                onChange={(e) => setIdNFT(e.target.value)}
              />
            )}
            {!isERC1155 && nftAddress && (
              <p
                className="mb-2 ml-3 -mt-1 text-xs text-red"
                key="totalPayment"
              >
                Your NFT address must be an ERC1155
              </p>
            )}
          </div>
          {metadata && (
            <div
              className="flex items-center rounded-lg cursor-pointer hover:bg-dark4 group"
              onClick={handleChangeRouteNFT}
            >
              <Image
                src={imageNFT}
                alt=""
                className="h-6 mr-2 rounded-full"
                width={24}
                height={24}
                unoptimized
              />
              <div>
                <h2 className="font-medium group-hover:text-secondary5">
                  {symbolNFT}
                </h2>
                <p className="text-sm text-dark3">{nameNFT}</p>
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
        {/* <Button primary className="p-3" onClick={handleSearch}>Check</Button> */}
      </div>
    </Wrapper>
  );
};

export default memo(ModalAddressNFT);
