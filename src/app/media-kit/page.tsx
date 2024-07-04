import { Branding } from "@/components/MediaKit";
import Guidelines from "@/components/MediaKit/Guidelines";
import React from "react";
const MediaKitPage = () => {
  return (
    <div>
      <div className="py-8 min-h-[75vh] max-w-[800px] mx-auto flex flex-col gap-y-14 mb-[100px] lg:mb-0">
        <h2 className="text-2xl md:text-[2.5rem] font-bold uppercase gradient-text">
          Branding & Media
        </h2>
        <div className="px-4 md:px-0">
          <Guidelines />
          <Branding />
        </div>
      </div>
    </div>
  );
};

export default MediaKitPage;
