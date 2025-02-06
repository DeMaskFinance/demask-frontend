import { toast } from "sonner";
import request from "../utils/httpRequest";
import { formatLinkIPFS } from "../utils/formatComon";
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

const uploadMetadataIPFS = async (metadata: any) => {
  const ipfsApiUrl = "https://ipfs-rpc.demask.finance/api/v0/add";
  const formData = new FormData();

  formData.append(
    "file",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  const response = await fetch(ipfsApiUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to upload metadata to IPFS: ${response.statusText}`
    );
  }

  const data = await response.json();
  return `ipfs://${data.Hash}`;
};

export const uploadToIpfs = async (file: File): Promise<string> => {
  const ipfsApiUrl = "https://ipfs-rpc.demask.finance/api/v0/add";
  const formData = new FormData();

  formData.append("file", file);
  const response = await fetch(`${ipfsApiUrl}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload to IPFS: ${response.statusText}`);
  }
  const data = await response.json();
  return `ipfs://${data.Hash}`;
};

export { uploadFileIPFSCollection, uploadFileIPFSMint, uploadMetadataIPFS };
