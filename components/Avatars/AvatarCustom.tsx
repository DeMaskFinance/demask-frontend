import React, { FunctionComponent } from "react";
import { createAvatar } from "@dicebear/core";
import { bottts, identicon, pixelArt } from "@dicebear/collection";
interface AvatarProps {
  size: number;
}
const AvatarCustom: FunctionComponent<AvatarProps> = ({ size }) => {
  const avatar = createAvatar(pixelArt, {
    size: size,
    backgroundType: ["gradientLinear", "solid"],
  });
  const svgHTML = { __html: avatar };
  const svg = avatar.toString();

  return (
    <div>
      {/* @ts-ignore */}
      <svg dangerouslySetInnerHTML={svgHTML} />
    </div>
  );
};

export default AvatarCustom;
