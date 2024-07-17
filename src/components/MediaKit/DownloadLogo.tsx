"use client";
import { DownLoadIcon } from "../Icons";

const DownloadLogo = () => {
  return (
    <a
      href="/branding"
      className="bg-shader_500 text-white px-3 flex gap-x-2 rounded-lg items-center w-fit font-normal text-sm hover:bg-shader_600 h-10"
      download
    >
      Download full logopack
      <DownLoadIcon width={20} height={20} />
    </a>
  );
};

export default DownloadLogo;
