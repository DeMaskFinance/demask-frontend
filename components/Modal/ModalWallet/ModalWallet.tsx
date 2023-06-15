import images from "@/public/images";
import Image from "next/image";
import React, { useRef, useState,useEffect, useContext } from "react";
import { CgClose } from "react-icons/cg";
import { getProvider } from "@/libs/connection/getProvider";
import Web3 from "web3";
import { checkNetwork } from "@/libs/validation/checkNetwork";
import WalletConnectProvider from "@walletconnect/web3-provider";
import AccountContext from "@/context/AccountContext";
import Wrapper from "../Wrapper";

interface ModalWalletProps {
  isOpen?: boolean;
  setIsOpen?: any;
}
const styles = {
  walletItem:
    "flex items-center px-6 py-4 gap-x-4 hover:bg-dark4 rounded-lg cursor-pointer",
};

const ModalWallet: React.FC<ModalWalletProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const modalWalletRef = useRef<any>();
  const { account, updateAccount,updateWallet } = useContext(AccountContext);
  const handleClose = (e:any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpen(false);
  };
  const connectWallet = async (walletName: string) => {
    switch (walletName) {
      case "Binance":
        if (window.BinanceChain) {
          try {
            const web3 = new Web3(window.BinanceChain);
            const accounts = await web3.eth.getAccounts();
            document.body.style.overflowY = "auto";
            updateAccount(accounts)
            updateWallet(walletName)
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
        const walletConnectProvider = new WalletConnectProvider({
          infuraId: "9bab56a381cb440eb809f56e01c59de5",
        });
        await walletConnectProvider.enable();
        break;
      default:
        const provider = getProvider(walletName);
        const networkSwitched = await checkNetwork(provider);
        if (!networkSwitched) {
          return;
        }
        try {
          const accounts = await provider.request({
            method: "eth_requestAccounts",
          });
          updateAccount(accounts)
          updateWallet(walletName)
          document.body.style.overflowY = "auto";
          setIsOpen(false);
          console.log(accounts);
          // Tiếp tục xử lý tài khoản và số dư...
        } catch (error: any) {
          console.log(error);
        }
    }
  };

  return (
    <Wrapper isOpen={isOpen} onClick={handleClose}>
      <div className="w-[550px] h-fit max-w-[calc(100%-32px)] bg-white text-black text-center mt-[100px] rounded-lg relative pb-4">
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
