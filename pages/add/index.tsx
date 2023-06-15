import Button from "@/components/Buttons/Button";
import { BackIcon, DownIcon, NFTIcon, TokenIcon } from "@/components/Icons";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import Icons from "@/public/icons/icon";
import images from "@/public/images";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
  btnActive: "rounded-full bg-base2",
};
export default function AddLiquidity() {
  return (
    <div className="px-[436px] py-8 grid grid-cols-2 gap-7">
      <Head>
        <title>Add Liquidity | DeMask</title>
      </Head>
      <div className="">
        <div className="flex items-center mb-6">
          <Link href="/liquidity">
            <BackIcon width={24} height={24} />
          </Link>
          <h2 className="text-2xl text-black24 ml-[18px]">Add Liquidity</h2>
        </div>
        <div>
          <p className={styles.title}>
            <span className="">Choose NFT</span>
            <span className="text-red">*</span>
          </p>
          <div className={styles.inputItem}>
            <div className="flex justify-between cursor-pointer text-dark3">
              <div className="flex gap-x-2">
                <NFTIcon width={24} height={24} />
                NFT1
              </div>
              <DownIcon width={24} height={24} />
            </div>
          </div>
        </div>
        <div>
          <p className={styles.title}>
            <span className="">Choose Token</span>
            <span className="text-red">*</span>
          </p>
          <div className={styles.inputItem}>
            <div className="flex justify-between cursor-pointer text-dark3">
              <div className="flex gap-x-2">
                <TokenIcon width={24} height={24} />
                BUSD
              </div>
              <DownIcon width={24} height={24} />
            </div>
          </div>
        </div>
        <div>
          <p className={styles.title}>Fee</p>
          <Button className="p-2 mb-4 text-white bg-secondary5">0.5%</Button>
        </div>
        <div>
          <p className={styles.title}>
            <span className="">Deposit</span>
            <span className="text-red">*</span>
          </p>
          <div>
            <div className="flex justify-between mb-4 text-dark1">
              <p>NFT</p>
              <p>Balance: 10,000</p>
            </div>
            <input className={styles.inputItem} placeholder="10,000" />
          </div>
          <div>
            <div className="flex justify-between mb-4 text-dark1">
              <p>Token</p>
              <p>Balance: 10,000</p>
            </div>
            <input className={styles.inputItem} placeholder="10,000" />
          </div>
        </div>
        <Button className="p-2" primary>
          ADD LIQUIDITY
        </Button>
      </div>
      <div>
        <div className="flex flex-col items-center w-[504px] h-full ">
          <div className="flex flex-col items-center justify-center w-full h-full text-center border border-dashed border-1 border-dark2 rounded-2xl">
            <Image src={images.pictureFrame} alt="pictureLiquidity" />
          </div>
          <p className="mt-2 text-sm text-secondary5 hover:cursor-pointer hover:text-secondary3">Show detail</p>
        </div>
      </div>
      <ModalSearchNFT/>
    </div>
  );
}
