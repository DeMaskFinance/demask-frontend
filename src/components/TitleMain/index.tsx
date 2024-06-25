"use client";
import React from "react";
import { DiamondIcon } from "../Icons";
import BackgroundParticles from "../Backgrounds/BackgroundParticles";

interface TitleMainProps {
  title: string;
  description: string;
  id: string;
  icon: React.ReactNode;
  className: string;
}

const TitleMain: React.FC<TitleMainProps> = ({
  title,
  description,
  id,
  icon,
  className,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center relative border-[2px] ${className} overflow-hidden`}
        // style={{
        //   boxShadow: `0px 0px 20px 0px ${rgba}`,
        // }}
      >
        {icon}
        <BackgroundParticles value={18000} id={id} />
      </div>
      <h2 className="text-3xl font-bold text-white mt-3">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default TitleMain;
