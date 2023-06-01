import Button from "@/components/Button";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Liquidity() {
  const hasLiquidity = true;
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
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark2 hover:bg-dark">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark2 hover:bg-dark">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
            <div className="flex justify-between p-2 mb-6 text-white transition-all duration-200 ease-in-out rounded cursor-pointer bg-dark2 hover:bg-dark">
              <p>NFT1/USDT</p>
              <p>REWARD: 200 USDT</p>
            </div>
          </div>
        ) : (
          <div></div>
        )}
        <Link href="/addliquidity">
          <Button type="button" className="h-[26px] w-[158px] text-sm mb-4">
            + Add Liquidity
          </Button>
        </Link>
      </div>
    </div>
  );
}
