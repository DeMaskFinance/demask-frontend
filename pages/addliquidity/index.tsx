import Button from "@/components/Button";
import Icons from "@/public/icons/icon";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const styles = {
  title: "block mb-4 text-base font-semibold text-black24",
  inputItem: "w-full py-2 pl-2 mb-4 border rounded-lg border-dark2",
  btnActive: "rounded-full bg-base2",
};
export default function AddLiquidity() {
    const feeValues=[]
  return (
    <div className="px-[436px] py-8 grid grid-cols-2 gap-7">
      <Head>
        <title>Add Liquidity | DeMask</title>
      </Head>
      <div className="">
        <div className="flex items-center mb-6">
          <Link href="/liquidity">
            <Image src={Icons.backIcon} alt="back" />
          </Link>
          <h2 className="text-2xl text-black24 ml-[18px]">Add Liquidity</h2>
        </div>
        <div>
          <p className={styles.title}>
            <span className="">Choose NFT</span>
            <span className="text-red">*</span>
          </p>
          <div className={styles.inputItem}>
            <div className="flex justify-between pr-4 cursor-pointer">
              <Image src={Icons.twitterIcon} alt="imgToken" />
              <svg
                viewBox="0 0 20 20"
                color="text"
                className="sc-231a1e38-0 dPwWVs down-icon"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.71005 11.71L11.3001 14.3C11.6901 14.69 12.3201 14.69 12.7101 14.3L15.3001 11.71C15.9301 11.08 15.4801 10 14.5901 10H9.41005C8.52005 10 8.08005 11.08 8.71005 11.71Z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <p className={styles.title}>
            <span className="">Choose Token</span>
            <span className="text-red">*</span>
          </p>
          <div className={styles.inputItem}>
            <div className="flex justify-between pr-4 cursor-pointer">
              <Image src={Icons.twitterIcon} alt="imgToken" />
              <svg
                viewBox="0 0 20 20"
                color="text"
                className="sc-231a1e38-0 dPwWVs down-icon"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.71005 11.71L11.3001 14.3C11.6901 14.69 12.3201 14.69 12.7101 14.3L15.3001 11.71C15.9301 11.08 15.4801 10 14.5901 10H9.41005C8.52005 10 8.08005 11.08 8.71005 11.71Z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <p className={styles.title}>Fee</p>
          <Button className="" secondary>0.05%</Button>
        </div>
      </div>
    </div>
  );
}
