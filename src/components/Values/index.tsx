import Image from "next/image";
import React from "react";
import TitleMain from "../TitleMain";
import Funtions from "./Funtions";

const Values = () => {
  return (
    <div className="w-full mx-auto flex flex-col items-center bg-shader_900 relative mb-14">
      <div className="mb-20">
        <Image src="/diamond.png" width={300} height={400} alt="diamond" />
      </div>
      <TitleMain />
      <Funtions />
    </div>
  );
};

export default Values;
