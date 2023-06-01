import Button from "@/components/Button";
import Icons from "@/public/icons/icon";
import { format } from "date-fns";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import Head from "next/head";
import Image from "next/image";
import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { mintNFT, uploadFileToIPFS } from '../../libs/nftCreatorUtils';
import Web3 from "web3";
import { ethers,errors } from "ethers";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark2",
  btnActive: "rounded-full bg-base2",
};
const attributeItems = [];
export default function Creator() {
  const itemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [emptyInputs, setEmptyInputs] = useState<string[]>([]);
  const datePickerRef = useRef<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [required, setRequired] = useState<string>("");
  const [providerCreator,setProviderCreator] =useState<any>('')
  const [startDate, setStartDate] = useState<any>(
    setHours(
      setMinutes(new Date(), new Date().getMinutes()),
      new Date().getHours()
    )
  );
  const [fileType, setFileType] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileIPFS,setFileIPFS] = useState<any>(null);
  const [activeButton, setActiveButton] = useState<string>("MINT");
  const [attributeType, setAttributeType] = useState("");
  const [attributeValue, setAttributeValue] = useState("");
  const [attributeItems, setAttributeItems] = useState([
    { id: 0, trait_type: "", value: "" },
  ]);
  const [isValidBtn, setIsValidBtn] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [launchActive, setLaunchActive] = useState<string>("NOW");
  let file: any;
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    itemRef.current?.classList.add("item-active-drap");
  };
  const handleLeave = (e: DragEvent<HTMLDivElement>) => {
    itemRef.current?.classList.remove("item-active-drap");
  };
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
    if (attributeItems.some((item) => item.trait_type === "" || item.value === "")) {
      setIsValidBtn(false);
    } else {
      setIsValidBtn(true);
      setAttributeItems([...attributeItems, newItem]);
    }
  };
  console.log(attributeItems);

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
  console.log(selectedCategory);
  
  const changeLaunchStart = (option: string) => {
    setLaunchActive(option);
    if (option === "NOW") {
      setStartDate(
        setHours(
          setMinutes(new Date(), new Date().getMinutes()),
          new Date().getHours()
        )
      );
    }
  };
  const handleDateChange = (date: any) => {
    setStartDate(date);
    setLaunchActive("CUSTOM");
  };
  async function activateInjectedProvider(providerName:string) {
    const { ethereum }:any = window;
    if (!ethereum?.providers) {
      alert(`No ${providerName} provider found`);
      return undefined;
    }
  
    let provider;
    switch (providerName) {
      case "CoinBase":
        provider = ethereum.providers.find(
          ({ isCoinbaseWallet }:any) => isCoinbaseWallet
        );
        break;
      case "MetaMask":
        provider = ethereum.providers.find(({ isMetaMask }:any) => isMetaMask);
        break;
      default:
        console.log(errors);
    }
  
    if (provider) {
      ethereum.setSelectedProvider(provider);
      setProviderCreator(provider)
    }
    if (!provider) {
      console.log(`No ${providerName} provider found`);
      return;
    }
    try {
      const account = await provider.request({ method: "eth_requestAccounts" });
      console.log(account);
    } catch (error:any) {
      // console.error(`Failed to activate ${providerName} provider.`, error);
      // setIsConnected(false)
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        alert(`Please connect to ${providerName}`);
        return;
      } else {
        console.error(error);
      }
    }
  }
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
  const Mint = () => {
    return (
      <div className="w-[220px]">
        <label htmlFor="totalSupply" className={styles.title}>
          <span>Total Supply</span>
        </label>

        <input
          placeholder="10,000"
          type="number"
          id="totalSupply"
          name="totalSupply"
          className={
            emptyInputs.includes("totalSupply")
              ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
              : styles.inputItem
          }
        />
      </div>
    );
  };
  const Launchpad = () => {
    return (
      <div>
        <div>
          <label htmlFor="initial" className={styles.title}>
            <span className="">Initial</span>
            <span className="text-red">*</span>
          </label>
          <input
            placeholder="Initial"
            type="text"
            id="initial"
            name="initial"
            className={
              emptyInputs.includes("initial")
                ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                : styles.inputItem
            }
          />
          {emptyInputs.includes("initial") && (
            <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="initial">
              Required
            </p>
          )}
        </div>
        <div>
          <label htmlFor="totalSale" className={styles.title}>
            <span className="">Total Sale</span>
            <span className="text-red">*</span>
          </label>
          <input
            placeholder="Total Sale"
            type="text"
            id="totalSale"
            name="totalSale"
            className={
              emptyInputs.includes("totalSale")
                ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                : styles.inputItem
            }
          />
          {emptyInputs.includes("totalSale") && (
            <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalSale">
              Required
            </p>
          )}
        </div>
        <div>
          <label htmlFor="tokenPayment" className={styles.title}>
            <span className="">Token Payment</span>
            <span className="text-red">*</span>
          </label>
          <input
            placeholder="0x3248"
            type="text"
            id="tokenPayment"
            name="tokenPayment"
            className={
              emptyInputs.includes("tokenPayment")
                ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                : styles.inputItem
            }
          />
          {emptyInputs.includes("totalSale") && (
            <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalSale">
              Required
            </p>
          )}
        </div>
        <div>
          <p className={styles.title}>Price</p>
          <p className="mb-4 text-3xl text-dark2">1,000</p>
        </div>
        <div>
          <p className={styles.title}>Launchpad start</p>
          <div className="grid h-[34px] grid-cols-2 rounded-full w-[120px] mb-4 text-sm bg-dark2 text-white">
            <button
              type="button"
              className={`${
                launchActive === "NOW" ? "rounded-full bg-base2" : ""
              }`}
              onClick={() => changeLaunchStart("NOW")}
            >
              NOW
            </button>
            <button
              type="button"
              className={`${
                launchActive === "CUSTOM" ? "rounded-full bg-base2" : ""
              }`}
              onClick={() => changeLaunchStart("CUSTOM")}
            >
              CUSTOM
            </button>
          </div>
          <div className="w-full mb-4 border rounded-lg border-dark2">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              showTimeSelect
              excludeTimes={[]}
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full h-full py-3 pl-2 border-none rounded-lg text-customDate"
              ref={datePickerRef}
            />
          </div>
        </div>
        <div>
          <p className={styles.title}>Launchpad duration</p>
          <Button className="px-4 py-1 mb-4 mr-4 text-sm font-semibold">
            1 day
          </Button>
          <Button
            className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
            secondary
          >
            3 days
          </Button>
          <Button
            className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
            secondary
          >
            7 days
          </Button>
          <Button
            className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
            secondary
          >
            14 days
          </Button>
          <Button
            className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
            secondary
          >
            Custom
          </Button>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const emptyInputFields = [];

    if (data.get("name") === "") {
      emptyInputFields.push("name");
    }

    if (data.get("symbol") === "") {
      emptyInputFields.push("symbol");
    }

    if (data.get("initial") === "") {
      emptyInputFields.push("initial");
    }

    if (data.get("totalSale") === "") {
      emptyInputFields.push("totalSale");
    }
    if (data.get("tokenPayment") === "") {
      emptyInputFields.push("tokenPayment");
    }
    setEmptyInputs(emptyInputFields);
    if (emptyInputFields.length === 0) {
      const simplifiedAttributes = attributeItems.map(({ trait_type, value }) => ({ trait_type, value }));
      const metadata = JSON.stringify({
      name: data.get('name'),
      symbol:data.get('symbol'),
      description:data.get('description'),
      image:await fileIPFS,
      attributes:simplifiedAttributes,
      category:selectedCategory,
    })
      const urlMetadata = await uploadFileToIPFS(metadata);
      console.log(urlMetadata);
      
      mintNFT({ amount: Number(data.get("totalSupply")), data: '0x', url: urlMetadata })
    }
    
  };
  
  console.log(fileIPFS);
  return (
    <div className="flex py-8 px-[250px] 3xl:px-[444px] gap-x-[26px]">
      <Head>
        <title>Creator | DeMask</title>
      </Head>
      {/* UpLoad File */}
      <div className="w-[504px] shrink-0">
        <h2 className="text-2xl">Create A New Item</h2>
        <p className="mt-2 mb-6 text-xs text-red">* Required fields</p>
        <div className="flex flex-col items-center ">
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
                  src="/images/pictureframe.png"
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
                <p className="text-xs w-[239px] text-dark2 mb-6">
                  Tap here to upload media from your device. Video, audio, gif,
                  pdf, and images supported. Max size: 1GB.
                </p>
              </div>
            )}
          </div>
          {selectedFile && (
            <Button
              onClick={handleClickFile}
              className="mt-6 w-[160px] h-[26px]"
            >
              Edit file
            </Button>
          )}
        </div>
      </div>
      <div className="w-full">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className={styles.title}>
              <span className="">NFT name</span>
              <span className="text-red">*</span>
            </label>
            <input
              placeholder="Name"
              type="text"
              id="name"
              name="name"
              className={
                emptyInputs.includes("name")
                  ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                  : styles.inputItem
              }
              
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
              name="symbol"
              className={
                emptyInputs.includes("symbol")
                  ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                  : styles.inputItem
              }
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
              name="description"
              className={`${styles.inputItem} h-20 resize-none`}
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
                  className={styles.inputItem}
                  onChange={(e) => handleChangeAttributeType(e, item.id)}
                />
                <input
                  placeholder="Value"
                  type="text"
                  id={`value_${item.id}`}
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
            className="h-[26px] w-[150px] text-sm mb-4"
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
                className={`px-4 py-1 mb-4 mr-4 text-sm font-semibold ${selectedCategory.includes(item.value)?'bg-base2 text-white':'bg-dark2'}`}
                key={item.id}
                onClick={() => selectCategory(item.value)}
              >
                {item.value}
              </Button>
            ))}
          </div>
          <div>
            <p className={styles.title}>Mint Option</p>
            <div className="grid h-[34px] grid-cols-2 rounded-full w-[162px] mb-4 text-sm bg-dark2 text-white">
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
          {activeButton === "MINT" ? <Mint /> : <Launchpad />}
          <Button type="submit" className="px-4 py-1">
            CREATE
          </Button>
          {/* <Button type="button" className="px-4 py-1" onClick={() => activateInjectedProvider('MetaMask')}>
            Connect
          </Button> */}
        </form>
      </div>
    </div>
  );
}
