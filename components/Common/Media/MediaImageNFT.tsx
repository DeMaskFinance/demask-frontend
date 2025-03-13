import React from "react";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import Image from "next/image";

interface MediaNFTProps {
    data: any;
    isControls: boolean;
    hover?: boolean;
    hideAudio?: boolean;
    zoom?: boolean;
}

const MediaImageNFT: React.FC<MediaNFTProps> = ({ data, zoom }) => {
    const imageUrl = formatLinkIPFS(
        data?.metadata?.image ?? data?.metadata?.avatar ?? data?.avatar
    );

    return (
        <div className="relative h-[inherit] w-full">
            {imageUrl ? (
                <div className="w-full h-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt="NFT Image"
                        width={680}
                        height={576}
                        sizes="(max-width: 770px) 100vw"
                        className={`w-full h-full transition-transform duration-150 object-cover aspect-square ${zoom ? "group-hover:scale-[1.05]" : ""
                            }`}
                        blurDataURL="/placeHolderIMG.png"
                        placeholder="blur"
                        unoptimized
                        loading="lazy"
                        onError={(event: any) => {
                            event.target.src =
                                "https://file.demask.finance/e46abbd0950de661583d93ebed957ec6.png";
                        }}
                    />
                </div>
            ) : (
                <img
                    src="/placeHolderIMG.png"
                    alt="Placeholder"
                    width={680}
                    height={576}
                    sizes="(max-width: 770px) 100vw"
                    className="w-full h-full lg:max-h-[calc(100vh-326px)] object-cover"
                />
            )}
        </div>
    );
};

export default MediaImageNFT;
