import useFileHandler from "@/hooks/useFileHandler";
import { validCollectionInput, validNFTsInput } from "@/libs/constants";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import Image from "next/image";
import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { Button } from "../Buttons";
import { CreateIcon, DeployIcon, UploadIcon } from "../Icons";
const UploadFileNFT: React.FC<UploadFileProps> = ({
  setFileIPFS,
  setFileType,
  selectedFile,
  setSelectedFile,
  fileType,
  uploadFile,
}) => {
  const validInput = validNFTsInput;
  const [fieldValue, setFieldValue] = useState();
  const {
    uploadRef,
    inputRef,
    itemRef,
    handleDragOver,
    handleLeave,
    handleDrop,
    handleChangeFile,
    handleClickFile,
  } = useFileHandler({
    validInput,
    fileType,
    selectedFile,
    setSelectedFile,
    setFileType,
    uploadFile,
    setFileIPFS,
    setFieldValue,
  });
  return (
    <div className="relative flex flex-col items-center w-full" ref={uploadRef}>
      <div
        className={`flex flex-col items-center w-full text-center border border-dashed group h-fit justify-center border-1 border-shader_500 rounded-xl`}
        ref={itemRef}
        onDragOver={handleDragOver}
        onDragLeave={handleLeave}
        onDrop={handleDrop}
      >
        {selectedFile ? (
          <div className="w-full">
            {fileType?.startsWith("image/") && (
              <Image
                src={selectedFile}
                alt="pictureframe"
                width={504}
                height={160}
                sizes="100vw"
                quality={100}
                className="object-cover w-full h-full rounded-2xl aspect-square"
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
              accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, video/mp4, video/quicktime, audio/mpeg, audio/mp3, audio/x-m4a, audio/vnd.wav, audio/vnd.wave, audio/wav, audio/wave, audio/x-wav, audio/aiff"
            />
          </div>
        ) : (
          <div
            onClick={handleClickFile}
            className="cursor-pointer h-[60vh] flex flex-col justify-center w-full items-center"
          >
            <div className="p-2 bg-primary_500 bg-opacity-[0.15] w-10 h-10 rounded-lg">
              <CreateIcon width={24} height={24} />
            </div>
            <p className="font-semibold text-white title">
              Drag or drop to upload image
            </p>
            <input
              ref={inputRef}
              type="file"
              hidden
              onChange={handleChangeFile}
              accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, video/mp4, video/quicktime, audio/mpeg, audio/mp3, audio/x-m4a, audio/vnd.wav, audio/vnd.wave, audio/wav, audio/wave, audio/x-wav, audio/aiff"
            />
            <div className="text-sm w-[254px] text-shader_200 mb-6 transition-all duration-200 mt-2">
              File types: JPG,PNG,SVG or GIF
              <p className="">Max size: 5MB.</p>
            </div>
            <Button active>
              <UploadIcon />
              <p className="ml-2">Upload Image</p>
            </Button>
          </div>
        )}
      </div>
      {selectedFile && (
        <button
          className="absolute right-2 top-2 w-[28px] h-[28px] rounded-full text-white bg-black flex items-center justify-center cursor-pointer"
          onClick={() => {
            setSelectedFile("");
            setFileIPFS("");
            itemRef.current?.classList.add("border");
          }}
        >
          <CgClose />
        </button>
      )}
    </div>
  );
};
interface UploadCollectionProps extends UploadFileProps {
  setFieldValue: any;
  values: any;
}
const UploadFileCollection: React.FC<UploadCollectionProps> = ({
  setFileIPFS,
  setFileType,
  selectedFile,
  setSelectedFile,
  fileType,
  uploadFile,
  setFieldValue,
  values,
}) => {
  const validInput = validCollectionInput;
  const {
    uploadRef,
    inputRef,
    itemRef,
    handleDragOver,
    handleLeave,
    handleDrop,
    handleChangeFile,
    handleClickFile,
  } = useFileHandler({
    validInput,
    fileType,
    selectedFile,
    setSelectedFile,
    setFileType,
    uploadFile,
    setFileIPFS,
    setFieldValue,
  });
  return (
    <div className="relative flex flex-col items-center w-full" ref={uploadRef}>
      <div
        className={`flex w-full gap-x-6 text-center p-1 group h-fit border-1 border-shader_500 rounded-xl cursor-pointer`}
        ref={itemRef}
        onDragOver={handleDragOver}
        onDragLeave={handleLeave}
        onDrop={handleDrop}
        onClick={handleClickFile}
      >
        {selectedFile ? (
          <div className="relative w-40 h-40">
            <Image
              src={selectedFile}
              alt="pictureframe"
              width={504}
              height={160}
              sizes="100vw"
              quality={100}
              className="object-cover w-full h-full rounded-2xl aspect-square"
            />
            {/* {selectedFile && (
              <button
                className="absolute right-2 z-100 top-2 w-[28px] h-[28px] rounded-full text-white bg-black flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile("");
                  itemRef.current?.classList.add("border");
                }}
              >
                <CgClose />
              </button>
            )} */}
          </div>
        ) : values.avatar ? (
          <div className="relative w-40 h-40">
            <img
              src={formatLinkIPFS(values.avatar)}
              alt="avatar"
              width={504}
              height={160}
              sizes="100vw"
              className="object-cover w-full h-full rounded-2xl aspect-square"
            />
          </div>
        ) : (
          <div className="flex w-40 h-40 cursor-pointer group gap-x-6">
            <div className="p-2 bg-shader_400 bg-opacity-[0.15] w-40 h-40 rounded-lg items-center border border-shader_500 relative">
              <DeployIcon
                width={24}
                height={24}
                className="group-hover:-translate-y-[150%] inset-0 m-auto absolute transition-all duration-200 ease-linear group-hover:opacity-0"
              />
              <UploadIcon
                width={24}
                height={24}
                className="transition-all duration-200 opacity-0 group-hover:opacity-100 ease-linear inset-0 mx-auto top-1/2 translate-y-[150%] group-hover:-translate-y-[65%] absolute text-primary_400"
              />
            </div>
          </div>
        )}
        <div className="self-center text-left">
          <h5 className="title">Drag or drop to upload image</h5>
          <div className="text-sm text-shader_200">
            <p>Recommended size: 300 x 300px.</p>
            <p>File types: JPG, PNG, SVG, or GIF</p>
            <p >Max size: 5MB.</p>
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        id="avatar"
        name="avatar"
        hidden
        onChange={handleChangeFile}
        accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif"
      />
    </div>
  );
};
export { UploadFileCollection, UploadFileNFT };
