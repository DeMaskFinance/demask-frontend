// import { ethers } from "ethers";
// import abiDemask from "@/abi/abiErc1155.json";
// import { toast } from "react-toastify";
// import {useState} from 'react'
// import TransitionURL from "@/components/Toast/TransionURL";
// interface LaunchPadProps {
//   initial: number;
//   price: number;
//   totalSale: number;
// }
// let transactionHash = '';
// export const launchPadSubmit = async ({
//   initial,
//   price,
//   startDate,
//   url,
//   data,
//   totalSale,
// }: any) => {
//   const totalSupply = initial + totalSale;
//   console.log(initial, price, totalSale, totalSupply, startDate, url, data);
//   const time = new Date(startDate);
//   console.log(time);
//   const ethereum = (window as any).ethereum;
//   if (typeof ethereum === "undefined") {
//     alert("Please install MetaMask to mint NFTs.");
//     return;
//   }

//   try {
//     await ethereum.request({ method: "eth_requestAccounts" });
//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const contractAddress = "0x8d74B2Ca8f6dfb9B1B77DCb5c489AA60Cf786E2B"; // Địa chỉ hợp đồng NFT
//     const contract = new ethers.Contract(contractAddress, abiDemask, signer);
//     const addressAccount = ethereum.selectedAddress;
//     console.log(addressAccount);

//     const checkExists = async (id: number): Promise<boolean> => {
//       const isExisting = await contract.exists(id);
//       return isExisting;
//     };
//     const generateRandomNumber = (): number => {
//       return Math.floor(Math.random() * 10000000000);
//     };
//     if (ethereum.networkVersion !== 80001) {
//       try {
//         await ethereum.request({
//           method: "wallet_switchEthereumChain",
//           params: [{ chainId: "0x13881" }],
//         });
//       } catch (errors: any) {
//         // This error code indicates that the chain has not been added to MetaMask
//         if (errors.code === 4902) {
//           await ethereum.request({
//             method: "wallet_addEthereumChain",
//             params: [
//               {
//                 chainName: "Mumbai",
//                 chainId: "0x13881",
//                 nativeCurrency: {
//                   name: "MATIC",
//                   decimals: 18,
//                   symbol: "MATIC",
//                 },
//                 rpcUrls: ["https://rpc.ankr.com/polygon_mumbai"],
//               },
//             ],
//           });
//         }
//       }
//     }

//     const checkAndLauchPadSubmit = async () => {
//       const randomID = generateRandomNumber();
//       const isExisting = await checkExists(randomID);
//       if (isExisting) {
//         checkAndLauchPadSubmit();
//       } else {
//         const startTimeTimestamp = 1693646483;
//         const endTimeTimestamp = 1693905683;
//         const transaction = await contract.launchpad_submit(
//           randomID,
//           initial,
//           price,
//           addressAccount,
//           totalSupply,
//           startTimeTimestamp,
//           endTimeTimestamp,
//           url,
//           data
//         );
//         await transaction.wait();
//         transactionHash = transaction.hash;
//         toast.success(<TransitionURL type={"Launchpad"} transactionHash={transactionHash}/>, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "light",
//         });
//       }
//     };
//     await checkAndLauchPadSubmit();
//   } catch (error) {
//     console.error("Failed to Launchpad:", error);
//   }
// };
