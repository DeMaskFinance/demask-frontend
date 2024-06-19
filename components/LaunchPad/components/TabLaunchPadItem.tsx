import CountdownTime from "@/components/Common/CountdownTime";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import AccountContext from "@/context/AccountContext";
import Link from "next/link";
import React, { useContext } from "react";

interface TabLaunchPadProps {
  item: LaunchpadData;
  query: string;
}
const TabLaunchPadItem: React.FC<TabLaunchPadProps> = ({ item, query }) => {
  const { chainId } = useContext(AccountContext);
  const blockNumber =
    query === "Upcoming"
      ? item.startTime
      : query === "Active"
      ? item.endTime
      : "";

  return (
    <div className="h-full group">
      <Link href={`launchpad/${item.launchpad}`} className="block h-full">
        <div className="flex flex-col justify-between h-full">
          <div className="relative flex flex-col h-full">
            <div className="h-[123px] overflow-hidden rounded-lg">
              <MediaNFT data={item} isControls={false} hover />
            </div>

            <div className="flex flex-col justify-between flex-grow">
              <div>
                <div
                  title={item.metadata?.name}
                  className="flex items-start gap-2 py-2 text-xl font-medium uppercase title"
                >
                  <ModalDocument data={item.metadata?.name} />
                  <svg
                    className="flex-shrink-0"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                      fill="#9075FE"
                    />
                    <path
                      d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                      fill="#9075FE"
                    />
                  </svg>
                </div>
                <div className="mt-2">
                  <div className="flex flex-col gap-2">
                    <div className="line-clamp-3">
                      {item.metadata.description}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-2 mt-1 text-white transition-all duration-300 ease-linear rounded-lg gap-x-1 bg-shader_500 group-hover:bg-primary_400">
                <span className="text-sm">Total raise </span>
                {query === "Upcoming" ? (
                  <p>0 ETH</p>
                ) : (
                  <div className="flex items-center">
                    <FormatNumber
                      number={(+item.totalSold / 1e18).toString()}
                    />
                    <EtherIcon width={16} height={16} className="fill-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-2 mt-2 border-t">
            <CountdownTime
              query={query}
              blockNumber={+blockNumber}
              isSuccess={item.isSuccess}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TabLaunchPadItem;
