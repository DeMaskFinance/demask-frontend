import { mediaType } from "@/libs/constants";
import formatNumber from "@/libs/utils/formatNumer";
import images from "@/public/images";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AvatarUser } from "../Avatars";
import FormatNumber from "../Common/FormatNumber";
import { EtherIcon, NFTIcon, VerifyIcon } from "../Icons";
import AccountContext from "@/context/AccountContext";
import MediaNFT from "../Common/MediaNFT";
import ModalDocument from "../Modal/ModalLength/ModalDocument";
import { formatTypeChain } from "@/libs/utils/formatComon";

interface NFTCategoryProps {
  item: any;
}

const NFTCategory: React.FunctionComponent<NFTCategoryProps> = ({ item }) => {
  return (
    <div className="relative overflow-hidden border border-shader_500 rounded-lg hover:border-shader_400">
      <div className="relative items-center text-sm transition-all  rounded-md cursor-pointer group lg:text-base hover:shadow-home">
        <div className="relative w-full h-[186px] overflow-hidden">
          <div className="w-full h-full overflow-hidden rounded-t-lg">
            <MediaNFT data={item} isControls={false} hover zoom />
          </div>
        </div>
        <div className="w-full p-3 bg-shader_700 rounded-b-lg relative group-hover:bg-shader_600">
          <div className=" w-full text-white font-bold">
            <h6
              title={item.metadata?.name}
              className="flex items-start w-full gap-2 uppercase "
            >
              <span className="flex-wrap max-w-full line-clamp-1">
                {item.metadata?.name ? (
                  <div className="flex gap-x-1 items-center">
                    <ModalDocument data={item.metadata?.name} />
                    <VerifyIcon width={16} height={16} />
                  </div>
                ) : (
                  <p>--</p>
                )}
              </span>
            </h6>
            <p className="text-primary_300 text-xs">Created 19 days ago</p>
          </div>
          <div className="relative flex items-center justify-between w-full py-2 px-3 mb-2 my-2 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
            <div className="text-shader_100 text-sm">Floor Price</div>
            <div className="flex items-center text-white gap-x-1">
              <FormatNumber number={item.lastPrice} />
              <EtherIcon width={16} height={16} />
            </div>
          </div>
          <div className="flex justify-between text-sm text-shader_200 mt-2">
            <p>Reserve NFT</p>
            <p>Reserve Token</p>
          </div>
          <div className="flex justify-between font-bold text-white">
            <div className="flex gap-x-1 items-center">
              <FormatNumber number={item.reserveNFT} />
              <EtherIcon width={16} height={16} />
            </div>
            <div>
              <div className="flex gap-x-1 items-center">
                <FormatNumber number={item.reserveToken} />
                <NFTIcon width={16} height={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between absolute top-1 px-2 w-full opacity-60 group-hover:opacity-100 transition-all duration-150">
          <div className="flex gap-x-1 items-center">
            <EtherIcon width={20} height={20} />
            <p className="text-[10px] bg-black bg-opacity-40 rounded-xl px-2 h-5 leading-5 backdrop-opacity-50 font-semibold text-white">
              {formatTypeChain(item.type)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCategory;
