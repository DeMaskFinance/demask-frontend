import CountdownTime from "@/components/Common/CountdownTime";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import AccountContext from "@/context/AccountContext";
import Link from "next/link";
import React, { useContext } from "react";

interface TabLaunchPadProps {
  // item: LaunchpadData;
  item: any;
  query: string;
}
const Live = () => {
  return (
    <div className="relative hidden md:flex items-center justify-between w-full h-10 px-3 my-2 mb-2 text-base font-semibold rounded-lg bg-green2 bg-opacity-10 text-green2 text-sm">
      <div className="flex items-center gap-x-1 font-bold">
        <div className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-green"></span>
          <span className="relative inline-flex w-2 h-2 rounded-full bg-green2"></span>
        </div>
        LIVE
      </div>
      <div className="text-white ">12d 05h 45m 23s</div>
    </div>
  );
};
const TabLaunchPadItem: React.FC<TabLaunchPadProps> = ({ item, query }) => {
  const blockNumber =
    query === "Upcoming"
      ? item.startTime
      : query === "Active"
      ? item.endTime
      : "";

  return (
    <div className="h-full group">
      <Link href={`launchpad/${item.launchpad}`} className="block h-full">
        <div className="relative overflow-hidden rounded-lg border-shader_500 hover:border-shader_400">
          <div className="relative items-center text-sm transition-all rounded-md cursor-pointer group lg:text-base hover:shadow-home">
            <div className="relative overflow-hidden aspect-square">
              <div className="w-full h-full overflow-hidden rounded-t-lg">
                <MediaNFT data={item} isControls={false} hover zoom />
              </div>
            </div>
            <div className="relative w-full p-3 rounded-b-lg bg-shader_700 group-hover:bg-shader_600 border-x-[1px] border-b-[1px] border-shader_500">
              <div className="flex w-full font-bold text-white">
                <h6
                  title={item.metadata?.name}
                  className="flex items-start w-full gap-2 uppercase "
                >
                  <span className="flex-wrap max-w-full line-clamp-1">
                    {item.metadata?.name ? (
                      <ModalDocument data={item.metadata?.name} />
                    ) : (
                      <p>--</p>
                    )}
                  </span>
                </h6>
              </div>
              <div className="flex justify-between mt-2 text-sm text-shader_200">
                <div>
                  <p>Price</p>
                  <div className="flex items-center gap-x-1 text-white font-bold">
                    <FormatNumber number={"1237"} />
                    <EtherIcon width={16} height={16} />
                  </div>
                </div>
                <div>
                  <p>Items</p>
                  <div className="flex items-center gap-x-1 text-white font-bold">
                    <FormatNumber number={"123"} />
                  </div>
                </div>
                <div>
                  <p>Mint</p>
                  <div className="flex items-center gap-x-1 text-white font-bold">
                    <FormatNumber number={item?.nftBalance || 0} />%
                  </div>
                </div>
              </div>
              <Live />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TabLaunchPadItem;
