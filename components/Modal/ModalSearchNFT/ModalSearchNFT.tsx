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
  const [showError, setShowError] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [uri, setUri] = useState("");
  const [idNFT, setIdNFT] = useState("");
  let debouncedNFT = useDebounce(nftAddress);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameNFT, setNameNFT] = useState("");
  const [imageNFT, setImageNFT] = useState("");
  const [symbolNFT, setSymbolNFT] = useState("");
  const router = useRouter();
  const hanldeAddressNFT = async (value: string) => {
    setLoading(true);
    const ERC1155 = await checkIsERC1155(value);
    setIsERC1155(ERC1155);
    setShowError(!ERC1155);
    setLoading(false);
  };
  console.log(isERC1155);
  
  console.log(showError);
  
  useEffect(() => {
    if (debouncedNFT) {
      hanldeAddressNFT(debouncedNFT);
    }
    if (isERC1155) {
      setShowError(true);
    }
    if (debouncedNFT.trim() === "") {
      setShowError(false);
    }

    const handleSearch = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      const contract = new ethers.Contract(debouncedNFT, abiErc1155, provider);
      try {
        const uri = await contract.uri(idNFT);
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
      } catch (error) {
        console.error(error);
      }
    };

    if (idNFT && debouncedNFT) {
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
      } catch (error) {}
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
      console.log(slug);
      const currentURL = router.asPath;
      newURL = currentURL.replace(slug[0], nftAddress).replace(slug[2], idNFT);
      router.push(newURL);
    }
    router.push(newURL);
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
    // setIsERC1155(false)
    // setMetadata(null);
    // setNftAddress('');
  };

  return (
    <Wrapper isOpen={isOpenSearchNFT} onClick={handleClose}>
      <div className="z-50 flex flex-col justify-center h-full">
        <div className="bg-white h-fit w-[432px] rounded-lg px-4 pb-4 relative">
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
            {isERC1155 && (
              <input
                className={styles.inputItem}
                placeholder="Address id or paste id"
                value={idNFT}
                onChange={(e) => setIdNFT(e.target.value)}
              />
            )}
            {showError && (
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
