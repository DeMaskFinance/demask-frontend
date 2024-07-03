"use client";
import React, { useState } from "react";
import { DemaskIcon, DemaskTitle, LightIcon, RightIcon } from "../Icons";
import { Button } from "../ui/button";
import BackgroundParticles from "../Backgrounds/BackgroundParticles";
import Marquee from "react-fast-marquee";
import { CgClose } from "react-icons/cg";
import { useLenis } from "lenis/react";
import ScrollToParams from "lenis/react";
import LenisInstance from "lenis/react";
const Header = () => {
  const [isEvent, setIsEvent] = useState(true);

  const navList = [
    {
      title: "About",
      id: "#about",
    },
    {
      title: "Values",
      id: "#values",
    },
    {
      title: "Features",
      id: "#features",
    },
    {
      title: "Community",
      id: "#community",
    },
  ];
  const lenisInstance: any = useLenis();
  return (
    <div className={`${isEvent ? "pb-[100px]" : "pb-[56px]"}`}>
      <div className="top-0 left-0 right-0 z-[99999] fixed">
        {isEvent && (
          <div className="relative">
            <a
              href="https://app.galxe.com/quest/MeeT2AiDRo73NiBYKoZdwa"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="block cursor-pointer text-white bg-event-gradient  bg-blend-screen relative overflow-hidden -z-50 h-11">
                <Marquee autoFill pauseOnHover gradient gradientColor="#7C7FF8">
                  <div className="flex items-center justify-center h-11 mr-20 gap-x-3 font-semibold">
                    <span>
                      <LightIcon width={24} height={24} />
                    </span>
                    <span>The Campaigns on Galxe, NOW LIVE!</span>
                  </div>
                </Marquee>
                <BackgroundParticles value={1800} id="particles-js" />
              </div>
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEvent(false);
              }}
              className={`absolute top-2 right-4 flex items-center p-1 z-[60]`}
            >
              <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
            </button>
          </div>
        )}
        <header className="text-shader_200 w-screen h-header flex border-b border-shader_500 px-4 bg-opacity-65 bg-shader_900 items-center justify-between font-semibold text-sm backdrop-blur-xl">
          <div className="flex items-center gap-x-[6px] ">
            <DemaskIcon width={24} height={24} />
            <DemaskTitle width={76} height={14} />
          </div>
          <ul className="gap-x-8 md:flex hidden">
            {navList.map((item, index) => (
              <a
                // href={`${item.id}`}
                className={`hover:text-shader_200 text-shader_100 cursor-pointer`}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  lenisInstance.scrollTo(item.id);
                }}
              >
                {item.title}
              </a>
            ))}
          </ul>
          <a
            href="https://app.demask.finance/swap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="gradient"
              className="flex items-center gap-x-2 pl-4 pr-2 h-10"
            >
              <p>Launch app</p>
              <RightIcon width={20} height={20} />
            </Button>
          </a>
        </header>
      </div>
    </div>
  );
};

export default Header;
