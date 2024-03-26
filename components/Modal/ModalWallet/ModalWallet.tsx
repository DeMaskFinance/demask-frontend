import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import images from "@/public/images";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { CgClose } from "react-icons/cg";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
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
  const {
    account,
    wallet,
    chainId,
    demask,
    tokenDefault,
    updateAccount,
    updateWallet,
    updateChainId,
  } = useContext(AccountContext);
  const [tab, setTab] = useQueryParam(
    "chain",
    withDefault(StringParam, chainId)
  );
  const dispatch = useDispatch();
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpen(false);
  };
  const connectWallet = async (walletName: string) => {
    try {
      let provider;
      let accounts;
      if (walletName === "Binance") {
        if (!window.BinanceChain) {
          alert("Binance Wallet not found");
          return false;
        }
        provider = new Web3(window.BinanceChain);
        accounts = await provider.eth.getAccounts();
      } else {
        provider = await getProvider(walletName);
        if (walletName !== "WalletConnect") {
          if (!window.ethereum) {
            walletName === "Metamask" ? window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer') : window.open('https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad', '_blank', 'noopener,noreferrer');
            return;
          } else {
            const networkSwitched = await changeNetwork(
              chainId,
              walletName,
              demask,
              setIsOpen,
              updateChainId,
              setTab
            );
            if (!networkSwitched) {
              return;
            }
            accounts = await provider
              .request({
                method: "eth_requestAccounts",
              })
              .catch((error: any) => {
                console.error(error);
              });
          }
        } else {
          await provider.connect();
          accounts = await provider.accounts;
        }
      }
      if (walletName !== "Binance") {
        const { data: sign } = await getNonce(accounts[0]);
        const msg = `${Buffer.from(String(sign.nonce), "utf8").toString(
          "hex"
        )}`;
        const signedData = await provider?.request({
          method: "personal_sign",
          params: [msg, accounts[0]],
        });
        const loginData = await loginAuthen({
          userAddress: accounts[0],
          signature: signedData,
        });

        dispatch(
          login({ accessToken: loginData.accessToken, user: accounts[0] })
        );
        updateAccount(accounts[0]);
        updateWallet(walletName);
        document.body.style.overflowY = "auto";
        setIsOpen(false);
      }
    } catch (error) {
      console.error(error);
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
