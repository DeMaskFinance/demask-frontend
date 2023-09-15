import React from "react";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";

const projectId = process.env.NEXT_PUBLIC_INFURA_KEY;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_SECRET;

const authorization =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const ipfs = create({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization,
  },
});
export async function uploadFileToIPFS(file:any) {
  if (file !== null) {
    try {
      const response = await ipfs.add(file);
      const ipfsUrl = `https://demask.infura-ipfs.io/ipfs/${response.path}`;
      console.log("IPFS URL:", ipfsUrl);
      // const cid = response.cid.toString();
      // console.log(`ipfs://${cid}`);
      return ipfsUrl;
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      throw error;
    }
  } else {
    alert("Bạn chưa chọn file");
  }
}
