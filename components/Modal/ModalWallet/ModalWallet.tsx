import { Button } from "@/components/Buttons";
import { WalletIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { MONAD_DEMASK } from "@/libs/constants";
import { getNonce, loginAuthen } from "@/libs/service/userService";
import { modal } from "@/pages/_app";
import { login } from "@/store/profileSlice";
import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from "@reown/appkit/react";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { useSignMessage } from "wagmi";

interface ModalWalletProps {
  isAuthen?: true;
}

const ModalWallet: React.FC<ModalWalletProps> = ({ isAuthen }) => {

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);
  const { account, updateAccount, updateWallet } = useContext(AccountContext);
  const walletInfo = modal.getWalletInfo();
  const dispatch = useDispatch();

  const { disconnect } = useDisconnect()
  const { chainId: chain } = useAppKitNetwork();

  const [awaitingSignature, setAwaitingSignature] = useState(false);

  const handleLogin = async () => {
    if (!isConnected) {
      await open();
      setAwaitingSignature(true);
      return;
    }
    if (address && !isSigning) {
      setIsSigning(true);
      await signAndAuthenticate();
    }
  };

  const signAndAuthenticate = async () => {
    try {
      if (!address) return;
      setIsSigning(true);

      const { data: sign } = await getNonce(address);
      const signedData = await signMessageAsync({ message: String(sign.nonce) });

      if (!signedData) {
        disconnect();
        return;
      }

      const loginData = await loginAuthen({
        userAddress: address,
        signature: signedData,
      });

      dispatch(login({ accessToken: loginData.accessToken, user: address }));
      updateAccount(address);
      updateWallet(walletInfo?.name)
    } catch (error) {
      setIsSigning(false);
      disconnect();
      console.error(error);
    } finally {
      setIsSigning(false);
    }
  };


  useEffect(() => {
    if (
      !awaitingSignature ||
      !address ||
      !isConnected ||
      isSigning ||
      account ||
      chain !== MONAD_DEMASK.chainName
    ) {
      return;
    }

    setIsSigning(true);
    signAndAuthenticate();
    setAwaitingSignature(false);
  }, [awaitingSignature, address, isConnected, account, chain]);

  return (
    <div className=" h-fit bg_main w-[350px]  text-shader_200  rounded-lg relative p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white ">Connect your wallet</h2>
      </div>
      <p className="mt-1 text-sm">
        If you don't have a wallet, you can create one now.
      </p>

      <Button
        gradient
        className="w-full h-12 mt-4 flex gap-x-2 justify-center"
        onClick={handleLogin}
      >
        <WalletIcon width={20} height={20} />
        {"Connect Wallet"}
      </Button>


      {isAuthen && (
        <Link href="/trade" className="text-white absolute top-4 right-4">
          <CgClose />
        </Link>
      )}
    </div>
  );
};

export default ModalWallet;
