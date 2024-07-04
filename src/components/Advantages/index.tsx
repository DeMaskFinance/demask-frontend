import Image from "next/image";
import React from "react";
import TitleMain from "../TitleMain";
import Funtions from "./Funtions";
import { DiamondIcon } from "../Icons";

const Advantages = () => {
  return (
    <div className="w-full mx-auto flex flex-col items-center bg-shader_900 relative mb-14 ">
      <div className="md:-mb-10">
        <Image src="/diamond.png" width={300} height={400} alt="diamond" />
      </div>

      <div id="advantages" className="pt-8 md:pt-28">
        <TitleMain
          title="Advantages"
          description="Everyone will feel comfortable using Demask Finance"
          id="tsparticles-1"
          icon={<DiamondIcon />}
          className="shadow-values border-primary_500 border-opacity-35"
        />
        <Funtions />
      </div>
    </div>
  );
};

export default Advantages;
