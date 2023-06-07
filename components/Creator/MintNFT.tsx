import React, { useState } from "react";
import Button from "../Buttons/Button";
import { uploadFileToIPFS } from "@/libs/utils/uploadFileIPFS";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import abiDemask from "@/abi/abiErc1155.json";
import TransitionURL from "../Toast/TransionURL";
import { changeNetwork } from "@/libs/utils/network";
import fs from "fs";
import images from "@/public/images";
import Image from "next/image";
import { Processing } from "../Loading";
import getMatadataUrl from "@/libs/utils/getMetadata";
import getMetadataUrl from "@/libs/utils/getMetadata";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark2",
  btnActive: "rounded-full bg-base2",
};
interface mintProps {
  amount: number;
  data: string;
  url: any;
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
  setAttributeItems,
  setDescription,
  setSymbol,
  setSelectedFile,
  fileType,
}: any) {
  const [totalSupply, setTotalSupply] = useState<number | null>();
  const [isProcess, setIsProcess] = useState<boolean>(false);
  async function mintNFT({ amount, data, url }: mintProps) {
    const ethereum = (window as any).ethereum;
    let transactionHash = "";
    if (typeof ethereum === "undefined") {
      alert("Please install MetaMask to mint NFTs.");
      return;
    }

    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const contractAddress = "0x84b14a4078e8c65a91766DD1Fa4ED481BAeac0e9"; // Creator
      const contract = new ethers.Contract(contractAddress, abiDemask, signer);
      const addressAccount = ethereum.selectedAddress;
      console.log(addressAccount);

      const checkExists = async (id: number): Promise<boolean> => {
        const isExisting = await contract.exists(id);
        return isExisting;
      };
      const generateRandomNumber = (): number => {
        return Math.floor(Math.random() * 10000000000);
      };
      changeNetwork();
      const checkAndMint = async () => {
        const randomID = generateRandomNumber();
        const isExisting = await checkExists(randomID);
        if (isExisting) {
          checkAndMint();
        } else {
          const tx = await contract.mint(
            addressAccount,
            randomID,
            amount,
            data,
            url
          );
          transactionHash = tx.hash;
          toast.success(
            <TransitionURL type={"Mint"} transactionHash={transactionHash} />,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
          setTotalSupply(null);
          setName("");
          setDescription("");
          setSymbol("");
          setAttributeItems([{ id: 0, trait_type: "", value: "" }]);
          setSelectedCategory([]);
          setSelectedFile(null);
        }
      };
      await checkAndMint();
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
    setIsProcess(false);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsProcess(true);
    const emptyInputFields = [];
    if (name === "") {
      emptyInputFields.push("name");
    }

    if (symbol === "") {
      emptyInputFields.push("symbol");
    }
    if (totalSupply === undefined) {
      emptyInputFields.push("totalSupply");
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
    if (emptyInputFields.length === 0) {
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
      });
    }else{
      setIsProcess(false)
    }
  };
  console.log(isProcess);

  return (
    <div className="w-[200px]">
      <label htmlFor="totalSupply" className={styles.title}>
        <span>Total Supply</span>
        <span className="text-red">*</span>
      </label>

      <input
        placeholder="10,000"
        type="number"
        id="totalSupply"
        value={totalSupply || ""}
        className={
          emptyInputs.includes("totalSupply")
            ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
            : styles.inputItem
        }
        onChange={(e) => setTotalSupply(Number(e.target.value))}
      />
      {emptyInputs.includes("totalSupply") && (
        <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
          Required
        </p>
      )}
      <div className="relative">
        <Button className="w-[140px] py-2" onClick={handleSubmit}>
          CREATE
        </Button>
        {isProcess && <Processing />}
      </div>
      <ToastContainer />
    </div>
  );
}
