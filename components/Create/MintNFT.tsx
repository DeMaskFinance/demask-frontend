import { default as abiDemask } from "@/abi/abiCreator.json";
import AccountContext from "@/context/AccountContext";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import ercContract from "@/libs/utils/erc/erc.contract";
import getMetadataUrl from "@/libs/utils/getMetadata";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Button from "../Buttons/Button";
import { ModalTransation } from "../Modal/ModalTransation";
import { ModalSuccessCreate } from "../Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "../Modal/ModalWallet";
interface mintProps {
  amount: number;
  url: string;
}

export default function MintNFT({
  name,
  symbol,
  attributeItems,
  description,
  fileIPFS,
  selectedCategory,
  setEmptyInputs,
  setName,
  setSelectedCategory,
  setFileIPFS,
  setAttributeItems,
  setDescription,
  setSymbol,
  setSelectedFile,
  setTotalSupply,
  fileType,
  totalSupply,
  contractAddress,
}: any) {
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [metadataIPFS, setMetadataIPFS] = useState<string>("");
  const { account, wallet, demask, chainId, updateChainId } =
    useContext(AccountContext);

  const [tab, setTab] = useQueryParam(
    "chain",
    withDefault(StringParam, chainId)
  );
  useEffect(() => {
    if (name || symbol || description || fileIPFS || totalSupply) {
      setCheckExit(true);
    } else {
      setCheckExit(false);
    }
  }, [name, symbol, description, fileIPFS, totalSupply]);

  usePreventUserFromErasingContent(checkExit);
  async function mintNFT({ amount, url }: mintProps) {
    const ethereum = (window as any).ethereum;
    let transactionHash = "";
    if (typeof ethereum === "undefined") {
      console.log("Please install Wallet to mint NFTs.");
      return;
    }
    try {
      setMetadataIPFS(url);
      const contract = await ercContract.erc(
        wallet,
        contractAddress,
        abiDemask
      );
      const networkSwitched = await changeNetwork(
        chainId,
        wallet,
        demask,
        setIsOpen,
        updateChainId,
        setTab
      );
      if (!networkSwitched) {
        return;
      }
      const tx = await contract.mint(
        account,
        exponentialToDecimal(amount),
        "0x",
        url
      );
      transactionHash = tx.hash;
      setHash(transactionHash);
      const check = await tx.wait();
      if (check.status === 1) {
        setIsOpenSuccess(true);
      } else {
        setIsOpenSuccess(false);
      }

      setTotalSupply(null);
      setName("");
      setDescription("");
      setSymbol("");
      setAttributeItems([{ id: 0, trait_type: "", value: "" }]);
      setSelectedCategory([]);
      setSelectedFile(null);
      setFileIPFS(null);
    } catch (error) {
      console.error("Failed to mint NFT:", error);
    }
    setIsProcess(false);
  }

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
          url: await urlMetadata,
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
        <div>
          <Button
            type="button"
            className="w-full py-3"
            primary
            onClick={handleSubmit}
          >
            Create NFT
          </Button>
        </div>
        <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        <ModalTransation
          isOpenTransation={isProcess}
          setIsOpenTransaction={setIsProcess}
          isTransaction={true}
        />
        {isOpenSuccess && (
          <ModalSuccessCreate
            isOpenSuccess={isOpenSuccess}
            type=""
            setIsOpenSuccess={setIsOpenSuccess}
            transactionHash={hash}
            isMint
            metadataLink={metadataIPFS}
          />
        )}
      </div>
    </div>
  );
}
