import { Button } from "@/components/Buttons";
import { WalletIcon } from "@/components/Icons";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Link from "next/link";
import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSignMessage } from "wagmi";

interface ModalWalletProps {
  isAuthen?: true;
}

const ModalWallet: React.FC<ModalWalletProps> = ({ isAuthen }) => {

  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);

  const handleLogin = async () => {
    if (!isConnected) {
      await open();
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

      const signedData = await signMessageAsync({ message: "Sign in to authenticate" });
      if (!signedData) return;
      console.log("Signed Message:", signedData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigning(false);
    }
  };

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
