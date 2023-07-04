import images from "@/public/images";
import Image from "next/image";
import { ActiveIcon } from "../Icons";

interface NFTTopProps {}

const NFTTop: React.FunctionComponent<NFTTopProps> = () => {
  return (
    <div>
      <div className="w-[208px] h-[208px] relative overflow-hidden group cursor-pointer">
        <Image
          src={images.testImg}
          alt="test"
          width={208}
          height={208}
          className="w-full h-full rounded-lg"
        />
        <div className="absolute bg-[rgba(0,0,0,0.2)] w-full rounded-lg h-full  opacity-0 group-hover:opacity-100 top-0 transition-all duration-300 ease-linear">
          
        </div>
        <div className="absolute top-0 z-10 flex flex-col justify-end w-full h-full p-1 duration-300 ease-linear translate-y-full rounded-lg group-hover:translate-y-0">
            <p className="text-3xl text-white">100 ETH</p>
            <div className="flex my-2 text-xl text-dark4">
              <p>FATOCE MAKER</p>
              <i><ActiveIcon width={24} height={24} className="fill-dark4"/></i>
            </div>
            <div className="flex items-center text-white">
              <div className="w-6 h-6 mr-2 rounded-full bg-dark2"></div>
              <p className="font-medium ">ToCa</p>
              <p className="-translate-y-[4px] mx-1">.</p>
              <p className="text-xs">19 Mins</p>
            </div>
          </div>
      </div>
    </div>
  );
};

export default NFTTop;
