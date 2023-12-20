import { default as abiCreator, default as abiDemask } from "@/abi/abiCreator.json";
import AccountContext from "@/context/AccountContext";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { getProvider } from "@/libs/connection/getProvider";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import getMetadataUrl from "@/libs/utils/getMetadata";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../Buttons/Button";
import { ModalSuccess, ModalTransation } from "../Modal/ModalTransation";
import { ModalWallet } from "../Modal/ModalWallet";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-[200px] py-2 pl-2 mb-4 border rounded-lg border-dark3",
  btnActive: "rounded-full bg-base2",
};
interface mintProps {
  amount: number;
  data: string;
  url: any;
  feeRoyal: number;
}

export default function MintNFT({
  name,
  symbol,
  attributeItems,
  description,
  fileIPFS,
  selectedCategory,
  setEmptyInputs,
  emptyInputs,
  setName,
  setSelectedCategory,
  setFileIPFS,
  setAttributeItems,
  setDescription,
  setSymbol,
  setSelectedFile,
  setTotalSupply,
  setRoyaltiesFee,
  fileType,
  totalSupply,
  royaltiesFee,
  validFee
}: any) {

  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const [idNFT, setIdNFT] = useState<number>(0);
  const [hash, setHash] = useState<string>('');
  const { account, updateAccount, wallet, demask, chainId } = useContext(AccountContext);
  const contractAddress = demask.CREATOR; // Creator
  console.log(fileIPFS);
  useEffect(() => {
    if (name || symbol || description || fileIPFS || totalSupply || royaltiesFee) {
      setCheckExit(true)
    } else {
      setCheckExit(false)
    }
  }, [name, symbol, description, fileIPFS, totalSupply, royaltiesFee])

  usePreventUserFromErasingContent(checkExit);
  async function mintNFT({ amount, data, url, feeRoyal }: mintProps) {
    const ethereum = (window as any).ethereum;
    let transactionHash = "";
    if (typeof ethereum === "undefined") {
      alert("Please install Wallet to mint NFTs.");
      return;
    }

    try {
      const providerChoice = getProvider(wallet);
      const provider = new ethers.providers.Web3Provider(providerChoice);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abiDemask, signer);

      const checkExists = async (id: number): Promise<boolean> => {
        const isExisting = await contract.exists(id);
        return isExisting;
      };
      const generateRandomNumber = (): number => {
        return Math.floor(Math.random() * 10000000000);
      };
      const networkSwitched = await changeNetwork(chainId, wallet, demask, setIsOpen);
      if (!networkSwitched) {
        return;
      }
      const checkAndMint = async () => {
        const randomID = generateRandomNumber();
        const isExisting = await checkExists(randomID);
        if (isExisting) {
          checkAndMint();
        } else {
          setIdNFT(randomID);
          const tx = await contract.mint(account, randomID, exponentialToDecimal(amount), exponentialToDecimal(feeRoyal * 100), data, url);
          transactionHash = tx.hash;
          setHash(transactionHash);
          const check = await provider.waitForTransaction(transactionHash);
          if (check.status === 1) {
            setIsOpenSuccess(true);
          } else {
            setIsOpenSuccess(false)
          }

          setTotalSupply(null);
          setName("");
          setDescription("");
          setSymbol("");
          setAttributeItems([{ id: 0, trait_type: "", value: "" }]);
          setSelectedCategory([]);
          setSelectedFile(null);
          setFileIPFS(null);
          setRoyaltiesFee(null)
        }
      };
      await checkAndMint();
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
    setIsProcess(false);
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (account) {
      setIsProcess(true);
      const emptyInputFields = [];
      if (name === "") {
        emptyInputFields.push("name");
      }

      if (symbol === "") {
        emptyInputFields.push("symbol");
      }
      if (totalSupply === 0 || totalSupply === undefined) {
        emptyInputFields.push("totalSupply");
      }
      if (royaltiesFee === null || royaltiesFee === 0 || royaltiesFee === undefined) {
        emptyInputFields.push("royaltiesFee");
      }
      if (fileIPFS === null) {
        emptyInputFields.push("fileIPFS");
        toast.error("File not found.Try again!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      setEmptyInputs(emptyInputFields);
      if (emptyInputFields.length === 0 && !validFee) {
        const urlMetadata = getMetadataUrl({
          attributeItems,
          fileType,
          fileIPFS,
          name,
          symbol,
          description,
          selectedCategory,
        });
        mintNFT({
          amount: Number(totalSupply),
          data: "0x",
          url: await urlMetadata,
          feeRoyal: Number(royaltiesFee),
        });
      } else {
        setIsProcess(false);
      }
    } else {
      setIsOpen(true);
      document.body.style.overflowY = "hidden";
    }
  };
  return (
    <div className="">
      <div className="relative">
        <h2 className={styles.title}>Initialization</h2>
        <div>
          <Button
            type="button"
            className="w-[150px] py-2"
            primary
            onClick={handleSubmit}
          >
            CREATE
          </Button>
        </div>
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        <ModalTransation isOpenTransation={isProcess} setIsOpenTransaction={setIsProcess} isTransaction={true} />
        {
          isOpenSuccess && (
            <ModalSuccess isOpenSuccess={isOpenSuccess} type="" setIsOpenSuccess={setIsOpenSuccess} transactionHash={hash} isMint idNFT={idNFT} />
          )
        }
      </div>
    </div>
  );
}
