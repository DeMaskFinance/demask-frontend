import images from "@/public/images";
import Image from "next/image";
import React, { useState, useEffect, FunctionComponent } from "react";

interface IStateAvt {
    id:number,
    avt:typeof import("*.png"),
}
interface AvatarProps {
    activeSlideIndex?:number,
    width:number,
    height:number,
}

const AvatarUser: FunctionComponent<AvatarProps> = ({ activeSlideIndex,width,height }) => {
  const [avatarUser, setAvatarUser] = useState<IStateAvt>({
    id: 1,
    avt: images.avtUser1,
  });
  const avatars = [
    {
      id: 1,
      avt: images.avtUser1,
    },
    {
      id: 2,
      avt: images.avtUser2,
    },
    {
      id: 3,
      avt: images.avtUser3,
    },
    {
      id: 4,
      avt: images.avtUser4,
    },
  ];
  useEffect(() => {
    const randomAvatar = avatars[(Math.random() * avatars.length) | 0];
    setAvatarUser(randomAvatar);
  }, [activeSlideIndex]);

  return (
    <div className="w-8 h-8 mr-2 rounded-full">
      <Image src={avatarUser.avt} alt="avatar" width={width} height={height} />
    </div>
  );
}
export default AvatarUser;
