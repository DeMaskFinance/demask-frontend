import { AvatarCustom } from "@/components/Avatars";
import { BackgroundDefault } from "@/components/Backgrounds";
import Back from "@/components/Common/Back";
import { UploadIcon } from "@/components/Icons";
import { uploadFile } from "@/libs/service/userService";
import { selectProfile, userData } from "@/store/profileSlice";
import { useRef, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import EditProfileForm from "./EditProfileForm";

export default function EditProfile() {
  const inputAvatar = useRef(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const { profile } = useSelector(selectProfile);
  const dispatch = useDispatch();
  const handleUploadAvatar = async (file: any) => {
    try {
      setAvatarLoading(true);
      const res = await uploadFile({ avatar: file });
      toast.success("Update Successed");
      dispatch(userData({ profile: res }));
    } catch (error) {
      toast.error("Update Error");
      console.error(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  return (
    <BackgroundDefault>
      <div className="px-4 pb-20 lg:px-0 lg:pb-0 mx-auto max-w-[600px]">
        <Back />
        <h1 className="text-xl font-bold text-primary_300">Edit Profile</h1>
        <div className="my-4 md:my-10">
          <div className="relative rounded-full cursor-pointer w-fit h-fit group ">
            <div className="group-hover:brightness-50 transition-all duration-200 ease-in">
              <AvatarCustom
                avatarUrl={profile?.avatar}
                size={120}
                userAddress={profile?.userAddress!}
                className="md:w-36 md:h-36 h-20 w-20 rounded-full"
              />
            </div>
            {avatarLoading ? (
              <div className="absolute top-0 bottom-0 z-10 flex items-center justify-center w-full h-full rounded-full bg-slate-600/[.7]">
                <BiLoaderAlt className="text-4xl text-white animate-spin" />
              </div>
            ) : (
              <div
                className="absolute top-0 left-0 flex-col items-center justify-center hidden w-full h-full text-white rounded-full group-hover:flex "
                onClick={() => {
                  if (inputAvatar.current) {
                    (inputAvatar.current as HTMLInputElement).click();
                  }
                }}
              >
                <UploadIcon width={24} height={24} />
                <p className="text-sm mt-2">300 x 300px</p>
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
                    toast.error("Oversize");
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
