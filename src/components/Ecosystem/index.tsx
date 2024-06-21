import React from "react";
import Image from "next/image";
export default function Ecosystem() {
  return (
    <div className="flex flex-col items-center w-screen pt-14 mx-auto text-white bg-primary_500 bg-opacity-10">
      <h2 className="text-[2.5rem] font-bold uppercase gradient-text">
        Ecosystem of Demask
      </h2>
      <p>A sustainable growing network of NFTs Market.</p>
      <div>
        <Image src="/BACKGROUND.svg" alt="logo" width={200} height={300} />
      </div>
    </div>
  );
}
