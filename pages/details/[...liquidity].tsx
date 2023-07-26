import { Button } from "@/components/Buttons";
import { BackIcon } from "@/components/Icons";
import { ModalDetail } from "@/components/Modal/ModalDedail";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import images from "@/public/images";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ToastContainer } from "react-toastify";
const style = {
  btnWallet:
    "flex items-center justify-center p-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-secondary5 active:bg-secondary3 text-secondary4 hover:text-white gap-x-2 border-secondary5",
};
export default function DetailLiquidity() {
  return (
    <div className="py-8">
      <Head>
        <title>Detail Liquidity | DeMask</title>
      </Head>
      <div className="flex justify-between ">
        <div className="flex items-center mb-6">
          <Link href="/liquidity">
            <BackIcon width={24} height={24} />
          </Link>
          <h2 className="text-2xl text-dark1 font-medium ml-[18px]">
            NFT/USDT
          </h2>
        </div>
        <div className="flex justify-end mb-8 gap-x-4">
          <button className={style.btnWallet}>ADD</button>
          <button className={style.btnWallet}>REMOVE</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-7">
        <div className="">
          <div className=" w-[504px] h-full ">
            <div className="flex justify-between font-medium">
              <div>
                <p className="text-dark1">Liquidity</p>
                <p className="text-xl text-secondary3">10,000</p>
              </div>
              <div>
                <p className="text-dark1">Reward</p>
                <p className="text-xl text-secondary3">$10,000</p>
              </div>
              <div>
                <Button primary className="p-2 text-sm">
                  COLLECT
                </Button>
              </div>
            </div>
            <h3 className="mt-5 mb-4 text-lg font-medium text-dark1">
              History
            </h3>
            <div>
              <div className="flex font-medium text-dark1 gap-x-10">
                <p>Action</p>
                <p>Liquidity</p>
                <p>NFT</p>
                <p>Token</p>
                <p>Time</p>
              </div>
            </div>
          </div>

          {/* <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalDetail
        nameNFT={nameNFT}
        symbolNFT={symbolNFT}
        category={category}
        attributes={attributes}
        description={description}
        setIsOpenDetail={setIsOpenDetail}
        isOpenDetail={isOpenDetail}
      /> */}
          <ToastContainer />
        </div>
        <div className="flex justify-end">
          <Image src={images.testImg} alt="test" className=" rounded-xl" width={504} height={504} />
        </div>
      </div>
    </div>
  );
}
