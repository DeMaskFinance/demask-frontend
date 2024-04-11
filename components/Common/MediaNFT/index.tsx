import { formatLinkIPFS } from "@/libs/utils/formatToUnit";
import images from "@/public/images";
import Image from "next/image";
import React, { Fragment, Suspense, useEffect, useState } from "react";

interface MediaNFTProps {
  data: any;
  isControls: boolean;
  hover?: boolean;
  hideAudio?: boolean;
}
const SkeletonImg = () => {
  return (
    <div className="w-full h-full animate-pulse bg-slate-200 dark:bg-slate-700"></div>
  );
};
const MediaNFT: React.FC<MediaNFTProps> = ({
  data,
  isControls,
  hover,
  hideAudio,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <>
      {data?.metadata && (
        <div className="relative h-[inherit] w-full">
          {data.metadata?.image && (
            <Fragment>
              <img
                src={formatLinkIPFS(data.metadata.image)}
                alt="test"
                width={680}
                height={576}
                sizes="(max-width: 770px) 100vw"
                className={`w-full rounded-lg h-full lg:max-h-[calc(100vh-326px)] object-cover `}
                // blurDataURL="/Placeholder.png"
                onError={(event: any) => {
                  event.target.srcset =
                    "https://api.demask.finance/media/default_image.jpg";
                }}
                onLoad={(e) => {
                  setLoading(false);
                }}
                placeholder="blur"
                loading="lazy"
              />
              <div
                className={`w-full h-full rounded-lg animate-pulse bg-slate-200 dark:bg-slate-700 ${
                  loading ? "block" : "hidden"
                }`}
              ></div>
            </Fragment>
          )}
          {!data.metadata?.image && data.metadata?.animation_url && (
            <video
              src={formatLinkIPFS(data.metadata.animation_url)}
              autoPlay
              playsInline
              loop
              muted
              controls={isControls}
              {...(hover
                ? {
                    onMouseOver: (event) => (event.target as any).play(),
                    onMouseOut: (event) => (event.target as any).pause(),
                  }
                : {})}
              className="w-full rounded-lg lg:max-h-[calc(100vh-326px)] object-cover h-full"
              poster="/Placeholder.png"
            />
          )}
          {data.metadata?.image &&
            data.metadata?.animation_url &&
            !hideAudio && (
              <audio
                autoPlay
                loop
                muted
                controls
                src={formatLinkIPFS(data.metadata.animation_url)}
                className={`absolute top-[83%] h-10 translate-x-1/2 right-2/4 w-[65%] py-1 rounded-lg  object-cover ${
                  isControls ? "" : "hidden"
                }`}
              >
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            )}
          {!data.metadata?.image && !data.metadata?.animation_url && (
            <Image
              src="/Placeholder.png"
              alt="test"
              width={680}
              height={576}
              sizes="(max-width: 770px) 100vw"
              className="w-full rounded-lg h-full lg:max-h-[calc(100vh-326px)] object-cover"
              blurDataURL={`${images.blur}`}
            />
          )}
        </div>
      )}
    </>
  );
};

export default MediaNFT;
