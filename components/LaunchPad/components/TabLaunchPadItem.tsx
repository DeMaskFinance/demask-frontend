import { AvatarUser } from "@/components/Avatars";
import { convertTime } from "@/hooks/useConvertTime";
import { formatDate } from "@/libs/utils/formatDate";
import formatNumber from "@/libs/utils/formatNumer";
import { getBuyPrice } from "@/libs/utils/getPrice";
import getDate from "date-fns/getDate";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface TabLaunchPadProps {
  item: any;
  query: string;
}
const TabLaunchPadItem: React.FC<TabLaunchPadProps> = ({ item, query }) => {
  const blockNumber = item.startTime;
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);

  const timer = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const reBase = Math.max(0, blockNumber - currentTime);
    setBlockNumberTimer(reBase);
  };

  useEffect(() => {
    timer();
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    timer();
  }, [blockNumber]);

  const { days, hours, minutes, seconds } = convertTime(blockNumberTimer);

  return (
    <div className="">
      <div className="relative">
        <div className="">
          {item.metadata.image && (
            <Image
              loading="lazy"
              width={760}
              height={760}
              src={item.metadata.image}
              alt="NFT Image"
              className="h-48 w-full object-cover  rounded-lg"
            />
          )}
          {item.metadata.animation_url && !item.metadata.image && (
            <video
              src={item.metadata.animation_url}
              autoPlay={false}
              loop
              muted
              controls={false}
              onMouseOver={(event) => (event.target as any).play()}
              onMouseOut={(event) => (event.target as any).pause()}
              className="h-48 w-full object-cover rounded-lg"
            />
          )}
          {item.metadata.image && item.metadata.animation_url && (
            <audio
              autoPlay
              loop
              muted
              controls
              src={item.metadata.animation_url}
              className="absolute top-[83%] h-10 translate-x-1/2 right-2/4 w-[80%] py-1 rounded-lg  object-cover"
            >
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          )}
        </div>

        <div>
          <h6
            title={item.metadata.name}
            className="flex items-start gap-2 py-2 font-medium uppercase"
          >
            <span className="flex-wrap text-xl line-clamp-1">
              {item.metadata.name}
            </span>
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
          </h6>
          <div className="flex">
            <span className="shrink-0">
              <AvatarUser width={24} height={24} />
            </span>
            <span className="pb-1 -ml-2.5 block">
              {item.creator?.slice(0, 4)}...
              {item.creator?.slice(-4)}
            </span>
          </div>
          <div className="">
            <div>
              {seconds > 0 && (
                <div className="flex justify-between">
                  <div className="mb-2 flex justify-between w-full">
                    <span className="border rounded-full py-1 px-2">
                      {days}d
                    </span>
                    <span className="border rounded-full py-1 px-2">
                      {hours}h
                    </span>

                    <span className="border rounded-full py-1 px-2">
                      {minutes > 9 ? minutes : "0" + minutes}m
                    </span>
                    <span className="border rounded-full py-1 px-2">
                      {seconds > 9 ? seconds : "0" + seconds}s
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p>Price</p>
                  <p>{item.price}</p>
                </div>

                <div>
                  <p>Price listing</p>
                  <p>{item.priceListing}</p>
                </div>

                <div>
                  <p>Initial</p>
                  <p>{item.initial}</p>
                </div>

                <div>
                  <p>Percent Lock</p>
                  <p>{item.percentLock}</p>
                </div>

                <div>
                  <p>Max buy</p>
                  <p>{item.maxbuy}</p>
                </div>

                <div>
                  <p>Whitelist</p>
                  <p>{item.whiteList}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabLaunchPadItem;
