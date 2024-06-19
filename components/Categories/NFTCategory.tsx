import { formatLinkIPFS, formatTypeChain } from "@/libs/utils/formatComon";
import FormatNumber from "../Common/FormatNumber";
import MediaNFT from "../Common/MediaNFT";
import { EtherIcon, NFTIcon, VerifyIcon } from "../Icons";
import ModalDocument from "../Modal/ModalLength/ModalDocument";
import { AvatarCustom } from "../Avatars";

interface NFTCategoryProps {
  item: any;
}

const NFTCategory: React.FunctionComponent<NFTCategoryProps> = ({ item }) => {
  console.log(item);

  return (
    <div className="relative overflow-hidden border border-shader_500 rounded-lg hover:border-shader_400 transition-all duration-200">
      <div className="relative items-center text-sm transition-all  rounded-md cursor-pointer group lg:text-base hover:shadow-home">
        <div className="relative w-full h-[186px] overflow-hidden">
          <div className="w-full h-full overflow-hidden rounded-t-lg flex justify-center">
            <AvatarCustom
              avatarUrl={formatLinkIPFS(item?.avatar)}
              userAddress={item?.name}
              size={186}
              className="rounded-lg"
              zoom
            />
          </div>
        </div>
        <div className="w-full p-3 bg-shader_700 rounded-b-lg relative group-hover:bg-shader_600 transition-all duration-200">
          <div className=" w-full text-white font-bold">
            <h6 className="flex items-start w-full gap-2 uppercase ">
              <span className="flex-wrap max-w-full line-clamp-1">
                {item.metadata?.name ? (
                  <div className="flex gap-x-1 items-center">
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
            <p className="text-primary_300 text-xs">Created 19 days ago</p>
          </div>
          <div className="relative flex items-center justify-between w-full h-10 px-3 mb-2 my-2 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
            <div className="text-shader_100 text-sm group-hover:hidden">
              Floor Price
            </div>
            <div className="flex items-center text-white gap-x-1 group-hover:hidden">
              <FormatNumber number={item.lastSale} />
              <EtherIcon width={16} height={16} />
            </div>
            <p className="text-sm group-hover:block hidden text-center w-full transition-all duration-200 ease-in text-white">
              View detail
            </p>
          </div>

          <div className="flex justify-between text-sm text-shader_200 mt-2">
            <p>Floor Price</p>
            <p>Total Volume</p>
          </div>
          <div className="flex justify-between font-bold text-white">
            <div className="flex gap-x-1 items-center">
              <FormatNumber number={item.lastSale} />
              <EtherIcon width={16} height={16} />
            </div>
            <div>
              <div className="flex gap-x-1 items-center">
                <FormatNumber number={item.totalVolume} />
                <EtherIcon width={16} height={16} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between absolute top-1 px-2 w-full opacity-60 group-hover:opacity-100 transition-all duration-200">
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
