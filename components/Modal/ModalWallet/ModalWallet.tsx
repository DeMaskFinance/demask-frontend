import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import images from "@/public/images";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { CgClose } from "react-icons/cg";
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import Web3 from "web3";
import Wrapper from "../Wrapper";
import { getNonce, loginAuthen } from "@/libs/service/userService";
import { useDispatch } from "react-redux";
import { login } from "@/store/profileSlice";

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
  const [tab, setTab] = useQueryParam("chain", withDefault(StringParam, chainId));
  const dispatch = useDispatch();
  const handleClose = (e: any) => {
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
        const providerWallet = await getProvider(walletName);
        try {
          await providerWallet.connect();
          const accounts = await providerWallet.accounts;
          updateAccount(accounts[0]);
          updateWallet(walletName);
          document.body.style.overflowY = "auto";
          setIsOpen(false);
        } catch (error) {
          console.log(error);
        }
        break;
      default:
        const provider = await getProvider(walletName);
        const networkSwitched = await changeNetwork(chainId, walletName, demask, setIsOpen, updateChainId, setTab);

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
          const { data: sign } = await getNonce(accounts[0]);
          const msg = `${Buffer.from(String(sign.nonce), 'utf8').toString('hex')}`;
          const signedData = await provider?.request({
            method: "personal_sign",
            params: [
              (msg),
              accounts[0],
            ],
          });
          const loginData = await loginAuthen({
            userAddress: accounts[0],
            signature: signedData
          })
          console.log(loginData.accessToken);
          dispatch(login({ accessToken: loginData.accessToken, user: accounts[0] }));
          updateAccount(accounts[0]);
          updateWallet(walletName);
          document.body.style.overflowY = "auto";
          setIsOpen(false);
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
