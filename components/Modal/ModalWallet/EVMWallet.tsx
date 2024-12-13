import AccountContext, { useAccountContext } from "@/context/AccountContext";
import { getNonce, loginAuthen } from "@/libs/service/userService";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import images from "@/public/images";
import { login } from "@/store/profileSlice";
import Image from "next/image";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import Web3 from "web3";
const styles = {
  walletItem:
    "items-center p-2 gap-x-4 text-white hidden lg:flex  hover:bg-shader_600  rounded-lg cursor-pointer text-sm font-semibold",
};
const EVMWallet = () => {
  const {
    getProviders,
    account,
    chainId,
    demask,
    updateChainId,
    updateAccount,
    updateWallet,
  } = useAccountContext();

  const dispatch = useDispatch();
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);

  const connectWallet = async (walletName: string) => {
    try {
      let accounts;
      const provider = await getProviders(walletName);
      if (walletName === "Binance") {
        if (!window.BinanceChain) {
          toast.error("Binance Wallet not found");
          return false;
        }

        accounts = await provider.eth.getAccounts();
      } else {
        const provider = await getProviders(walletName);

        if (walletName !== "WalletConnect") {
          if (!window.ethereum) {
            walletName === "Metamask"
              ? window.open(
                  "https://metamask.io/download/",
                  "_blank",
                  "noopener,noreferrer"
                )
              : window.open(
                  "https://chromewebstore.google.com/detail/coinbase-wallet-extension/hnfanknocfeofbddgcijnmhnfnkdnaad",
                  "_blank",
                  "noopener,noreferrer"
                );
            return;
          } else {
            const networkSwitched = await changeNetwork(
              chainId,
              provider,
              demask,
              setIsWrongNetwork,
              updateChainId
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

        console.log(provider);

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
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mt-4 font-semibold flex flex-col gap-y-2">
      <div
        className={styles.walletItem}
        onClick={() => connectWallet("MetaMask")}
      >
        <Image src={images.metamaskWallet} alt="Metamask" className="w-9" />
        <p>MetaMask</p>
      </div>
      <div
        className={styles.walletItem}
        onClick={() => connectWallet("Coinbase")}
      >
        <Image src={images.coinbaseWallet} alt="Coinbase" className="w-9" />
        <p>Coinbase</p>
      </div>
      <div
        className="flex items-center p-2 gap-x-4 text-white  hover:bg-shader_600  rounded-lg cursor-pointer text-sm font-semibold"
        onClick={() => connectWallet("WalletConnect")}
      >
        <Image
          src={images.walletConnect}
          alt="Wallet connect"
          className="w-9"
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
          className="w-9"
        />
        <p>Binance wallet</p>
      </div>
      <div className={styles.walletItem} onClick={() => connectWallet("OKX")}>
        <Image
          src={images.okxWallet}
          alt="OKX wallet"
          width={400}
          height={400}
          className="w-9 h-9 object-cover"
        />
        <p>OKX wallet</p>
      </div>
    </div>
  );
};

export default EVMWallet;
