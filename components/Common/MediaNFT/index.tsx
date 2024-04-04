import { formatLinkIPFS } from "@/libs/utils/formatToUnit";
import images from "@/public/images";
import Image from "next/image";
import React, { Suspense, useState } from "react";

interface MediaNFTProps {
  data: any;
  isControls: boolean;
  hover?: boolean;
  hideAudio?: boolean;
}
const MediaNFT: React.FC<MediaNFTProps> = ({
  data,
  isControls,
  hover,
  hideAudio
}) => {
  console.log(formatLinkIPFS(data.metadata.image));
  return (
    <>
      {data?.metadata && (
        <div className="relative h-[inherit] w-full">
          {data.metadata?.image && (
              <img
                src={formatLinkIPFS(data.metadata.image)}
                alt="test"
                width={680}
                height={576}
                sizes="(max-width: 770px) 100vw"
                className="w-full rounded-lg h-full lg:max-h-[calc(100vh-326px)] object-cover"
                // blurDataURL="/Placeholder.png"
                onError={(event: any) => {
                  event.target.srcset =
                    "https://api.demask.finance/media/default_image.jpg";
                }}
                placeholder="blur"
                loading="lazy"
              />
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
