import Link from "next/link";
import React from "react";
import { CgClose } from "react-icons/cg";
import EVMWallet from "./EVMWallet";

interface ModalWalletProps {
  isAuthen?: true;
}

const ModalWallet: React.FC<ModalWalletProps> = ({ isAuthen }) => {
  return (
    <div className=" h-fit bg_main w-[350px]  text-shader_200  rounded-lg relative p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-white ">Connect your wallet</h2>
      </div>
      <p className="mt-1 text-sm">
        If you don't have a wallet, you can create one now.
      </p>

      <EVMWallet />


      {isAuthen && (
        <Link href="/trade" className="text-white absolute top-4 right-4">
          <CgClose />
        </Link>
      )}
    </div>
  );
};

export default ModalWallet;
