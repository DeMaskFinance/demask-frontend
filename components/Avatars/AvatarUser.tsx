import avatarsIcon from "@/public/images/avatarUser";
import Image from "next/image";
import React, { useState, useEffect, FunctionComponent } from "react";

interface IStateAvt {
  id: number;
  avt: typeof import("*.png");
}
interface AvatarProps {
  activeSlideIndex?: number;
  width: number;
  height: number;
}

const AvatarUser: FunctionComponent<AvatarProps> = ({
  activeSlideIndex,
  width,
  height,
}) => {
  const [avatarUser, setAvatarUser] = useState<IStateAvt>({
    id: 1,
    avt: avatarsIcon.avtUser1,
  });
  const avatars = [
    {
      id: 1,
      avt: avatarsIcon.avtUser1,
    },
    {
      id: 2,
      avt: avatarsIcon.avtUser2,
    },
    {
      id: 3,
      avt: avatarsIcon.avtUser3,
    },
    {
      id: 4,
      avt: avatarsIcon.avtUser4,
    },
    {
      id: 5,
      avt: avatarsIcon.avtUser5,
    },
    {
      id: 6,
      avt: avatarsIcon.avtUser6,
    },
    {
      id: 7,
      avt: avatarsIcon.avtUser7,
    },
    {
      id: 8,
      avt: avatarsIcon.avtUser8,
    },
    {
      id: 9,
      avt: avatarsIcon.avtUser9,
    },
  ];
  useEffect(() => {
    const randomAvatar = avatars[(Math.random() * avatars.length) | 0];
    setAvatarUser(randomAvatar);
  }, [activeSlideIndex]);

  return (
    <div className="rounded-full">
      <Image src={avatarUser.avt} alt="avatar" width={width} height={height} />
    </div>
  );
};
export default AvatarUser;
