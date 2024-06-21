import React from "react";
import { Button } from "../ui/button";
import { DemaskIcon } from "../Icons";
import Spline from "@splinetool/react-spline";
import Static from "./Static";

const About = () => {
  return (
    <div>
      <div className=" text-center h-[96vh] w-full relative">
        <div className="w-[655px] h-[150px] bg-linear-g2 absolute top-0 right-1/4 blur-[100px] opacity-20 rounded-full rotate-25 -z-10"></div>
        <div className="flex flex-col items-center text-lg px-16 h-1/2 justify-end">
          <Button size="sm">Lorem ipsum dolor sit amet, consectetur</Button>
          <h1 className="font-bold text-white text-medium leading-snug">
            DEMASK FINANCE
          </h1>
          <p>An on-chain AMM Protocol for Trading between an</p>
          <p>NFT Collection and an ERC20 Token</p>
          <Button
            variant="gradient"
            className="flex rounded-3xl mt-8 gap-x-2 px-7"
          >
            <DemaskIcon width={20} height={20} />
            <p>Launch app</p>
          </Button>
        </div>
        <div className="h-1/2">
          <Spline scene="https://prod.spline.design/UB73Atxy70Sc82dO/scene.splinecode" />
        </div>
      </div>
      <div className="relative">
        <Static />
        <div className="w-[1174px] h-[287px] bg-linear-g2 absolute bottom-0 right-1/2 blur-[100px] opacity-20 rounded-full rotate-25 -z-10 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default About;
