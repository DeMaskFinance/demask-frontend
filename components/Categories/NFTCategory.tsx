import { formatLinkIPFS, formatTypeChain } from "@/libs/utils/formatComon";
import FormatNumber from "../Common/FormatNumber";
import MediaNFT from "../Common/Media/MediaNFT";
import { EtherIcon, NFTIcon, VerifyIcon } from "../Icons";
import ModalDocument from "../Modal/ModalLength/ModalDocument";
import { AvatarCustom } from "../Avatars";
import Link from "next/link";

interface NFTCategoryProps {
  item: any;
}

const NFTCategory: React.FunctionComponent<NFTCategoryProps> = ({ item }) => {
  return (
    <Link href={`/collection/${item.contractAddress}?typeERC=${item.type}`}>
      <div className="relative overflow-hidden transition-all duration-200 border rounded-lg border-shader_500 hover:border-shader_400">
        <div className="relative items-center text-sm transition-all rounded-md cursor-pointer group lg:text-base hover:shadow-home">
          <div className="relative w-full h-[186px] overflow-hidden">
            <div className="flex justify-center w-full h-full overflow-hidden rounded-t-lg">
              <AvatarCustom
                avatarUrl={formatLinkIPFS(item?.avatar)}
                userAddress={item?.name}
                size={186}
                className="rounded-lg"
                zoom
              />
            </div>
          </div>
          <div className="relative w-full p-3 transition-all duration-200 rounded-b-lg bg-shader_700 group-hover:bg-shader_600">
            <div className="w-full font-bold text-white ">
              <h6 className="flex items-start w-full gap-2 uppercase ">
                <span className="flex-wrap max-w-full line-clamp-1">
                  {item.metadata?.name ? (
                    <div className="flex items-center gap-x-1">
                      <ModalDocument data={item.metadata?.name} />
                      <VerifyIcon width={16} height={16} />
                    </div>
                  ) : item.name ? (
                    <p>{item.name}</p>
                  ) : (
                    <p>--</p>
                  )}
                </span>
              </h6>
              <p className="text-xs text-primary_300">
                Created {item?.blockTimestamp}
              </p>
            </div>
            <div className="relative flex items-center justify-between w-full h-10 px-3 my-2 mb-2 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
              <div className="text-sm text-shader_100 group-hover:hidden">
                Floor Price
              </div>
              <div className="flex items-center text-white gap-x-1 group-hover:hidden">
                <FormatNumber number={item.lastSale} />
                <EtherIcon width={16} height={16} />
              </div>
              <p className="hidden w-full text-sm text-center text-white transition-all duration-200 ease-in group-hover:block">
                View detail
              </p>
            </div>

            <div className="flex justify-between mt-2 text-sm text-shader_200">
              <p>Floor Price</p>
              <p>Total Volume</p>
            </div>
            <div className="flex justify-between font-bold text-white">
              <div className="flex items-center gap-x-1">
                <FormatNumber number={item.lastSale} />
                <EtherIcon width={16} height={16} />
              </div>
              <div>
                <div className="flex items-center gap-x-1">
                  <FormatNumber number={item.totalVolume} />
                  <EtherIcon width={16} height={16} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute flex items-center justify-between w-full px-2 transition-all duration-200 top-1 opacity-60 group-hover:opacity-100">
            <div className="flex items-center gap-x-1">
              <EtherIcon width={20} height={20} />
              <p className="text-[10px] bg-black bg-opacity-40 rounded-xl px-2 h-5 leading-5 backdrop-opacity-50 font-semibold text-white">
                {formatTypeChain(item.type)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCategory;
