import React, { FunctionComponent } from "react";
import { createAvatar } from "@dicebear/core";
import { bottts, identicon, pixelArt } from "@dicebear/collection";
import Image from "next/image";
interface AvatarProps {
  size: number;
  seed: string;
}
interface AvatarCustomProps {
  avatarUrl?: string;
  userAddress: string;
  size: number;
  className: string;
  zoom?: boolean;
}
const AvatarDiceBear: FunctionComponent<AvatarProps> = ({ size, seed }) => {
  const avatar = createAvatar(identicon, {
    size: size,
    backgroundType: ["gradientLinear", "solid"],
    seed: seed,
  });
  const svgHTML = { __html: avatar };
  const svg = avatar.toString();

  return (
    <div>
      {/* @ts-ignore */}
      <div dangerouslySetInnerHTML={svgHTML} />
    </div>
  );
};
const AvatarCustom: FunctionComponent<AvatarCustomProps> = ({
  avatarUrl,
  userAddress,
  size,
  className,
  zoom,
}) => {
  return (
    <>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          width={600}
          height={600}
          alt="user avatar"
          className={`object-cover transition-transform duration-150 ${className} ${
            zoom ? "group-hover:scale-[1.05]" : ""
          }`}
        />
      ) : (
        <AvatarDiceBear size={size} seed={userAddress} />
      )}
    </>
  );
};
export default AvatarCustom;
export { AvatarDiceBear };
