import Image from "next/image";
import React from "react";
const styles = {
  btn: "py-2 px-4 text-sm font-semibold border rounded-lg border-secondary2 text-secondary2",
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
    {
      color: "secondary5",
      title: "Key Purple",
      colorHex: "#9075FE",
    },
    {
      color: "secondary1",
      title: "Primary Purple",
      colorHex: "#514199",
    },
    {
      color: "dark0",
      title: "Dark Hole",
      colorHex: "#000D34",
    },
    {
      color: "white",
      title: "White Fox",
      colorHex: "#FFFFFF",
      border: true,
    },
  ];
  const primaryLogo: LogoProps[] = [
    {
      urlPNG:
        "https://file.demask.finance/0f252ac45c8027f1af78eb26b9ce294a.png",
      urlSVG:
        "https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg",
      urlPNGFile: "/branding/png/Horizontal_Purple.png",
      urlSVGFile: "/branding/svg/Horizontal_Purple.svg",
    },
    {
      urlPNG:
        "https://file.demask.finance/f52b0d1a3b5a96f5b8477a6c7c6dae14.png",
      urlSVG:
        "https://file.demask.finance/fc7d7ce0df4d88eb981d2e8a8a6122fe.svg",
      urlPNGFile: "/branding/png/Horizontal_Dark.png",
      urlSVGFile: "/branding/svg/Horizontal_Dark.svg",
    },
    {
      urlPNG:
        "https://file.demask.finance/0ebb2dcde821039f0a582d97ee3027bd.png",
      urlSVG:
        "https://file.demask.finance/e9c9af378986ef2d49b409468bdb1710.svg",
      urlPNGFile: "/branding/png/Horizontal_Light.png",
      urlSVGFile: "/branding/svg/Horizontal_Light.svg",
    },
  ];
  const secondLogo: LogoProps[] = [
    {
      urlPNG:
        "https://file.demask.finance/b3a796bbf6c08d567222fcfc42e3a3ac.png",
      urlSVG:
        "https://file.demask.finance/96e15ae63b1b199ef2ea94a11afdce9e.svg",
      urlPNGFile: "/branding/png/Stacked_Purple.png",
      urlSVGFile: "/branding/svg/Stacked_Purple.svg",
    },
    {
      urlPNG:
        "https://file.demask.finance/9100f93c3b772fb31ecd2068c4da5e6f.png",
      urlSVG:
        "https://file.demask.finance/32822c4cf42d70c3f825e63bfd877319.svg",
      urlPNGFile: "/branding/png/Stacked_Dark.png",
      urlSVGFile: "/branding/svg/Stacked_Dark.svg",
    },
    {
      urlPNG:
        "https://file.demask.finance/a4802614799928e022de8552dfd36422.png",
      urlSVG:
        "https://file.demask.finance/cfbf033604efa5bff6238c13d1ccba15.svg",
      urlPNGFile: "/branding/png/Stacked_Light.png",
      urlSVGFile: "/branding/svg/Stacked_Light.svg",
    },
  ];
  const logoMark: LogoProps[] = [
    {
      urlPNG:
        "https://file.demask.finance/1c6f41395ba54ec0faa5665b7addcc82.png",
      urlSVG:
        "https://file.demask.finance/f90715665a6e1a824a502c5f4495ffac.svg",
      urlPNGFile: "/branding/png/Logomark_Purple.png",
      urlSVGFile: "/branding/svg/Logomark_Purple.svg",
    },
    {
      urlPNG:
        "https://file.demask.finance/0715037a9be154d92a694168306ddd7b.png",
      urlSVG:
        "https://file.demask.finance/25d846a743e31b7085e9e90b7c4f2461.svg",
      urlPNGFile: "/branding/png/Logomark_Dark.png",
      urlSVGFile: "/branding/svg/Logomark_Dark.svg",
    },
    {
      urlPNG:
        "https://file.demask.finance/27006bdfe63d7bd213380f342a130181.png",
      urlSVG:
        "https://file.demask.finance/8ff826c8e14e14c49e33c5b177d3abce.svg",
      urlPNGFile: "/branding/png/Logomark_Light.png",
      urlSVGFile: "/branding/svg/Logomark_Light.svg",
    },
  ];
  const Logo: React.FC<LogoListProps> = ({
    listArray,
    titleMain,
    direction,
    isPadding,
  }) => {
    return (
      <div>
        <h2 className="title mt-14">{titleMain}</h2>
        <h3 className="mb-4 font-semibold text-secondary5">{direction}</h3>
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-x-11 ${
            isPadding && "lg:px-[134px] px-10"
          } gap-y-8`}
        >
          {listArray.map((item, index) => (
            <div key={index}>
              <Image
                alt="Primary Logo"
                width={400}
                height={150}
                src={item.urlSVG}
                className="object-cover w-full"
              />
              <div className="flex justify-center mt-2 gap-x-4">
                <a href={item.urlPNGFile} download>
                  <button className={styles.btn}>PNG</button>
                </a>
                <a href={item.urlSVGFile} download>
                  <button className={styles.btn}>SVG</button>
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
