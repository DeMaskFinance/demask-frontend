import React, { FunctionComponent } from "react";
import { createAvatar } from "@dicebear/core";
import { bottts, identicon, pixelArt } from "@dicebear/collection";
interface AvatarProps {
  size: number;
  seed:string;
}
const AvatarCustom: FunctionComponent<AvatarProps> = ({ size, seed }) => {
  const avatar = createAvatar(identicon, {
    size: size,
    backgroundType: ["gradientLinear", "solid"],
    seed: seed
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

export default AvatarCustom;
