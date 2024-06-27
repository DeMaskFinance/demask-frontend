import React from "react";
import TitleMain from "../TitleMain";
import {
  DiscordIcon,
  GlobalIcon,
  LDownIcon,
  TeleIcon,
  TwitterIcon,
} from "../Icons";
import BackgroundParticles from "../Backgrounds/BackgroundParticles";
import Image from "next/image";

const Community = () => {
  const socialList = [
    {
      title: "Discord",
      icon: <DiscordIcon width={48} height={48} />,
      link: "https://discord.com/invite/demaskfinance",
      resume: "Join our Discord community today and start connecting!",
      delay: "500",
    },
    {
      title: "X/Twitter",
      icon: <TwitterIcon width={48} height={48} />,
      link: "https://discord.com/invite/demaskfinance",
      resume: "Follow our Twitter community for the latest updates!",
      delay: "700",
    },
    {
      title: "Telegram",
      icon: <TeleIcon width={48} height={48} />,
      link: "https://discord.com/invite/demaskfinance",
      resume: "Join our channel for updates and vibrant discussions!",
      delay: "900",
    },
  ];
  return (
    <div className="relative " id="community">
      <TitleMain
        title="JOIN OUR COMMUNITY"
        description="Connect, Share, and Grow Together"
        id="tsparticles-5"
        icon={<GlobalIcon />}
        className="shadow-community border-[#FFEFD0]"
      />
      <div className="py-2 px-3 text-sm bg-link-gradient rounded-full text-white relative gradient-border flex gap-x-2 items-center w-fit mx-auto mt-8 ">
        <p className="text-nowrap">Growth through collaboration and sharing.</p>
        <LDownIcon width={16} height={16} />
        <BackgroundParticles value={6000} id="ts_particle9" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 mt-16 pb-[50px] md:pb-[114px]">
        {socialList.map((item, index) => (
          <div
            className="p-4 flex gap-x-4 bg-shader_800 border border-shader_500 rounded-[10px] w-[340px]"
            key={index}
            data-aos="fade-up"
            data-aos-delay={item.delay}
          >
            {item.icon}
            <div>
              <p>{item.title}</p>
              <p>{item.resume}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="opacity-45 absolute bottom-0  -z-10 w-full h-80 md:h-full ">
        <Image
          src="/Pattern_ glass.png"
          alt="gradient_glass"
          width={890}
          height={300}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Community;
