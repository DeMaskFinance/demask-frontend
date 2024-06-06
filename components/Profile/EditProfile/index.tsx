import { AvatarCustom } from "@/components/Avatars";
import { EditIcon } from "@/components/Icons";
import { uploadFile } from "@/libs/service/userService";
import { selectProfile, userData } from "@/store/profileSlice";
import Image from "next/image";
import { useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import EditProfileForm from "./EditProfileForm";
import { BackgroundDefault } from "@/components/Backgrounds";

export default function EditProfile() {
  const inputAvatar = useRef(null);
  const inputBanner = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const { user, profile } = useSelector(selectProfile);
  const dispatch = useDispatch();
  const handleUploadAvatar = async (file: any) => {
    try {
      setAvatarLoading(true);
      const res = await uploadFile({ avatar: file });
      dispatch(userData({ profile: res }));
    } catch (error) {
      console.error(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <BackgroundDefault>
      <div className="px-4 pb-20 lg:px-0 lg:pb-0">
        <h1 className="mt-8 text-xl font-semibold text-center title">
          Edit My Profile
        </h1>
        <div className="flex justify-center my-6">
          <div className="relative rounded-full cursor-pointer w-fit h-fit group">
            <div className="group-hover:brightness-50">
              <AvatarCustom
                avatarUrl={profile?.avatar}
                size={120}
                userAddress={profile.userAddress!}
                className="w-[120px] h-[120px] rounded-full"
              />
            </div>
            {avatarLoading ? (
              <div className="absolute top-0 bottom-0 z-10 flex items-center justify-center w-full h-full rounded-full bg-slate-600/[.7]">
                <BiLoaderAlt className="text-4xl text-white animate-spin" />
              </div>
            ) : (
              <div
                className="absolute top-0 left-0 flex-col items-center justify-center hidden w-full h-full text-white rounded-full group-hover:flex"
                onClick={() => {
                  if (inputAvatar.current) {
                    (inputAvatar.current as HTMLInputElement).click();
                  }
                }}
              >
                <EditIcon width={32} height={32} />
                <p className="text-xs">600 x 600px</p>
              </div>
            )}
          </div>
          <div>
            <input
              type="file"
              ref={inputAvatar}
              accept="image/png,image/jpeg,image/gif"
              onChange={async (e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  if (file && file.size < 10485760) {
                    handleUploadAvatar(file);
                  } else {
                    console.log("Oversize");
                  }
                }
              }}
              className="hidden"
            />
          </div>
        </div>
        <EditProfileForm />
      </div>
    </BackgroundDefault>
  );
}
