import { toast } from "sonner";
import request from "../utils/httpRequest";
import { formatLinkIPFS } from "../utils/formatComon";
import axios from "axios";
const uploadFileIPFSMint = async (file: any) => {
  try {
    const uriImg = await uploadToIpfs(file);
    return formatLinkIPFS(uriImg);
  } catch (error) {
    console.error(error);
  }
};
const uploadFileIPFSCollection = async (file: any) => {
  try {
    const uriImg = await uploadToIpfs(file);
    const body = { ipfs: uriImg };
    const result = await request.post("add-collection-id", body);

    return result.data;
  } catch (error) {
    toast.error("Error upload file!");
    console.error(error);
  }
};

const uploadMetadataIPFS = async (body: any) => {
  try {
    const res = await request.post("upload-uri-thirdweb", body);
    return res.data.uri;
  } catch (error) {
    console.error(error);
  }
};

export const uploadToIpfs = async (file: File): Promise<string> => {
  try {
    const ipfsApiUrl = "https://ipfs-rpc.demask.finance/api/v0/add";
    const formData = new FormData();
    formData.append("file", file);

    return await new Promise(async (resolveOuter) => {
      await axios.post(ipfsApiUrl, formData, {
        onDownloadProgress({ event }) {
          if (event.target.status !== 200) {
            throw new Error(
              `Failed to upload to IPFS: ${event.target.statusText}`
            );
          }
          const { Hash } = JSON.parse(event.target.response);

          resolveOuter(`ipfs://${Hash}`);
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  } catch (error: any) {
    console.error("Error uploading to IPFS:", error.message || error);
    throw error;
  }
};

export { uploadFileIPFSCollection, uploadFileIPFSMint, uploadMetadataIPFS };
