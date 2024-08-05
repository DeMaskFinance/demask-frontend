import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { FunctionComponent } from "react";

interface AvatarProps {
  size: number;
  seed: string;
}
interface AvatarCustomProps {
  avatarUrl?: string;
  userAddress?: string;
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
        <Avatar
          className={`relative overflow-hidden rounded-full ${className}`}
        >
          <AvatarImage
            src={avatarUrl}
            alt="user avatar"
            className={`object-cover transition-transform duration-150 ${className} ${
              zoom ? "group-hover:scale-[1.05]" : ""
            }`}
          />
          <AvatarFallback className="bg-slate-500"></AvatarFallback>
        </Avatar>
      ) : (
        <AvatarDiceBear size={size} seed={userAddress!} />
      )}
    </>
  );
};
export default AvatarCustom;
export { AvatarDiceBear };
