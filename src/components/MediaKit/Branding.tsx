import Image from "next/image";
import React from "react";
import { DownLoadIcon } from "../Icons";
import { logoMark, primaryLogo, secondLogo } from "@/lib/constants";
const styles = {
  btn: "py-2 px-3 text-sm border-none rounded-lg text-white flex gap-x-1",
};
interface LogoProps {
  urlPNG: string;
  urlSVG: string;
  urlPNGFile: string;
  urlSVGFile: string;
}
interface LogoListProps {
  listArray: LogoProps[];
  titleMain: string;
  direction?: string;
  isPadding?: boolean;
}
const Branding = () => {
  const colorList = [
    {
      color: "purple",
      title: "Demask Purple",
      colorHex: "#7413DC",
    },
    // {
    //   color: "secondary5",
    //   title: "Key Purple",
    //   colorHex: "#9075FE",
    // },
    // {
    //   color: "secondary1",
    //   title: "Primary Purple",
    //   colorHex: "#514199",
    // },
    {
      color: "dark0",
      title: "Dark Hole",
      colorHex: "#181A20",
    },
    {
      color: "white",
      title: "White Fox",
      colorHex: "#FFFFFF",
      border: true,
    },
  ];

  const Logo: React.FC<LogoListProps> = ({
    listArray,
    titleMain,
    direction,
  }) => {
    return (
      <div>
        <div className="flex mt-8 gap-x-1 mb-4">
          <p className="title ">{titleMain}:</p>
          <h3 className=" font-semibold text-primary_300">{direction}</h3>
        </div>
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-x-11 gap-y-8`}>
          {listArray.map((item, index) => (
            <div key={index}>
              <Image
                alt="Primary Logo"
                width={400}
                height={150}
                src={item.urlSVG}
                className=" w-full max-h-[226px] rounded-lg"
              />
              <div className="flex justify-center mt-3 gap-x-2">
                <a href={item.urlPNGFile} download>
                  <button className={`${styles.btn} bg-shader_500`}>
                    PNG
                    <DownLoadIcon width={20} height={20} />
                  </button>
                </a>
                <a href={item.urlSVGFile} download>
                  <button
                    className={`${styles.btn} bg-primary_500 bg-opacity-25`}
                  >
                    SVG
                    <DownLoadIcon width={20} height={20} />
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div>
      <h2 className="mb-4 title">Brand Colors</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-11">
        {colorList.map((item, index) => (
          <div className={`text-center text-dark2}`} key={index}>
            <div
              className={`w-full h-[120px] rounded-lg bg-[${item.colorHex}] ${
                item.border && "border border-dark3"
              }`}
              style={{ backgroundColor: item.colorHex }}
            ></div>
            <p className="my-1 text-sm font-semibold">{item.title}</p>
            <p className="text-sm font-normal">{item.colorHex}</p>
          </div>
        ))}
      </div>
      <Logo
        listArray={primaryLogo}
        titleMain="Primary Logo"
        direction="Horizontal"
        isPadding={false}
      />
      <Logo
        listArray={secondLogo}
        titleMain="Primary Logo"
        direction="Stacked"
        isPadding={true}
      />
      <Logo listArray={logoMark} titleMain="Logomark" isPadding={true} />
    </div>
  );
};

export default Branding;
