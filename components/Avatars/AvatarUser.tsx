import images from "@/public/images";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface IStateAvt {
    id:number,
    avt:typeof import("*.png"),
}
interface AvatarProps {
    activeSlideIndex?:number,
}
export default function AvatarUser(props: AvatarProps) {
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
  }, [props.activeSlideIndex]);

  return (
    <div className="w-8 h-8 mr-2 rounded-full">
      <Image src={avatarUser.avt} alt="avatar" width={32} height={32} />
    </div>
  );
}
