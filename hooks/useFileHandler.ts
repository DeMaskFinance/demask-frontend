import { DragEvent, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

interface UseFileHandlerProps extends UploadFileProps {
  validInput: string[];
  setFieldValue: any;
}

const useFileHandler = ({
  validInput,
  uploadFile,
  fileType,
  selectedFile,
  setSelectedFile,
  setFileType,
  setFileIPFS,
  setFieldValue,
}: UseFileHandlerProps) => {
  const uploadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    itemRef.current?.classList.add("item-active-drap");
  };

  const handleLeave = (e: DragEvent<HTMLDivElement>) => {
    itemRef.current?.classList.remove("item-active-drap");
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      itemRef.current?.classList.remove("item-active-drap");
      itemRef.current?.classList.remove("border");
      await displayFile(droppedFile);
    }
  };

  const displayFile = useCallback(
    async (file: File) => {
      if (!file) {
        toast.error("No file selected");
        return;
      }

      let fileType = file.type;
      if (!validInput.includes(fileType)) {
        toast.error("Invalid file format");
        return;
      }

      if (file.size >= 1024 * 1024 * 5) {
        toast.warning("Please choose a file smaller than 5MB");
        return;
      }

      try {
        const fileURL = URL.createObjectURL(file);
        setFileType(fileType);
        setSelectedFile(fileURL);
        const ipfsHash = await uploadFile(file);
        setFileIPFS(ipfsHash);
        setFieldValue("avatar", file);
      } catch (error) {
        toast.error("Upload file error!");
      }
    },
    [validInput, uploadFile]
  );

  const handleChangeFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        itemRef.current?.classList.remove("item-active-drap");
        itemRef.current?.classList.remove("border");
        await displayFile(selectedFile);
      }
    },
    [displayFile]
  );

  const handleClickFile = useCallback(() => {
    inputRef.current?.click();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
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
