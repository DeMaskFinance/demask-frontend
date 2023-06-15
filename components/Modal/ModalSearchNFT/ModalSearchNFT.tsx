import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { useState, useEffect, useContext } from "react";
import useDebounce from "@/hooks/useDebounce";
import checkIsERC1155 from "@/libs/validation/checkIsERC1155";
import { Button } from "@/components/Buttons";
import { getProvider } from "@/libs/connection/getProvider";
import { ethers } from "ethers";
import abiErc1155 from "@/abi/abiErc1155.json";
import AccountContext from "@/context/AccountContext";
import Image from "next/image";
import images from "@/public/images";

interface ModalAddressNFTProps {}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem:
    "w-full p-2 mb-4 border rounded-lg border-dark3 placeholder:text-sm",
  btnActive: "rounded-full bg-base2",
};
const ModalAddressNFT: React.FunctionComponent<ModalAddressNFTProps> = () => {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [isERC1155, setIsERC1155] = useState<boolean>(false);
  const [showError, setShowError] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [uri, setUri] = useState("");
  const [idNFT, setIdNFT] = useState("");
  const debouncedNFT = useDebounce(nftAddress);
  const { account, updateAccount, wallet } = useContext(AccountContext);
  const [nameNFT,setNameNFT] = useState('');
  const [imageNFT,setImageNFT] = useState('');
  const [symbolNFT,setSymbolNFT] =useState('');
  const hanldeAddressNFT = async (value: string) => {
    const ERC1155 = await checkIsERC1155(value);
    setIsERC1155(ERC1155);
    setShowError(!ERC1155);
  };

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
  }, [debouncedNFT]);

  useEffect(() => {
    const handleSearch = async () => {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      );
      const contract = new ethers.Contract(debouncedNFT, abiErc1155, provider);
      try {
        const uri = await contract.uri(idNFT);
        setUri(uri);
      } catch (error) {
        return error;
      }
    };
    handleSearch();
  }, [idNFT, debouncedNFT]);
  console.log(uri); 
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const ipfsLink =uri;
        const res = await fetch(ipfsLink);
        const metadata = await res.json();
        setMetadata(metadata);
      } catch (error) {}
    };
    fetchMetadata();
  }, [uri]);
  console.log(metadata);
  
  useEffect(()=>{
    if (metadata !== null) {
      const { name, symbol, image } = metadata;
  
      setNameNFT(name);
      setSymbolNFT(symbol);
      setImageNFT(image);
    } else {
      console.log("Metadata is null");
    }
  },[metadata])
  console.log(nameNFT,symbolNFT,imageNFT);
  
  return (
    <Wrapper isOpen={true}>
      <div className="z-50 flex flex-col justify-center h-full">
        <div className="bg-white h-fit w-[432px] rounded-lg px-4 pb-4 relative">
          <p className="py-2 mb-4 border-b-[1px] border-dark3 text-xl font-medium">
            Select a NFT
          </p>
          <div>
            <input
              className={styles.inputItem}
              placeholder="Address address or paste address"
              value={nftAddress}
              onChange={(e) => setNftAddress(e.target.value)}
            />
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
            <div className="flex items-center">
              <Image
                src={imageNFT}
                alt=""
                className="h-6 mr-2 rounded-full"
                width={24}
                height={24}
                unoptimized
              />
              <div>
                <h2 className="font-medium">{symbolNFT}</h2>
                <p className="text-sm text-dark3">{nameNFT}</p>
              </div>
            </div>
          )}
          <button className="absolute top-0 right-0 p-2 text-lg">
            <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </div>
        {/* <Button primary className="p-3" onClick={handleSearch}>Check</Button> */}
      </div>
    </Wrapper>
  );
};

export default ModalAddressNFT;
