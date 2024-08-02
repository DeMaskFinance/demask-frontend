import images from "@/public/images";
import Image from "next/image";
import React from "react";
const styles = {
  walletItem:
    "items-center p-2 gap-x-4 text-white hidden lg:flex  hover:bg-shader_600  rounded-lg cursor-pointer text-sm font-semibold",
};
const StacknetWallet = () => {
  return (
    <div className="mt-4 font-semibold flex flex-col gap-y-2">
      <div className={styles.walletItem}>
        <Image
          src={images.argentXWallet}
          alt="ArgentX wallet"
          className="w-9"
        />
        <p>ArgentX</p>
      </div>
      <div className={styles.walletItem}>
        <Image
          src={images.braavosWallet}
          alt="Braavos wallet"
          width={400}
          height={400}
          className="w-9 h-9 object-cover"
        />
        <p>Braavos</p>
      </div>
    </div>
  );
};

export default StacknetWallet;
