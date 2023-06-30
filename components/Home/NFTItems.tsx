import Image from "next/image";
import { ActiveIcon } from "../Icons";
import images from "@/public/images";

interface NFTItemsProps {}

const NFTItems: React.FunctionComponent<NFTItemsProps> = () => {
  return (
    <div className="p-2 mt-6 rounded-lg shadow-home">
      <div className="flex items-center justify-between">
        <div className="flex justify-between mb-2">
          <h2 className="text-2xl font-medium text-dark1">FATOCE MAKER </h2>
          <ActiveIcon width={24} height={24} />
        </div>
        <div className="text-[34px] font-medium text-secondary3 leading-[14px]">100 ETH</div>
      </div>
      <div className="flex items-center mb-2 text-dark2">
        <div className="w-6 h-6 mr-2 bg-black rounded-full"></div>
        <p className="font-medium text-dark2">TOCA</p>
        <p className="-translate-y-[4px] mx-1">.</p>
        <p className="text-xs">19 Mins</p>
      </div>
      <p className="mb-6 font-light text-dark2">
        On May 2nd 2023, artist Jeremy Cowart created his historic AURAS
        project, which which is now 10,000 completely unique NFT’s produced in
        20 minutes start to finish without relying on generative code.
      </p>
      <Image width={1031} height={1049} src={images.testImg} alt="NFT Image" />
    </div>
  );
};

export default NFTItems;
