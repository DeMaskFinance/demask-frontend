import React from "react";
import { Button } from "../ui/button";
import { DemaskIcon, LDownIcon } from "../Icons";
import Static from "./Static";
import BackgroundParticles from "../Backgrounds/BackgroundParticles";

const About = () => {
  return (
    <div>
      <div
        className=" text-center h-[86vh] md:h-[90vh] w-full relative"
        id="about"
      >
        <div className="w-[655px] h-[150px] bg-linear-g2 absolute top-0 right-1/4 blur-[100px] opacity-20 rounded-full rotate-25 -z-10"></div>
        <div className="flex flex-col items-center text-lg px-16 h-1/2 justify-end">
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
        <div className="h-1/2">
          {/* <Spline scene="https://prod.spline.design/UB73Atxy70Sc82dO/scene.splinecode" /> */}
          {/* <div data-framer-appear-id="6453br" style={{ opacity: 1 }}>
            <iframe
              src="https://my.spline.design/gitnesssplinetest-e39b09572ab1dc0fd47317d99c8d7599/"
              // style={{width:100%,height:100%,border:none}}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-same-origin allow-scripts allow-downloads allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            ></iframe>
          </div> */}
          {/* <Spline
            className="spline"
            scene="https://prod.spline.design/k99HVzraHEeIFQii/scene.splinecode"
          /> */}
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
