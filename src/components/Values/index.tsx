import Image from "next/image";
import React from "react";
import TitleMain from "../TitleMain";
import Funtions from "./Funtions";
import { DiamondIcon } from "../Icons";

const Values = () => {
  return (
    <div
      className="w-full mx-auto flex flex-col items-center bg-shader_900 relative mb-14"
      id="values"
    >
      <div className="mb-8 md:mb-20">
        <Image src="/diamond.png" width={300} height={400} alt="diamond" />
      </div>
      <TitleMain
        title="OUR VALUES"
        description="An on-chain AMM Protocol for Trading"
        id="tsparticles-1"
        icon={<DiamondIcon />}
      />
      <Funtions />
    </div>
  );
};

export default Values;
