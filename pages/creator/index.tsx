import Button from "@/components/Button";
import Icons from "@/public/icons/icon";
import Image from "next/image";
import React, { DragEvent, useRef, useState } from "react";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark2",
  btnActive: "rounded-full bg-base2",
};
export default function Creator() {
  const itemRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState<string | null>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [activeButton, setActiveButton] = useState<string>("MINT");
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
        let fileReader = new FileReader();
        fileReader.onload = () => {
          let fileURL = fileReader.result;
          setFileType(fileType);
          setSelectedFile(fileURL);
        };
        fileReader.readAsDataURL(file);
      } else {
        alert("Lỗi file");
      }
    } else {
      alert("Bạn chưa chọn file");
    }
  }
  const handleButtonClick = (button: string) => {
    setActiveButton(button);
  };
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
          className={styles.inputItem}
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
            className={styles.inputItem}
          />
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
            className={styles.inputItem}
          />
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
            className={styles.inputItem}
          />
        </div>
        <div>
          <p className={styles.title}>Category</p>
          <p className="mb-4 text-3xl text-dark2">1,000</p>
        </div>
        <div>
          <p className={styles.title}>Launchpad start</p>
          <div className="grid h-[34px] grid-cols-2 rounded-full w-[110px] mb-4 text-sm bg-dark2 text-white">
            <button type="button">NOW</button>
            <button type="button">CUSTOM</button>
          </div>
          <input
            placeholder="May 23, 2023 1:45PM"
            type="text"
            id="dateNow"
            className={styles.inputItem}
          />
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
  return (
    <div className="flex py-8 px-[250px] 3xl:px-[444px] gap-x-[26px]">
      <div className="w-[504px] shrink-0">
        <h2 className="text-2xl">Create A New Item</h2>
        <p className="mt-2 mb-6 text-xs text-red">* Required fields</p>
        <div
          className="flex flex-col items-center text-center border border-dashed h-fit border-1 border-dark2 rounded-2xl"
          ref={itemRef}
          onDragOver={handleDragOver}
          onDragLeave={handleLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <>
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
                <>
                  <Image
                    src="/images/audio.svg"
                    alt="audioImage"
                    width={160}
                    height={160}
                    className="object-cover mt-6 mb-4 w-[160px] h-40 rounded-[2rem]"
                  />
                  <audio autoPlay loop muted controls src={selectedFile}>
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                </>
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
                <embed src={selectedFile} width={504} height={300} />
              )}
              <input
                ref={inputRef}
                type="file"
                hidden
                onChange={handleChangeFile}
              />
              <Button
                onClick={handleClickFile}
                className="mt-6 w-[160px] h-[26px]"
              >
                Edit file
              </Button>
            </>
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
      </div>
      <div className="w-full">
        <form method="post">
          <div>
            <label htmlFor="name" className={styles.title}>
              <span className="">NFT name</span>
              <span className="text-red">*</span>
            </label>
            <input
              placeholder="Name"
              type="text"
              id="name"
              className={styles.inputItem}
            />
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
              className={styles.inputItem}
            />
          </div>
          <div>
            <label htmlFor="description" className={styles.title}>
              <span>Description</span>
            </label>

            <textarea
              placeholder="Write a description of your nft ..."
              id="description"
              className={`${styles.inputItem} h-20 resize-none`}
            />
          </div>
          <div>
            <label htmlFor="attributes" className={styles.title}>
              <span>Attributes</span>
            </label>
            <div className="flex items-center gap-x-2">
              <input
                placeholder="Trait Type"
                type="text"
                id="traitType"
                className={styles.inputItem}
              />
              <input
                placeholder="Value"
                type="text"
                id="value"
                className={styles.inputItem}
              />
              <Image
                src={Icons.noneaCancelRight}
                alt="clear"
                className="mb-[14px] ml-2 cursor-pointer"
              />
            </div>
          </div>
          <Button className="h-[26px] w-[150px] text-sm mb-4">
            + ADD PROPERTY
          </Button>
          <div>
            <p className={styles.title}>Category</p>
            <Button
              type="button"
              className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
              secondary
            >
              Art
            </Button>
            <Button
              type="button"
              className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
            >
              Film
            </Button>
            <Button
              type="button"
              className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
              secondary
            >
              Music
            </Button>
            <Button
              type="button"
              className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
              secondary
            >
              Gaming
            </Button>
            <Button
              type="button"
              className="px-4 py-1 mb-4 mr-4 text-sm font-semibold"
              secondary
            >
              Memberships
            </Button>
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
        </form>
      </div>
    </div>
  );
}
