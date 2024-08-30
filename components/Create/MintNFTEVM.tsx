import { default as abiDemask } from "@/abi/abiCreator.json";
import { NoteIcon, PlusIcon } from "@/components/Icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AccountContext from "@/context/AccountContext";
import { usePreventUserFromErasingContent } from "@/hooks/usePreventUserFromErasingContent";
import { queryClient } from "@/libs/constants";
import { collectionListUser } from "@/libs/service/collectionService";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import ercContract from "@/libs/utils/erc/erc.contract";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import metadataURL from "@/libs/utils/getMetadata";
import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CgClose } from "react-icons/cg";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import Button from "../Buttons/Button";
import { ModalTransation } from "../Modal/ModalTransation";
import { ModalSuccessCreate } from "../Modal/ModalTransation/ModalSuccess";
import { MintNFTStarknetProps } from "./MintNFTStarknet";
interface mintProps {
  amount: number;
  url: string;
}

export default function MintNFTEVM({
  data,
  fileIPFS,
  setFileIPFS,
  setSelectedFile,
  fileType,
}: MintNFTStarknetProps) {
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [checkExit, setCheckExit] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [emptyInputs, setEmptyInputs] = useState<string[]>([]);
  const [attributeItems, setAttributeItems] = useState([
    { id: 0, trait_type: "", value: "" },
  ]);
  const [totalSupply, setTotalSupply] = useState<number | null>();
  const [isValidBtn, setIsValidBtn] = useState<boolean>(true);
  const [metadataIPFS, setMetadataIPFS] = useState<string>("");
  const { account, wallet, demask, chainId, updateChainId } =
    useContext(AccountContext);

  const [collection, setCollection] = useState<CollectionProps>(data[0]);
  useEffect(() => {
    if (name || symbol || description || fileIPFS || totalSupply) {
      setCheckExit(true);
    } else {
      setCheckExit(false);
    }
  }, [name, symbol, description, fileIPFS, totalSupply]);

  usePreventUserFromErasingContent(checkExit);
  const handleChangeAttributeType = (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const updatedItems = attributeItems.map((item) =>
      item.id === id ? { ...item, trait_type: e.target.value } : item
    );
    const hasEmptyValues = updatedItems.some(
      (item) => item.trait_type === "" || item.value === ""
    );
    setIsValidBtn(!hasEmptyValues);
    setAttributeItems(updatedItems);
  };
  const handleSelectChange = (index: string) => {
    setCollection(data[parseInt(index, 10)]);
  };
  const handleChangeAttributeValue = (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const updatedItems = attributeItems.map((item) =>
      item.id === id ? { ...item, value: e.target.value } : item
    );
    const hasEmptyValues = updatedItems.some(
      (item) => item.trait_type === "" || item.value === ""
    );
    setIsValidBtn(!hasEmptyValues);
    setAttributeItems(updatedItems);
  };
  const handleAddAttribute = () => {
    const newItem = {
      id: attributeItems.length,
      trait_type: "",
      value: "",
    };
    if (
      attributeItems.some((item) => item.trait_type === "" || item.value === "")
    ) {
      setIsValidBtn(false);
    } else {
      setIsValidBtn(true);
      setAttributeItems([...attributeItems, newItem]);
    }
  };
  const handleRemoveAttribute = (id: number) => {
    const updatedItems = attributeItems.filter((item) => item.id !== id);
    setAttributeItems(updatedItems);
  };
  async function mintNFT({ amount, url }: mintProps) {
    const ethereum = (window as any).ethereum;
    let transactionHash = "";
    if (typeof ethereum === "undefined") {
      return;
    }
    try {
      setMetadataIPFS(url);
      const contract = await ercContract.erc(
        wallet,
        collection.collectionAddress,
        abiDemask
      );
      const networkSwitched = await changeNetwork(
        chainId,
        wallet,
        demask,
        setIsWrongNetwork,
        updateChainId
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
    if (fileIPFS === "") {
      emptyInputFields.push("fileIPFS");
      toast.error("File not found.Try again!");
    }

    setEmptyInputs(emptyInputFields);
    if (emptyInputFields.length === 0) {
      const urlMetadata = metadataURL.getMetadataUrlEVM({
        attributeItems,
        fileType,
        fileIPFS,
        name,
        symbol,
        description,
      });
      mintNFT({
        amount: Number(totalSupply),
        url: await urlMetadata,
      });
    } else {
      setIsProcess(false);
    }
  };
  return (
    <div className="relative">
      <form id="creator">
        <div>
          <label htmlFor="collection" className="block mb-4 font-semibold">
            <span className="">Collection</span>
            <span className="text-primary_400">*</span>
          </label>
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="relative flex items-center pr-3 cursor-pointer input_item h-12 w-full">
              <div className="flex items-center gap-x-2">
                <img
                  src={formatLinkIPFS(collection.url)}
                  alt="list_collection"
                  className="object-cover w-8 h-8 rounded-lg"
                />
                <SelectValue placeholder={collection.name}>
                  {collection.name}
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="bg_main">
              <SelectGroup>
                <Link
                  href={`/create/deploy-contract`}
                  className="flex items-center p-2 cursor-pointer gap-x-2 hover:bg-shader_500"
                >
                  <div className="flex font-semibold gap-x-[10px] items-center text-white">
                    <div className=" bg-primary_500 bg-opacity-[0.15] w-10 h-10 rounded-lg text-center text-2xl text-primary_400 flex items-center justify-center">
                      <PlusIcon />
                    </div>
                    Create Collection
                  </div>
                </Link>
                {data.map((item: CollectionProps, index: number) => (
                  <SelectItem
                    key={index}
                    value={index.toString()}
                    className="p-0 block"
                  >
                    <div className="flex items-center cursor-pointer gap-x-2 hover:bg-shader_500 w-full p-2 text-white">
                      <img
                        src={formatLinkIPFS(item.url)}
                        alt="list_collection"
                        className="object-cover w-8 h-8 rounded-lg"
                      />
                      <p className="font-semibold">{item.name}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="name" className="title_label">
            <span className="">Name</span>
            <span className="text-primary_400">*</span>
          </label>
          <input
            placeholder="Name"
            type="text"
            id="name"
            value={name}
            autoComplete="off"
            className={
              emptyInputs.includes("name")
                ? "w-full py-4 pl-2 mb-4 rounded-lg border-2 border-red"
                : "input_item"
            }
            onChange={(e) => setName(e.target.value)}
          />
          {emptyInputs.includes("name") && (
            <p className="mb-2 ml-3 -mt-1 text-xs text-primary_400" key="name">
              Required
            </p>
          )}
        </div>
        <div>
          <label htmlFor="symbol" className="title_label">
            <span>Symbol</span>
            <span className="text-primary_400">*</span>
          </label>

          <input
            placeholder="Symbol"
            type="text"
            id="symbol"
            value={symbol}
            autoComplete="off"
            className={
              emptyInputs.includes("symbol")
                ? "w-full py-4 pl-2 mb-4 rounded-lg border-2 border-red"
                : "input_item"
            }
            onChange={(e) => setSymbol(e.target.value)}
          />
          {emptyInputs.includes("symbol") && (
            <p
              className="mb-2 ml-3 -mt-1 text-xs text-primary_400"
              key="symbol"
            >
              Required
            </p>
          )}
        </div>
        <div>
          <label htmlFor="totalSupply" className="title_label">
            <span>Total Supply</span>
            <span className="text-primary_400">*</span>
          </label>
          <NumericFormat
            placeholder="10,000"
            id="totalSupply"
            autoComplete="off"
            value={totalSupply || ""}
            thousandSeparator=","
            decimalScale={0}
            className={
              emptyInputs.includes("totalSupply")
                ? "w-[200px] py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                : "input_item"
            }
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              setTotalSupply(Number(newValue));
            }}
          />
          {emptyInputs.includes("totalSupply") && (
            <p
              className="mb-2 ml-3 -mt-1 text-xs text-primary_400"
              key="initial"
            >
              Required
            </p>
          )}
        </div>
        <div>
          <label htmlFor="description" className="title_label">
            <span>Description</span>
          </label>

          <textarea
            placeholder="Write a description of your nft ..."
            id="description"
            value={description}
            rows={3}
            className={`${"input_item"} resize-none min-h-[3lh]`}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <div>
          <label
            htmlFor="traits"
            className={`title_label flex gap-x-1 items-center`}
          >
            <span>Traits</span>
            <Tippy
              interactive
              content={
                <span>
                  Traits describe attributes of your items. They appear as
                  filters inside your collection page and are also listed out
                  inside your item page.
                </span>
              }
            >
              <div>
                <NoteIcon width={14} height={14} />
              </div>
            </Tippy>
          </label>
          {attributeItems.map((item) => (
            <div className="flex items-center gap-2 mb-2 " key={item.id}>
              <input
                placeholder="Trait Type"
                autoComplete="off"
                type="text"
                id={`traitType_${item.id}`}
                value={item.trait_type}
                className={"input_item"}
                onChange={(e) => handleChangeAttributeType(e, item.id)}
              />
              <input
                placeholder="Value"
                autoComplete="off"
                type="text"
                id={`value_${item.id}`}
                value={item.value}
                className={"input_item"}
                onChange={(e) => handleChangeAttributeValue(e, item.id)}
              />
              <div
                className="flex items-center justify-center w-10 h-10 cursor-pointer input_item"
                onClick={() => handleRemoveAttribute(item.id)}
              >
                <CgClose className="text-2xl transition-colors duration-100 ease-linear hover:text-primary_400" />
              </div>
            </div>
          ))}
        </div>
        {!isValidBtn && (
          <p className="mb-2 text-primary_400">You need add property</p>
        )}
        <Button
          type="button"
          third
          onClick={handleAddAttribute}
          className="flex mt-2 mb-5 gap-x-2"
          disabled={!isValidBtn}
        >
          <PlusIcon />
          Add Property
        </Button>
      </form>
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
      <ModalTransation
        isOpenTransation={isProcess}
        setIsOpenTransaction={setIsProcess}
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
  );
}
