import Button from "@/components/Buttons/Button";
import Icons from "@/public/icons/icon";
import Head from "next/head";
import Image from "next/image";
import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import "react-datepicker/dist/react-datepicker.css";
import { uploadFileToIPFS } from "@/libs/utils/uploadFileIPFS";
import MintNFT from "@/components/Creator/MintNFT";
import { LaunchPad } from "@/components/Creator";
import images from "@/public/images";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark3",
  btnActive: "rounded-lg bg-secondary5",
};
export default function Creator() {
  const itemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [emptyInputs, setEmptyInputs] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileIPFS, setFileIPFS] = useState<any>(null);
  const [activeButton, setActiveButton] = useState<string>("MINT");
  const [attributeItems, setAttributeItems] = useState([
    { id: 0, trait_type: "", value: "" },
  ]);
  const [isValidBtn, setIsValidBtn] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  let file: any;
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    itemRef.current?.classList.add("item-active-drap");
  };
  const handleLeave = (e: DragEvent<HTMLDivElement>) => {
    itemRef.current?.classList.remove("item-active-drap");
  };
  console.log(selectedFile);
  console.log(fileIPFS);
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    file = e.dataTransfer.files[0];
    itemRef.current?.classList.remove("item-active-drap");
    itemRef.current?.classList.remove("border");
    displayFile();
  };
  const handleClickFile = () => {
    inputRef.current?.click();
  };
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      file = e.target.files[0];
      itemRef.current?.classList.remove("item-active-drap");
      itemRef.current?.classList.remove("border");
      displayFile();
    }
  };
  function displayFile() {
    if (file) {
      let fileType = file.type;
      let validExtensions = [
        "video/mp4",
        "video/x-msvideo",
        "video/x-matroska",
        "video/quicktime",
        "video/x-ms-wmv",
        "video/x-flv",
        "video/webm",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/aac",
        "audio/flac",
        "audio/x-ms-wma",
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/svg+xml",
        "image/tiff",
      ];
      if (validExtensions.includes(fileType)) {
        if (file.size < 1073741824) {         
          const fileURL = URL.createObjectURL(file);
          setFileType(fileType);
          setSelectedFile(fileURL);
          setFileIPFS(uploadFileToIPFS(file));
        } else {
          alert("Vui lòng chọn file nhỏ hơn 1GB");
        }
      } else {
        alert("Lỗi định dạng file");
      }
    } else {
      alert("Bạn chưa chọn file");
    }
  }
  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };
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

  const Category = [
    {
      id: 1,
      value: "Art",
    },
    {
      id: 2,
      value: "Film",
    },
    {
      id: 3,
      value: "Music",
    },
    {
      id: 4,
      value: "Gaming",
    },
    {
      id: 5,
      value: "Memberships",
    },
  ];
  const handleTextareaResize = (event:any) => {
    const textarea = event.target;
    textarea.style.height = "auto"; // reset height

    const { scrollHeight, clientHeight } = textarea;
    const minHeight = parseInt(window.getComputedStyle(textarea).minHeight);

    textarea.style.height = Math.max(scrollHeight, clientHeight, minHeight) + "px";
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        uploadRef.current?.classList.add('fixed','top-[40px]');
      } else {
        uploadRef.current?.classList.remove('fixed','top-[40px]');
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(()=>{
    if(selectedFile===null){
      itemRef.current?.classList.add("border");
    }
  },[selectedFile])
  return (
    <div className="flex py-8 px-[250px] 3xl:px-[444px] gap-x-[26px]">
      <Head>
        <title>Creator | DeMask</title>
      </Head>
      {/* UpLoad File */}
      <div className="w-[504px] shrink-0">
        <h2 className="text-2xl">Create A New Item</h2>
        <p className="mt-2 mb-6 text-xs text-red">* Required fields</p>
        <div className="flex flex-col items-center w-[504px]" ref={uploadRef}>
          <div
            className="flex flex-col items-center w-full text-center border border-dashed h-fit border-1 border-dark2 rounded-2xl"
            ref={itemRef}
            onDragOver={handleDragOver}
            onDragLeave={handleLeave}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div>
                {fileType?.startsWith("image/") && (
                  <Image
                    src={selectedFile}
                    alt="pictureframe"
                    width={504}
                    height={160}
                    className="object-cover max-w-[504px] max-h-[590px] rounded-2xl"
                  />
                )}
                {fileType?.startsWith("audio/") && (
                  <div className="flex flex-col items-center">
                    <Image
                      src="/images/audio.svg"
                      alt="audioImage"
                      width={360}
                      height={360}
                      className="object-cover mt-6 mb-4 w-[540px] h-[360px] rounded-[2rem] mx-auto"
                    />
                    <audio autoPlay loop muted controls src={selectedFile}>
                      Your browser does not support the
                      <code>audio</code> element.
                    </audio>
                  </div>
                )}
                {fileType?.startsWith("video/") && (
                  <video
                    src={selectedFile}
                    autoPlay
                    loop
                    muted
                    controls
                    width={504}
                    height={288}
                    className="rounded-2xl"
                  />
                )}
                {fileType === "application/pdf" && (
                  <embed
                    src={selectedFile}
                    width={504}
                    height={500}
                    type="application/pdf"
                  />
                )}
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  onChange={handleChangeFile}
                />
              </div>
            ) : (
              <div onClick={handleClickFile} className="cursor-pointer">
                <Image
                  src={images.pictureFrame}
                  alt="pictureframe"
                  width={160}
                  height={160}
                  className="object-cover mt-6 mb-4 w-[160px] h-40 rounded-[2rem] mx-auto"
                />
                <p>Upload media</p>
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  onChange={handleChangeFile}
                />
                <p className="text-xs w-[254px] text-dark2 mb-6">
                  Tap here to upload media from your device. Video, audio, gif,
                  pdf, and images supported. Max size: 1GB.
                </p>
              </div>
            )}
          </div>
          {selectedFile && (
            <Button
              onClick={handleClickFile}
              className="mt-6 w-[160px] h-[34px]"
              primary
            >
              Edit file
            </Button>
          )}
        </div>
      </div>
      <div className="w-full">
        <form id="creator">
          <div>
            <label htmlFor="name" className={styles.title}>
              <span className="">NFT name</span>
              <span className="text-red">*</span>
            </label>
            <input
              placeholder="Name"
              type="text"
              id="name"
              value={name}
              className={
                emptyInputs.includes("name")
                  ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                  : styles.inputItem
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
              className={
                emptyInputs.includes("symbol")
                  ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                  : styles.inputItem
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
            <label htmlFor="description" className={styles.title}>
              <span>Description</span>
            </label>

            <textarea
              placeholder="Write a description of your nft ..."
              id="description"
              value={description}
              rows={4}
              className={`${styles.inputItem} resize-none`}
              onChange={(e) => {
                setDescription(e.target.value);
                handleTextareaResize(e);
              }}
            />
          </div>
          <div>
            <label htmlFor="attributes" className={styles.title}>
              <span>Attributes</span>
            </label>
            {attributeItems.map((item) => (
              <div className="flex items-center gap-x-2" key={item.id}>
                <input
                  placeholder="Trait Type"
                  type="text"
                  id={`traitType_${item.id}`}
                  value={item.trait_type}
                  className={styles.inputItem}
                  onChange={(e) => handleChangeAttributeType(e, item.id)}
                />
                <input
                  placeholder="Value"
                  type="text"
                  id={`value_${item.id}`}
                  value={item.value}
                  className={styles.inputItem}
                  onChange={(e) => handleChangeAttributeValue(e, item.id)}
                />
                <Image
                  src={Icons.deleteIcon}
                  alt="Delete property"
                  className="mb-[14px] ml-2 cursor-pointer"
                  onClick={() => handleRemoveAttribute(item.id)}
                />
              </div>
            ))}
          </div>
          {!isValidBtn && (
            <p className="mb-2 text-red">You need add property</p>
          )}
          <Button
            type="button"
            className="h-[34px] w-[150px] text-sm mb-4"
            primary
            onClick={handleAddAttribute}
            disabled={!isValidBtn}
          >
            + ADD PROPERTY
          </Button>
          <div>
            <p className={styles.title}>Category</p>
            {Category.map((item, index) => (
              <Button
                type="button"
                active={selectedCategory.includes(item.value)}
                outline
                className="px-3 py-1 mb-4 mr-4 text-sm h-[34px] uppercase text-dark2"
                key={item.id}
                onClick={() => selectCategory(item.value)}
              >
                {item.value}
              </Button>
            ))}
          </div>
          <div>
            <p className={styles.title}>Mint Option</p>
            <div className="grid h-[34px] grid-cols-2 rounded-lg w-[162px] mb-4 text-sm bg-dark2 text-white">
              <button
                type="button"
                className={activeButton === "MINT" ? styles.btnActive : ""}
                onClick={() => handleButtonClick("MINT")}
              >
                MINT
              </button>
              <button
                type="button"
                className={activeButton === "LAUNCHPAD" ? styles.btnActive : ""}
                onClick={() => handleButtonClick("LAUNCHPAD")}
              >
                LAUNCHPAD
              </button>
            </div>
          </div>

          {activeButton === "MINT" ? (
            <MintNFT
              name={name}
              symbol={symbol}
              attributeItems={attributeItems}
              description={description}
              fileIPFS={fileIPFS}
              selectedCategory={selectedCategory}
              setEmptyInputs={setEmptyInputs}
              emptyInputs={emptyInputs}
              setName= {setName}
              setSymbol = {setSymbol}
              setFileIPFS = {setFileIPFS}
              setDescription = {setDescription}
              setAttributeItems ={setAttributeItems}
              setSelectedCategory={setSelectedCategory}
              setSelectedFile = {setSelectedFile}
              fileType = {fileType}
            />
          ) : (
            <LaunchPad
              name={name}
              symbol={symbol}
              attributeItems={attributeItems}
              description={description}
              fileIPFS={fileIPFS}
              selectedCategory={selectedCategory}
              setEmptyInputs={setEmptyInputs}
              emptyInputs={emptyInputs}
              setName= {setName}
              setSymbol = {setSymbol}
              setFileIPFS = {setFileIPFS}
              setDescription = {setDescription}
              setAttributeItems ={setAttributeItems}
              setSelectedCategory={setSelectedCategory}
              setSelectedFile = {setSelectedFile}
              fileType = {fileType}
            />
          )}
        </form>
      </div>
    </div>
  );
}
