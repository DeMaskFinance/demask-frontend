import React, { useState, useRef, useEffect } from "react";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import Image from "next/image";
import { BiPause, BiPlay } from "react-icons/bi";

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
  const [isVideoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = "";
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const isVideo =
    data?.metadata?.animation_url?.includes("mp4") ||
    data?.metadata?.avatar?.includes("mp4") ||
    data?.avatar?.includes("mp4");

  const videoUri =
    data?.metadata?.animation_url ||
    data?.metadata?.avatar ||
    data?.metadata?.image;

  const handlePlayPause = () => {
    if (videoRef.current) {
      document.querySelectorAll("video").forEach((vid) => {
        if (vid !== videoRef.current) {
          vid.pause();
        }
      });

      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!isVideoPlaying);
    }
  };


  return (
    <>
      {data?.metadata || data?.avatar ? (
        <div className="relative h-[inherit] w-full">
          {(data.metadata?.image || data.metadata?.avatar || data?.avatar) &&
            !isVideo &&
            !data?.metadata?.animation_url && (
              <div className="w-full h-full overflow-hidden">
                <Image
                  src={formatLinkIPFS(
                    data?.metadata?.image ||
                    data?.metadata?.avatar ||
                    data?.avatar
                  )}
                  alt="imgNFT"
                  width={680}
                  height={576}
                  sizes="(max-width: 770px) 100vw"
                  className={`w-full h-full transition-transform duration-150 object-cover aspect-square ${zoom ? "group-hover:scale-[1.05]" : ""
                    }`}
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

          {data.metadata?.animation_url && !isVideoPlaying && (
            <div className="w-full h-full relative">
              <Image
                src={formatLinkIPFS(
                  data.metadata?.image ||
                  data.metadata?.avatar ||
                  "/placeHolderIMG.png"
                )}
                alt="defaultImage"
                width={680}
                height={576}
                className="w-full h-full object-cover"
                blurDataURL="/placeHolderIMG.png"
                placeholder="blur"
                loading="lazy"
              />
              <button
                onClick={handlePlayPause}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-2 bg-white/30 backdrop-blur-lg rounded-full"
              >
                {isVideoPlaying ? (
                  <BiPause className="text-white text-md" />
                ) : (
                  <BiPlay className="text-white text-md" />
                )}

              </button>
            </div>
          )}



          {(data.metadata?.animation_url) && (
            <video
              ref={videoRef}
              src={formatLinkIPFS(data.metadata?.animation_url || data?.metadata?.avatar)}
              autoPlay={isVideoPlaying}
              playsInline
              loop
              muted
              controls={isControls}
              className={`w-full h-full object-cover z-0 rounded-lg ${isVideoPlaying ? "block" : "hidden"
                }`}
            />
          )}



          {(data.metadata?.avatar?.includes("mp4")) && (
            <video
              src={formatLinkIPFS(data?.metadata?.avatar)}
              autoPlay={true}
              playsInline
              loop
              muted
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
                className={`absolute top-[83%] h-10 translate-x-1/2 right-2/4 w-[65%] py-1 rounded-lg object-cover ${isControls ? "" : "hidden"
                  }`}
              >
                Your browser does not support the <code>audio</code> element.
              </audio>
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
