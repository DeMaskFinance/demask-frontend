"use client";
import React from "react";
import { DiamondIcon } from "../Icons";
import BackgroundParticles from "../Backgrounds/BackgroundParticles";

const TitleMain = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-xl flex items-center justify-center relative border-[2px] border-primary_500 border-opacity-35 shadow-primary_500 overflow-hidden">
        <DiamondIcon width={40} height={40} />
        <BackgroundParticles value={18000} id="particles-js1" />
      </div>
      <h2 className="text-3xl font-bold text-white mt-3">OUR VALUES</h2>
      <p>An on-chain AMM Protocol for Trading </p>
    </div>
  );
};

export default TitleMain;
