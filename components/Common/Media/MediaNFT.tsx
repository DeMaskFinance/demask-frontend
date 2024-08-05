import { formatLinkIPFS } from "@/libs/utils/formatComon";
import Image from "next/image";
import React from "react";

interface MediaNFTProps {
  data: any;
  isControls: boolean;
  hover?: boolean;
  hideAudio?: boolean;
  zoom?: boolean;
}
const MediaNFT: React.FC<MediaNFTProps> = ({
  data,
  isControls,
  hover,
  hideAudio,
  zoom,
}) => {
  return (
    <>
      {data?.metadata ? (
        <div className="relative h-[inherit] w-full">
          {data.metadata?.image && (
            <div className="w-full h-full overflow-hidden ">
              <Image
                src={formatLinkIPFS(data.metadata.image)}
                alt="imgNFT"
                width={680}
                height={576}
                sizes="(max-width: 770px) 100vw"
                className={`w-full h-full transition-transform duration-150 overflow-hidden  object-cover aspect-square ${
                  zoom ? "group-hover:scale-[1.05]" : ""
                } `}
                blurDataURL="/placeHolderIMG.png"
                onError={(event: any) => {
                  event.target.srcset =
                    "https://file.demask.finance/e46abbd0950de661583d93ebed957ec6.png";
                }}
                unoptimized
                placeholder="blur"
                loading="lazy"
              />
            </div>
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
              poster="/placeHolderIMG.png"
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
            <img
              src="/placeHolderIMG.png"
              alt="noDataIMG"
              width={680}
              height={576}
              sizes="(max-width: 770px) 100vw"
              className="w-full h-full lg:max-h-[calc(100vh-326px)] object-cover"
            />
          )}
        </div>
      ) : (
        <img
          src="/placeHolderIMG.png"
          alt="placeholder"
          width={680}
          height={576}
          sizes="(max-width: 770px) 100vw"
          className="w-full h-full lg:max-h-[calc(100vh-326px)] object-cover"
        />
      )}
    </>
  );
};

export default MediaNFT;
