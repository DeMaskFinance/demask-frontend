import Button from "@/components/Buttons/Button";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
export default function Liquidity() {
  const hasLiquidity = true;
  const router = useRouter();
  const handleAddLiquidity = () => {
    const nftAddress = "0x519d124e4F2E536f36Ce9f54ADd6CD3022C16c70";
    const tokenAddress = "0x4A90D5aE01F03B650cdc8D3A94358F364D98d096";
    const idNFT = "3965474371";
    router.push(`/add/${nftAddress}/${tokenAddress}/${idNFT}`);
  };
  return (
    <div className="px-[436px] py-8">
      <Head>
        <title>Liquidity | DeMask</title>
      </Head>
      <div className="w-full">
        <h2 className="text-2xl text-black24">Your Liquidity</h2>
        <p className="mt-2 mb-6 text-dark">List of your liquidity positions</p>
        {hasLiquidity ? (
          <div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark3 hover:bg-secondary3 active:bg-secondary1">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark3 hover:bg-secondary3 active:bg-secondary1">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark3 hover:bg-secondary3 active:bg-secondary1">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <Button
          type="button"
          primary
          className="h-[34px] w-[158px] text-sm mb-4"
          onClick={handleAddLiquidity}
        >
          + Add Liquidity
        </Button>
      </div>
    </div>
  );
}
