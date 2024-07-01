import React from "react";
import { Button } from "../ui/button";
import { DemaskIcon, LDownIcon } from "../Icons";
import Static from "./Static";
import BackgroundParticles from "../Backgrounds/BackgroundParticles";
import Spline from "@splinetool/react-spline";

const About = () => {
  return (
    <div className="h-[90vh] relative w-full">
      <div className=" absolute top-0 bottom-0 left-0 right-0">
        <video
          muted
          autoPlay
          loop
          playsInline
          className="w-screen h-full object-cover"
        >
          <source src="/homeVideo.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        className=" text-center h-full w-full relative flex flex-col"
        id="about"
      >
        <div className="w-[655px] h-[150px] bg-linear-g2 absolute top-0 right-1/4 blur-[100px] opacity-35 rounded-full rotate-25 z-10"></div>
        <div className="flex flex-col items-center text-lg h-[40%] justify-end">
          <a
            href="https://galxe.com/MeeT2AiDRo73NiBYKoZdwa/campaign/GCd7Ft4Npv"
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="py-2 px-3 text-sm bg-link-gradient rounded-full text-white relative gradient-border flex gap-x-2 items-center">
              <p className="text-nowrap">The Campaigns on Galxe, NOW LIVE!</p>
              <LDownIcon width={16} height={16} />
              <BackgroundParticles value={6000} id="ts_particle8" />
            </div>
          </a>
          <h1 className="font-bold text-white text-3xl md:text-medium leading-snug my-2 md:my-0">
            DEMASK FINANCE
          </h1>
          <div className="text-sm md:text-base">
            <p>An on-chain AMM Protocol for Trading between an</p>
            <p>NFT Collection and an Native Token</p>
          </div>

          <div className="btn_animation btn_active mt-8">
            <div className="overlay">
              <a
                href="https://app.demask.finance/swap"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="gradient"
                  className="flex rounded-3xl gap-x-2 px-7"
                >
                  <DemaskIcon width={20} height={20} />
                  <p>Launch app</p>
                </Button>
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="absolute bottom-0 left-0 right-0 z-50">
            <Static />
            <div className="w-[900px] h-[200px] bg-linear-g2 absolute bottom-0 right-1/2 blur-[100px] opacity-20 rounded-full rotate-25 -z-10 translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
