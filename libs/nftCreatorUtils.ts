import React from "react";
import { Buffer } from "buffer";
import { create } from "ipfs-http-client";
import Web3 from "web3";
import { errors, ethers } from "ethers";
import abiDemask from "./abiMumbai.json";

interface mintProps {
  amount:number,
  data:string,
  url:any,
}
const projectId = process.env.NEXT_PUBLIC_INFURA_KEY;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_SECRET;
const chainId = 80001 // Mumbai Testnet
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
async function providerWallet(providerName:string) {
  const { ethereum }:any = window;
  if (!ethereum?.providers) {
    alert(`No ${providerName} provider found`);
    return undefined;
  }

  let provider;
  switch (providerName) {
    case "CoinBase":
      provider = ethereum.providers.find(
        ({ isCoinbaseWallet }:any) => isCoinbaseWallet
      );
      break;
    case "MetaMask":
      provider = ethereum.providers.find(({ isMetaMask }:any) => isMetaMask);
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
export async function mintNFT({amount,data,url}:mintProps) {
  const ethereum = (window as any).ethereum;
  if (typeof ethereum === "undefined") {
    alert("Please install MetaMask to mint NFTs.");
    return;
  }

  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contractAddress = "0xee45Cb2f44d1884ba3bE16779411b745D8A82dE3"; // Địa chỉ hợp đồng NFT
    const contract = new ethers.Contract(contractAddress, abiDemask, signer);
    const addressAccount = ethereum.selectedAddress;
    console.log(addressAccount);
    
    const checkExists = async (id: number): Promise<boolean> => {
      const isExisting = await contract.exists(id);
      return isExisting;
    };
    const generateRandomNumber = (): number => {
      return Math.floor(Math.random() * 10000000000);
    };
    if(ethereum.networkVersion !== chainId){
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{chainId:"0x13881"}]
        });
      } catch (errors:any) {
          // This error code indicates that the chain has not been added to MetaMask
        if (errors.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Mumbai',
                chainId: "0x13881",
                nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                rpcUrls: ['https://rpc.ankr.com/polygon_mumbai']
              }
            ]
          });
        }
      }
    }
    
    const checkAndMint = async () =>{
      const randomID = generateRandomNumber();
      const isExisting = await checkExists(randomID);
      if (isExisting) {
        checkAndMint();
      } else{
        const tx = await contract.mint(addressAccount, randomID, amount, data , url);
        const transactionHash = tx.hash;
        alert(`Transaction successful. https://mumbai.polygonscan.com/tx/${transactionHash}`);
        console.log('NFT minted successfully');
        console.log('Token ID:', randomID);
      }
    }
    await checkAndMint();
  } catch (error) {
    console.error("Failed to mint NFT:", error);
  }
}

