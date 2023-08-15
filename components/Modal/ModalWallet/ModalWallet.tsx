import images from "@/public/images";
import Image from "next/image";
import React, { useRef, useState, useEffect, useContext } from "react";
import { CgClose } from "react-icons/cg";
import { getProvider } from "@/libs/connection/getProvider";
import Web3 from "web3";
import { checkNetwork } from "@/libs/validation/checkNetwork";
import WalletConnectProvider from "@walletconnect/web3-provider";
import AccountContext from "@/context/AccountContext";
import Wrapper from "../Wrapper";
import { chainName, chainStringId } from "./connector";
import { getWalletConnectProvider } from "./WalletConnectProvider";
interface ModalWalletProps {
  isOpen?: boolean;
  setIsOpen?: any;
}
const styles = {
  walletItem:
    "flex items-center px-6 py-4 gap-x-4 hover:bg-dark4 rounded-lg cursor-pointer",
};

const ModalWallet: React.FC<ModalWalletProps> = ({ isOpen, setIsOpen }) => {
  const { account, updateAccount, updateWallet } = useContext(AccountContext);
  const [walletWeb3, setWalletWeb3] = useState("");
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
        // const walletConnectProvider = new WalletConnectProvider({
        //   infuraId: "9bab56a381cb440eb809f56e01c59de5",
        // });
        // const accounts = await walletConnectProvider.enable();
        // // const accounts = await walletConnectProvider.send("eth_accounts");
        // const firstAccount = accounts[0];
        // console.log("Danh sách tài khoản:", accounts);
        // console.log("Tài khoản đầu tiên:", firstAccount);
        // const providerWallet = getProvider(walletName);
        // try {
        //   // const accounts = await (providerWallet as WalletConnectProvider).enable();
        //   await providerWallet.enable();
        //   const web3 = new Web3(providerWallet);
        //   window.w3 = web3;
        //   var accounts = await web3.eth.getAccounts();
        //   console.log(accounts);

        // } catch (error) {
        //   console.log(error);
        // }
        // var provider1 = new WalletConnectProvider({
        //   rpc: {
        //     "1": "https://mainnet.eth.aragon.network",
        //     "5": "https://goerli.eth.aragon.network",
        //     "137": "https://polygon-rpc.com",
        //     "80001": "https://rpc-mumbai.maticvigil.com",
        //     "1666600000": "https://api.harmony.one/",
        //     "1666700000": "https://api.s0.b.hmny.io/",
        //     "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
        //     "56": "https://bsc-dataseed.binance.org/",
        //     "588": "https://stardust.metis.io/?owner=588",
        //     "1088": "https://andromeda.metis.io/?owner=1088",
        //     "43113": "https://api.avax-test.network/ext/bc/C/rpc",
        //     "686": "https://eth-rpc-karura.aca-api.network/eth/http",
        //     "43114": "https://api.avax.network/ext/bc/c/rpc",
        //     "1311": "https://test.doschain.com/jsonrpc",
        //   },
        // });
        // await provider1.enable();

        // //  Create Web3 instance
        // const web3 = new Web3(provider1);
        // window.w3 = web3

        // var accounts = await web3.eth.getAccounts(); // get all connected accounts
        break;
      default:
        const provider = getProvider(walletName);
        const networkSwitched = await checkNetwork(provider);
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
      <div className="w-[550px] h-fit max-w-[calc(100%-32px)] bg-white text-black text-center lg:mt-[100px] rounded-lg relative pb-4">
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
