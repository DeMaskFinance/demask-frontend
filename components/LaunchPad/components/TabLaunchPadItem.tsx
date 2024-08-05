import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import StatusBadge from "@/components/Common/StatusBadge";
import { EtherIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import Link from "next/link";
import React from "react";
interface TabLaunchPadProps {
  item: LaunchpadData;
}

const TabLaunchPadItem: React.FC<TabLaunchPadProps> = ({ item }) => {
  console.log(item);

  return (
    <div className="h-full group">
      <Link
        href={`launchpad/${item.launchpadAddress}`}
        className="block h-full"
      >
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
              <div className="flex justify-between my-2 text-sm text-shader_200">
                <div>
                  <p>Price</p>
                  <div className="flex items-center gap-x-1 text-white font-bold">
                    <FormatNumber number={item.price} />
                    <EtherIcon width={16} height={16} />
                  </div>
                </div>
                <div>
                  <p>Items</p>
                  <div className="flex items-center gap-x-1 text-white font-bold justify-end">
                    <FormatNumber number={item.unit} />
                  </div>
                </div>
              </div>
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TabLaunchPadItem;
