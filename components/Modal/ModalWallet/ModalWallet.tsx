import images from "@/public/images";
import Image from "next/image";
import React, { useRef, useState, useEffect, useContext } from "react";
import { CgClose } from "react-icons/cg";
import { getProvider } from "@/libs/connection/getProvider";
import Web3 from "web3";
import { checkNetwork } from "@/libs/validation/checkNetwork";
import AccountContext from "@/context/AccountContext";
import Wrapper from "../Wrapper";
import { useWeb3Modal } from '@web3modal/react'
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useAccount, useDisconnect, useEnsName, useConnect } from 'wagmi'
import { ethers } from "ethers";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
interface ModalWalletProps {
  isOpen?: boolean;
  setIsOpen?: any;
}
const styles = {
  walletItem:
    "flex items-center px-4 py-4 gap-x-4 mx-4 hover:bg-dark4 rounded-lg cursor-pointer",
};

const ModalWallet: React.FC<ModalWalletProps> = ({ isOpen, setIsOpen }) => {
  const { account, wallet, chainId, demask, tokenDefault, updateAccount, updateWallet, updateChainId } = useContext(AccountContext);
  const [walletWeb3, setWalletWeb3] = useState("");
  const { open, close } = useWeb3Modal();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [tab, setTab] = useQueryParam("chain", withDefault(StringParam, chainId));
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpen(false);
  };
  useEffect(() => {
    if (isConnected) {
      // Thực hiện các hành động sau khi kết nối thành công
      updateAccount(address);
      updateWallet("WalletConnect");
      document.body.style.overflowY = "auto";
      setIsOpen(false);
    }
  }, [isConnected, address]);
  const connectWallet = async (walletName: string) => {
    switch (walletName) {
      case "Binance":
        if (window.BinanceChain) {
          try {
            const web3 = new Web3(window.BinanceChain);
            const accounts = await web3.eth.getAccounts();
            document.body.style.overflowY = "auto";
            updateAccount(accounts);
            updateWallet(walletName);
            console.log(accounts);
            setIsOpen(false);
            if (accounts.length > 0) {
              const balance = await web3.eth.getBalance(accounts[0]);
              console.log(balance);

              return true;
            } else {
              console.log("No account found");
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          alert("Binance Wallet not found");
          return false;
        }
      case "WalletConnect":
        // const providerWallet = getProvider(walletName);
        const providerWalletTest = await EthereumProvider.init({
          projectId: "1af0159e7a959f2fff3f96c541aef2cb", // REQUIRED your projectId
          chains: [1, 97, 80001, 280], // REQUIRED chain ids
          showQrModal: true, // REQUIRED set to "true" to use @walletconnect/modal
          methods: ["eth_sendTransaction"],
          events: ["eth_transactionHash"],
          // optionalEvents, // OPTIONAL ethereum events
          rpcMap: {
            "1": "https://mainnet.eth.aragon.network",
            "80001": "https://polygon-mumbai-bor.publicnode.com",
            "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
            "56": "https://bsc-dataseed.binance.org/",
            "280": "https://testnet.era.zksync.dev",
          },
        })
        // console.log(new Web3(providerWallet));
        // console.log(providerTest)

        updateWallet(walletName);
        try {
          // await open();
          // console.log(address);
          await providerWalletTest.connect();
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        const provider = getProvider(walletName);
        const networkSwitched = await changeNetwork(chainId, walletName, demask, setIsOpen, updateChainId, setTab);
        console.log(networkSwitched);

        if (!networkSwitched) {
          return;
        }
        try {
          const accounts = await provider
            .request({
              method: "eth_requestAccounts",
            })
            .catch((error: any) => {
              if (error.code === 4001) {
                // EIP-1193 userRejectedRequest error
                console.log("Please connect to MetaMask.");
              } else {
                console.error(error);
              }
            });
          updateAccount(accounts[0]);
          updateWallet(walletName);
          setWalletWeb3(walletName);
          document.body.style.overflowY = "auto";
          setIsOpen(false);
          console.log(accounts);
        } catch (error: any) {
          console.log(error);
        }
    }
  };

  return (
    <Wrapper isOpen={isOpen} onClick={handleClose}>
      <div className="w-[550px] h-fit max-w-[calc(100%-32px)] bg-white text-black text-center rounded-lg relative pb-4">
        <h2 className="p-6 mb-3 text-xl font-medium">Connect your wallet</h2>
        <p>If you don't have a wallet, you can create one now.</p>
        <div className="mt-4 font-medium">
          <div
            className={styles.walletItem}
            onClick={() => connectWallet("Metamask")}
          >
            <Image src={images.metamaskWallet} alt="Metamask" className="w-8" />
            <p>MetaMask</p>
          </div>
          <div
            className={styles.walletItem}
            onClick={() => connectWallet("Coinbase")}
          >
            <Image src={images.coinbaseWallet} alt="Coinbase" className="w-8" />
            <p>Coinbase</p>
          </div>
          <div
            className={styles.walletItem}
            onClick={() => connectWallet("WalletConnect")}
          >
            <Image
              src={images.walletConnect}
              alt="Wallet connect"
              className="w-8"
            />
            <p>WalletConnect</p>
          </div>
          <div
            className={styles.walletItem}
            onClick={() => connectWallet("Binance")}
          >
            <Image
              src={images.binanceWallet}
              alt="Binance wallet"
              className="w-8"
            />
            <p>Binance wallet</p>
          </div>
          {/* {isConnected ? (
            <>
              <p>{address}</p>
              <button onClick={() => disconnect}>Disconnect</button>
            </>
          ) : (
            <button onClick={() => console.log("abc")}>Disconnect</button>
          )} */}
        </div>
        <button
          className="absolute top-0 right-0 p-6 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
        </button>
      </div>
    </Wrapper>
  );
};

export default ModalWallet;
