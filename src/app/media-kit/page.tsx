import { DownLoadIcon } from "@/components/Icons";
import { Branding } from "@/components/MediaKit";
import DownloadLogo from "@/components/MediaKit/DownloadLogo";
import Guidelines from "@/components/MediaKit/Guidelines";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
const MediaKitPage = () => {
  return (
    <div>
      <div className="w-[655px] h-[150px] bg-linear-g2 absolute top-0 right-1/4 blur-[100px] opacity-20 rounded-full rotate-25 -z-10"></div>
      <div className="md:py-14 py-4 min-h-[75vh] max-w-[800px] mx-auto flex flex-col gap-y-4 lg:mb-0 px-4">
        <h2 className="text-xl md:text-[2.5rem] font-bold uppercase text-primary_100">
          Branding & Media kit
        </h2>
        <Image
          src="/BannerMediaKit.svg"
          width={1000}
          height={500}
          alt="banner"
          className="max-w-[650px] w-full"
        />
        <DownloadLogo />
        <div className=" md:px-0">
          <Guidelines />
          <Branding />
        </div>
      </div>
    </div>
  );
};

export default MediaKitPage;
