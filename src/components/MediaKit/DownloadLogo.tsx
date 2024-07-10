"use client";
import React from "react";
import { logoMark, primaryLogo, secondLogo } from "@/lib/constants";
import { DownLoadIcon } from "../Icons";
import { saveAs } from "file-saver";
async function downloadFile(url: string, filename: string) {
  // const response = await fetch(url);
  // const blob = await response.blob();
  saveAs(url, "image.jpg");
}

async function downloadAllFiles() {
  const allLogos = [...primaryLogo, ...secondLogo, ...logoMark];
  for (const logo of allLogos) {
    // await downloadFile(logo.urlPNG, logo.urlPNGFile);
    await downloadFile(logo.urlSVG, logo.urlPNG);
  }
}
const DownloadLogo = () => {
  return (
    <button
      className="bg-shader_500 text-white px-3 flex gap-x-2 rounded-lg items-center w-fit font-normal text-sm hover:bg-shader_600 h-10"
      onClick={downloadAllFiles}
    >
      Download full logopack
      <DownLoadIcon width={20} height={20} />
    </button>
  );
};

export default DownloadLogo;
