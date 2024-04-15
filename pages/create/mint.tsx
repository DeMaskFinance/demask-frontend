import Button from "@/components/Buttons/Button";
import Icons from "@/public/icons/icon";
import Image from "next/image";
import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import WithAuth from "@/components/Common/WithAuth";
import MintNFT from "@/components/Create/MintNFT";
import {
  BackIcon,
  CreateIcon,
  InforIcon,
  PictureMint,
} from "@/components/Icons";
import { Category } from "@/libs/constants";
import { uploadFileIPFS } from "@/libs/service/IPFSService";
import Tippy from "@tippyjs/react";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { useRouter } from "next/router";
import UploadFile from "@/components/Create/UploadFile";
import { CgClose } from "react-icons/cg";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24 dark:text-dark4",
  btnActive: "rounded-lg bg-secondary5",
};
const updateMeta = {
  ...SEO,
  title: "Mint NFTs",
};
export default function Creator() {
  const itemRef = useRef<HTMLDivElement>(null);
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
  const [totalSupply, setTotalSupply] = useState<number | null>();
  const [royaltiesFee, setRoyaltiesFee] = useState<number | null>();
  const [validFee, setValidFee] = useState<boolean>(false);
  const [isValidBtn, setIsValidBtn] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

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

  useEffect(() => {
    if (selectedFile === null) {
      itemRef.current?.classList.add("border");
    }
  }, [selectedFile]);
  const handleChangeRoyalFee = (e: any) => {
    const inputValue = e.target.value;
    const isValidInput = /^[0-9]*[.,]?[0-9]*$/.test(inputValue);
    if (!isValidInput) {
      return;
    }
    setRoyaltiesFee(inputValue);
    if (e.target.value < 0 || e.target.value > 100) {
      setValidFee(true);
    } else {
      setValidFee(false);
    }
  };

  return (
    <>
      <NextSeo {...updateMeta} />
      <WithAuth>
        <div className="flex flex-col gap-6 py-8 pb-24 mx-auto lg:flex-row md:flex-row container-main lg:pb-8 ">
          {/* UpLoad File */}
          <div className="w-full lg:w-2/4 md:w-2/4 shrink-0">
            <div className="sticky top-16">
              <div className="flex items-center gap-x-2">
                <div onClick={() => router.back()}>
                  <BackIcon width={20} height={20} />
                </div>
                <h2 className="flex items-center text-2xl font-semibold text_gradient gap-x-1">
                  <CreateIcon width={22} height={22} />
                  Create New NFTs
                </h2>
              </div>
              <h3 className="my-2 font-normal text-dark2">
                Mint additional NFTs to grow your collection.
              </h3>
              <p className="mt-2 mb-6 text-xs text-red">* Required fields</p>
              <UploadFile setFileIPFS={setFileIPFS} />
            </div>
          </div>
          <div className="w-full lg:w-2/4 md:w-2/4">
            <form id="creator">
              <div>
                <label htmlFor="name" className={styles.title}>
                  <span className="">Name</span>
                  <span className="text-red">*</span>
                </label>
                <input
                  placeholder="Name"
                  type="text"
                  id="name"
                  value={name}
                  autoComplete="off"
                  className={
                    emptyInputs.includes("name")
                      ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                      : "input_item"
                  }
                  onChange={(e) => setName(e.target.value)}
                />
                {emptyInputs.includes("name") && (
                  <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="name">
                    Required
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="symbol" className={styles.title}>
                  <span>Symbol</span>
                  <span className="text-red">*</span>
                </label>

                <input
                  placeholder="Symbol"
                  type="text"
                  id="symbol"
                  value={symbol}
                  autoComplete="off"
                  className={
                    emptyInputs.includes("symbol")
                      ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                      : "input_item"
                  }
                  onChange={(e) => setSymbol(e.target.value)}
                />
                {emptyInputs.includes("symbol") && (
                  <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="symbol">
                    Required
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="totalSupply" className={styles.title}>
                  <span>Total Supply</span>
                  <span className="text-red">*</span>
                </label>

                <input
                  placeholder="10,000"
                  type="number"
                  id="totalSupply"
                  autoComplete="off"
                  value={totalSupply || ""}
                  onKeyDown={(event) => {
                    if (
                      !(event.key >= "0" && event.key <= "9") &&
                      event.key !== "Backspace" &&
                      event.key !== "ArrowLeft" &&
                      event.key !== "ArrowRight"
                    ) {
                      event.preventDefault();
                    }
                  }}
                  className={
                    emptyInputs.includes("totalSupply")
                      ? "w-[200px] py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                      : "input_item"
                  }
                  onChange={(e) => setTotalSupply(Number(e.target.value))}
                />
                {emptyInputs.includes("totalSupply") && (
                  <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
                    Required
                  </p>
                )}
                <label htmlFor="royaltiesFee" className={styles.title}>
                  <span>Royalties Fee</span>
                  <span className="text-red">*</span>
                </label>
                <input
                  placeholder="100"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  type="text"
                  id="royaltiesFee"
                  autoComplete="off"
                  spellCheck="false"
                  minLength={1}
                  maxLength={79}
                  inputMode="decimal"
                  value={royaltiesFee || ""}
                  className={
                    emptyInputs.includes("royaltiesFee")
                      ? "w-[200px] py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                      : "input_item"
                  }
                  onChange={(e) => handleChangeRoyalFee(e)}
                />
                {emptyInputs.includes("royaltiesFee") && (
                  <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
                    Required
                  </p>
                )}
                {validFee && (
                  <p className="mb-2 -mt-1 text-xs text-red" key="initial">
                    Royalty fee must be less than or equal to 100%
                  </p>
                )}
              </div>
              <div>
                <p className={styles.title}>Category</p>
                <div className="flex">
                  {Category.map((item, index) => (
                    <Button
                      type="button"
                      active={selectedCategory.includes(item.value)}
                      outline
                      className="px-3 py-1 mb-4 mr-4 text-sm h-[34px] text-dark2"
                      key={item.id}
                      onClick={() => selectCategory(item.value)}
                    >
                      {item.value}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="description" className={styles.title}>
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
                  className="flex items-center mb-1 text-base font-semibold gap-x-1 text-black24"
                >
                  <span>Traits</span>
                  <Tippy
                    interactive
                    content={
                      <span>
                        Traits describe attributes of your items. They appear as
                        filters inside your collection page and are also listed
                        out inside your item page.
                      </span>
                    }
                  >
                    <div>
                      <InforIcon width={16} height={16} />
                    </div>
                  </Tippy>
                </label>
                {attributeItems.map((item) => (
                  <div className="flex items-center gap-x-2" key={item.id}>
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
                    <div className="my-auto">
                      <CgClose
                        className="mb-4 text-xl transition-colors duration-100 ease-linear cursor-pointer hover:text-red"
                        onClick={() => handleRemoveAttribute(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {!isValidBtn && (
                <p className="mb-2 text-red">You need add property</p>
              )}
              <Button
                type="button"
                className="h-[37px] w-[150px] text-sm mb-4 text-secondary2 font-semibold border-secondary2 border-2 transition-all duration-300 ease-linear hover:bg-secondary2 hover:text-white"
                onClick={handleAddAttribute}
                disabled={!isValidBtn}
              >
                + Add Property
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
                setRoyaltiesFee={setRoyaltiesFee}
                fileType={fileType}
                totalSupply={totalSupply}
                royaltiesFee={royaltiesFee}
                validFee={validFee}
              />
            </form>
          </div>
        </div>
      </WithAuth>
    </>
  );
}
