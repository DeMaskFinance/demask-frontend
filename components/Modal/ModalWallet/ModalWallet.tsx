import { TabGroups } from "@/components/NavChoice";
import Link from "next/link";
import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import EVMWallet from "./EVMWallet";
import StarknetWallet from "./StarknetWallet";

interface ModalWalletProps {
  isAuthen?: true;
}

const ModalWallet: React.FC<ModalWalletProps> = ({ isAuthen }) => {
  const [activeChoice, setActiveChoice] = useState<string>("All");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const WalletOption = () => {
    switch (activeChoice) {
      case "All":
        return (
          <div>
            <EVMWallet />
            <StarknetWallet />
          </div>
        );
      case "EVM":
        return <EVMWallet />;
      case "Starknet":
        return <StarknetWallet />;
      default:
        return null;
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
      <div className="my-4">
        <TabGroups
          choices={["All", "EVM", "Starknet"]}
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
        />
      </div>
      {WalletOption()}

      {isAuthen && (
        <Link href="/trade" className="text-white absolute top-4 right-4">
          <CgClose />
        </Link>
      )}
    </div>
  );
};

export default ModalWallet;
