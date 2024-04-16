import Image from "next/image";
import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../Buttons";
import { PictureMint } from "../Icons";
interface UploadFileProps {
  setFileIPFS: any;
  fileType?: string | null;
  setFileType?: any;
  uploadFile?: any;
}
const UploadFile: React.FC<UploadFileProps> = ({
  setFileIPFS,
  setFileType,
  fileType,
  uploadFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
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
  async function displayFile() {
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
        "image/jpg",
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
          setFileIPFS(await uploadFile(file));
        } else {
          alert("Please choose a file smaller than 1GB");
        }
      } else {
        alert("File format error");
      }
    } else {
      console.log("No file");
    }
  }
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      file = e.target.files[0];
      itemRef.current?.classList.remove("item-active-drap");
      itemRef.current?.classList.remove("border");
      displayFile();
    }
  };
  const handleClickFile = () => {
    inputRef.current?.click();
  };
  return (
    <div className="flex flex-col items-center w-full" ref={uploadRef}>
      <div
        className={`flex flex-col items-center w-full text-center border border-dashed group h-fit justify-center border-1 border-dark2 rounded-2xl`}
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
              accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, text/html, video/mp4, video/quicktime, audio/mpeg, audio/mp3, audio/x-m4a, audio/vnd.wav, audio/vnd.wave, audio/wav, audio/wave, audio/x-wav, audio/aiff, application/pdf, application/zip"
            />
          </div>
        ) : (
          <div
            onClick={handleClickFile}
            className="cursor-pointer h-fit lg:h-[60vh] flex flex-col justify-center"
          >
            <PictureMint
              width={160}
              height={160}
              className="mx-auto transition-all duration-200 group-hover:fill-dark2"
            />
            <p className="font-semibold text-dark1 title">Upload</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpg, image/jpeg, image/png, image/svg+xml, image/gif, video/mp4, video/quicktime, audio/mpeg, audio/mp3, audio/x-m4a, audio/vnd.wav, audio/vnd.wave, audio/wav, audio/wave, audio/x-wav, audio/aiff, application/pdf"
              hidden
              onChange={handleChangeFile}
            />
            <div className="text-sm w-[254px] text-dark3 mb-6 transition-all duration-200 group-hover:text-dark2">
              <span>Video, audio, gif, pdf, and images supported.</span>{" "}
              <span className="text-dark2">Max size: 1GB.</span>
            </div>
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
  );
};

export default UploadFile;
