import images from "@/public/images";
import Image from "next/image";
import React from "react";
interface MediaCollectionProps {
  avatar: string;
  zoom?: boolean;
}
const MediaCollection: React.FC<MediaCollectionProps> = ({ avatar, zoom }) => {
  return (
    <div className="w-full h-full">
      {avatar ? (
        <Image
          src={avatar}
          width={600}
          height={600}
          alt="user avatar"
          className={`object-cover transition-transform duration-150 w-full h-full ${
            zoom ? "group-hover:scale-[1.05]" : ""
          }`}
        />
      ) : (
        <Image
          src="/PlaceholderIMG.png"
          alt="placeholder"
          width={1000}
          height={1000}
          sizes="(max-width: 770px) 100vw"
          className="w-full h-full object-cover"
          unoptimized
          // blurDataURL={`${images.blur}`}
        />
      )}
    </div>
  );
};

export default MediaCollection;
