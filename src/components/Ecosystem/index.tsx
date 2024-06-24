import React from "react";
import Image from "next/image";
export default function Ecosystem() {
  return (
    <div className="flex flex-col items-center w-screen pt-14 mx-auto text-white  bg-opacity-10 bg-ecosystem-gradient text-center">
      <h2 className="text-2xl md:text-[2.5rem] font-bold uppercase gradient-text">
        Ecosystem of Demask
      </h2>
      <p className="text-shader_100">
        A sustainable growing network of NFTs Market.
      </p>
      <div>
        <Image src="/Ecosystem.svg" alt="logo" width={688} height={314} />
      </div>
    </div>
  );
}
