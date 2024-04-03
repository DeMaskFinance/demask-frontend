import { useStorageUpload } from "@thirdweb-dev/react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
const useIPFSUpload = () => {
  const { mutateAsync: upload } = useStorageUpload();

  const uploadData = async (file:any) => {
    try {
      const uris = await upload({ data: [file] });
      console.log(uris);
      return uris; 
    } catch (error) {
      console.error("Error uploading data:", error);
      throw error;
    }
  };
  
  return { uploadData };
};

export default useIPFSUpload;