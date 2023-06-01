import React from "react";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import { errors, ethers } from "ethers";
import abiDemask from "./abiMumbai.json";
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
export async function uploadFileToIPFS(file) {
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
async function providerWallet(providerName) {
  const { ethereum } = window;
  if (!ethereum?.providers) {
    alert(`No ${providerName} provider found`);
    return undefined;
  }

  let provider;
  switch (providerName) {
    case "CoinBase":
      provider = ethereum.providers.find(
        ({ isCoinbaseWallet }) => isCoinbaseWallet
      );
      break;
    case "MetaMask":
      provider = ethereum.providers.find(({ isMetaMask }) => isMetaMask);
      break;
    default:
      console.log(errors);
  }

  if (provider) {
    ethereum.setSelectedProvider(provider);
  }
  if (!provider) {
    console.log(`No ${providerName} provider found`);
    return;
  }

  return provider;
}
export async function mintNFT() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask to mint NFTs.");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0xee45Cb2f44d1884ba3bE16779411b745D8A82dE3"; // Địa chỉ hợp đồng NFT
    const contract = new ethers.Contract(contractAddress, abiDemask, signer);

    console.log(provider);
    console.log(signer);
    console.log(contract);

    const tx = await contract.mint('0x1708e4e5a029339795ebb40957773b21b1af16e9', 106, 1, '0x', 'hihi');
    await tx.wait();
    const transactionHash = tx.hash;
    alert(`Transaction successful. https://mumbai.polygonscan.com/tx/${transactionHash}`);
    console.log('NFT minted successfully');
  } catch (error) {
    console.error("Failed to mint NFT:", error);
  }
}

// export async function mintNFT(provider){
//   console.log(provider);
//   // Kiểm tra mạng được chọn trên provider
//   const web3Provider = new ethers.providers.Web3Provider(provider);
//   const network = await web3Provider.getNetwork();

//   if (network.name !== "mumbai") {
//     alert("Vui lòng chọn mạng Polygon Mumbai Testnet trên MetaMask");
//     return;
//   }

//   try {
//     // Tạo đối tượng signer từ provider
//     const signer = web3Provider.getSigner();

//     // Địa chỉ hợp đồng NFT
//     const contractAddress = "0x1708e4e5a029339795ebb40957773b21b1af16e9";

//     // Tạo đối tượng hợp đồng NFT
//     const contract = new ethers.Contract(contractAddress, abiDemask, signer);

//     // Kiểm tra sự tồn tại của ID
//     const id = "101";
//     const exists = await contract.exists(id);

//     if (!exists) {
//       // Thực hiện mint NFT
//       const tx = await contract.mint("0x1708e4e5a029339795ebb40957773b21b1af16e9", 101, 1, "0x", "");
//       await tx.wait();
//       console.log("NFT minted successfully");
//       console.log("Transaction hash:", tx.hash);
//     } else {
//       console.log("ID already exists");
//     }
//   } catch (error) {
//     console.error("Failed to mint NFT:", error);
//   }
// }
