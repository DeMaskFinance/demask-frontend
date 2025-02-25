import images from "@/public/images";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MediaCollectionProps {
  avatar: string;
  zoom?: boolean;
}
const MediaCollection: React.FC<MediaCollectionProps> = ({ avatar, zoom }) => {

  const isVideo = avatar?.includes("mp4");
  return (
    <div className="w-full h-full">
      {avatar && !isVideo &&
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage
            src={avatar}
            alt="user avatar"
            className={`object-cover transition-transform duration-150 w-full h-full ${zoom ? "group-hover:scale-[1.05]" : ""
              }`}
          />
          <AvatarFallback className="bg-slate-700 rounded-none"></AvatarFallback>
        </Avatar>}
      {!avatar && !isVideo &&
        <Image
          src="/placeHolderIMG.png"
          alt="placeholder"
          width={1000}
          height={1000}
          sizes="(max-width: 770px) 100vw"
          className="w-full h-full object-cover"
          unoptimized
        />
      }

      {isVideo && <video className="w-full h-full" playsInline muted loop autoPlay>
        <source src={avatar} />
      </video>}
    </div>
  );
};

export default MediaCollection;
