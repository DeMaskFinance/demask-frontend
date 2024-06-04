import { useState, useRef, useCallback, useEffect, DragEvent } from "react";

interface UseFileHandlerProps extends UploadFileProps {
  validInput: string[];
}

const useFileHandler = ({
  validInput,
  uploadFile,
  fileType,
  selectedFile,
  setSelectedFile,
  setFileType,
  setFileIPFS,
}: UseFileHandlerProps) => {
  const uploadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  let file: File | null = null;

  const handleDragOver = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    itemRef.current?.classList.add("item-active-drap");
    await displayFile();
  };

  const handleLeave = (e: DragEvent<HTMLDivElement>) => {
    itemRef.current?.classList.remove("item-active-drap");
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    file = e.dataTransfer.files[0];
    itemRef.current?.classList.remove("item-active-drap");
    itemRef.current?.classList.remove("border");
    await displayFile();
  };

  const displayFile = useCallback(async () => {
    if (file) {
      let fileType = file.type;
      if (validInput.includes(fileType)) {
        if (file.size < 52428800) {
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
  }, [file, validInput, uploadFile]);

  const handleChangeFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        file = e.target.files[0];
        itemRef.current?.classList.remove("item-active-drap");
        itemRef.current?.classList.remove("border");
        displayFile();
      }
    },
    [displayFile]
  );

  const handleClickFile = useCallback(() => {
    inputRef.current?.click();
    console.log("123");
  }, []);

  useEffect(() => {
    if (selectedFile === null) {
      itemRef.current?.classList.add("border");
    }
  }, [selectedFile]);

  return {
    fileType,
    selectedFile,
    uploadRef,
    inputRef,
    itemRef,
    handleDragOver,
    handleLeave,
    handleDrop,
    handleChangeFile,
    handleClickFile,
  };
};

export default useFileHandler;
