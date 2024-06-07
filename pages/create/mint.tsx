import Button from "@/components/Buttons/Button";
import WithAuth from "@/components/Common/WithAuth";
import MintNFT from "@/components/Create/MintNFT";
import { LeftIcon, NoteIcon, PlusIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { Category } from "@/libs/constants";
import { collectionListUser } from "@/libs/service/collectionService";
import { uploadFileIPFSMint } from "@/libs/service/IPFSService";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import { useQuery } from "@tanstack/react-query";
import Tippy from "@tippyjs/react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CgClose } from "react-icons/cg";
import { FaAngleDown } from "react-icons/fa";
import { NumericFormat } from "react-number-format";
import { SEO } from "../../next-seo.config";
import { UploadFileNFT } from "@/components/Create/UploadFile";

const styles = {
  title: "block my-4 text-base font-semibold",
  btnActive: "rounded-lg bg-primary_400",
};
const updateMeta = {
  ...SEO,
  title: "Mint NFTs",
};

export default function Creator() {
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [emptyInputs, setEmptyInputs] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const router = useRouter();
  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [attributeItems, setAttributeItems] = useState([
    { id: 0, trait_type: "", value: "" },
  ]);
  const { chainId, account, demask } = useContext(AccountContext);
  const [totalSupply, setTotalSupply] = useState<number | null>();
  const [isValidBtn, setIsValidBtn] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const divRef = useRef<HTMLDivElement>(null);
  const [isOpenCollection, setIsOpenCollection] = useState<boolean>(false);
  const collectionList = [
    {
      name: "DEMASK COLLECTION",
      img: (
        <img
          src="/logoDefault.png"
          className="w-8 h-8 rounded-lg"
          alt="img_collection"
        />
      ),
      collectionAddress: demask.CREATOR,
    },
  ];
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["listCollectionUser", chainId, account],
    queryFn: async () => {
      const res = await collectionListUser(account, chainId);
      return res.data;
    },
  });

  const [collection, setCollection] = useState<{
    img: JSX.Element;
    name: String;
    collectionAddress: String;
  }>(collectionList[0]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setIsOpenCollection(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
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
  const selectCategory = (value: string) => {
    const isSelected = selectedCategory.includes(value);
    if (isSelected) {
      const updateCategories = selectedCategory.filter((item) => item != value);
      setSelectedCategory(updateCategories);
    } else {
      const updatedCategories = [...selectedCategory, value];
      setSelectedCategory(updatedCategories);
    }
  };

  const handleTextareaResize = (event: any) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // reset height

    const { scrollHeight, clientHeight } = textarea;
    const minHeight = parseInt(window.getComputedStyle(textarea).minHeight);

    textarea.style.height =
      Math.max(scrollHeight, clientHeight, minHeight) + "px";
  };

  return (
    <>
      <NextSeo {...updateMeta} />

      <WithAuth>
        <div className="py-8 pb-24 mx-auto container-main lg:pb-8 lg:px-0">
          <div
            className="flex items-center cursor-pointer gap-x-2"
            onClick={() => router.back()}
          >
            <LeftIcon width={20} height={20} />

            <p className="font-semibold text-white">Back</p>
          </div>
          <h2 className="mt-4 text-xl font-bold text-primary_300">
            Create an NFT
          </h2>
          <h3 className="mt-2 mb-4 text-sm font-normal text-shader_200">
            Mint additional NFTs to grow your collection.
          </h3>
          <div className="flex flex-col gap-6 text-shader_100 lg:flex-row md:flex-row ">
            {/* UpLoad File */}
            <div className="w-full lg:w-2/4 md:w-2/4 shrink-0">
              <div className="sticky top-16">
                <UploadFileNFT
                  setFileIPFS={setFileIPFS}
                  fileType={fileType}
                  setFileType={setFileType}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  uploadFile={uploadFileIPFSMint}
                />
              </div>
            </div>
            <div className="w-full lg:w-2/4 md:w-2/4">
              <form id="creator">
                <div>
                  <label
                    htmlFor="collection"
                    className="block mb-4 font-semibold"
                  >
                    <span className="">Collection</span>
                    <span className="text-primary_400">*</span>
                  </label>
                  <div
                    ref={divRef}
                    className="relative flex items-center justify-between pr-3 cursor-pointer input_item"
                    onClick={() => setIsOpenCollection(!isOpenCollection)}
                  >
                    <div className="flex items-center gap-x-2">
                      {collection.img}
                      <p className="font-semibold text-white">
                        {collection.name}
                      </p>
                    </div>
                    <FaAngleDown
                      className={`text-shader_600 transition-all duration-150 ${
                        isOpenCollection ? "rotate-180" : "rotate-0"
                      }`}
                    />
                    <ul
                      className={` rounded-lg absolute w-full left-0 top-14 z-10 border bg-shader_700 transition-all duration-500 max-h-60 overflow-y-scroll border-shader_500 ${
                        isOpenCollection
                          ? "block opacity-100"
                          : "hidden opacity-0"
                      }`}
                    >
                      <li>
                        <Link
                          href={`/create/deploy-contract?chain=${chainId}`}
                          className="flex items-center p-2 cursor-pointer gap-x-2 hover:bg-shader_500 "
                        >
                          <div className="flex font-semibold gap-x-[10px] items-center">
                            <div className=" bg-primary_500 bg-opacity-[0.15] w-10 h-10 rounded-lg text-center text-2xl text-primary_400 flex items-center justify-center">
                              <PlusIcon />
                            </div>
                            Create Collection
                          </div>
                        </Link>
                      </li>
                      {collectionList.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-center p-2 cursor-pointer gap-x-2 hover:bg-shader_500 "
                          onClick={() => setCollection(item)}
                        >
                          {item.img}
                          <div>
                            <p className="font-semibold ">{item.name}</p>
                          </div>
                        </li>
                      ))}
                      {isSuccess && (
                        <Fragment>
                          {data.map((item: any, index: number) => (
                            <li
                              key={index}
                              className="flex items-center p-2 cursor-pointer gap-x-2 hover:bg-shader_500 "
                              onClick={() =>
                                setCollection({
                                  img: (
                                    <img
                                      src={formatLinkIPFS(item.url)}
                                      alt="list_collection"
                                      className="object-cover w-8 h-8 rounded-lg"
                                    />
                                  ),
                                  name: item.name,
                                  collectionAddress: item.collectionAddress,
                                })
                              }
                            >
                              <img
                                src={formatLinkIPFS(item.url)}
                                alt="list_collection"
                                className="object-cover w-8 h-8 rounded-lg"
                              />
                              <div>
                                <p className="font-semibold text-white">
                                  {item.name}
                                </p>
                              </div>
                            </li>
                          ))}
                        </Fragment>
                      )}
                    </ul>
                  </div>
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
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-primary_400"
                      key="name"
                    >
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
                  <p className="title_label">Category</p>
                  <div className="flex">
                    {Category.map((item, index) => (
                      <Button
                        type="button"
                        active={selectedCategory.includes(item.value)}
                        outline
                        className="px-3 py-1 mr-4 text-sm h-[34px] text-shader_600"
                        key={item.id}
                        onClick={() => selectCategory(item.value)}
                      >
                        {item.value}
                      </Button>
                    ))}
                  </div>
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
                    className={`${"input_item"} resize-none`}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      handleTextareaResize(e);
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
                          Traits describe attributes of your items. They appear
                          as filters inside your collection page and are also
                          listed out inside your item page.
                        </span>
                      }
                    >
                      <div>
                        <NoteIcon width={14} height={14} />
                      </div>
                    </Tippy>
                  </label>
                  {attributeItems.map((item) => (
                    <div
                      className="flex items-center gap-2 mb-2 "
                      key={item.id}
                    >
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
                <MintNFT
                  name={name}
                  symbol={symbol}
                  attributeItems={attributeItems}
                  description={description}
                  fileIPFS={fileIPFS}
                  selectedCategory={selectedCategory}
                  setEmptyInputs={setEmptyInputs}
                  emptyInputs={emptyInputs}
                  setName={setName}
                  setSymbol={setSymbol}
                  setFileIPFS={setFileIPFS}
                  setDescription={setDescription}
                  setAttributeItems={setAttributeItems}
                  setSelectedCategory={setSelectedCategory}
                  setSelectedFile={setSelectedFile}
                  setTotalSupply={setTotalSupply}
                  fileType={fileType}
                  totalSupply={totalSupply}
                  contractAddress={collection.collectionAddress}
                />
              </form>
            </div>
          </div>
        </div>
      </WithAuth>
    </>
  );
}
