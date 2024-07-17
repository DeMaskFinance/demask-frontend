const version = "Version 0.2.0";
interface LogoProps {
  urlPNG: string;
  urlSVG: string;
  urlPNGFile: string;
  urlSVGFile: string;
}
const primaryLogo: LogoProps[] = [
  {
    urlPNG: "https://file.demask.finance/0ebb2dcde821039f0a582d97ee3027bd.png",
    urlSVG: "https://file.demask.finance/e9c9af378986ef2d49b409468bdb1710.svg",
    urlPNGFile: "/branding/png/Horizontal_Light.png",
    urlSVGFile: "/branding/svg/Horizontal_Light.svg",
  },
  {
    urlPNG: "https://file.demask.finance/0f252ac45c8027f1af78eb26b9ce294a.png",
    urlSVG: "https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg",
    urlPNGFile: "/branding/png/Horizontal_Purple.png",
    urlSVGFile: "/branding/svg/Horizontal_Purple.svg",
  },
  {
    urlPNG: "https://file.demask.finance/f52b0d1a3b5a96f5b8477a6c7c6dae14.png",
    urlSVG: "https://file.demask.finance/fc7d7ce0df4d88eb981d2e8a8a6122fe.svg",
    urlPNGFile: "/branding/png/Horizontal_Dark.png",
    urlSVGFile: "/branding/svg/Horizontal_Dark.svg",
  },
];
const secondLogo: LogoProps[] = [
  {
    urlPNG: "https://file.demask.finance/a4802614799928e022de8552dfd36422.png",
    urlSVG: "https://file.demask.finance/cfbf033604efa5bff6238c13d1ccba15.svg",
    urlPNGFile: "/branding/png/Stacked_Light.png",
    urlSVGFile: "/branding/svg/Stacked_Light.svg",
  },
  {
    urlPNG: "https://file.demask.finance/b3a796bbf6c08d567222fcfc42e3a3ac.png",
    urlSVG: "https://file.demask.finance/96e15ae63b1b199ef2ea94a11afdce9e.svg",
    urlPNGFile: "/branding/png/Stacked_Purple.png",
    urlSVGFile: "/branding/svg/Stacked_Purple.svg",
  },
  {
    urlPNG: "https://file.demask.finance/9100f93c3b772fb31ecd2068c4da5e6f.png",
    urlSVG: "https://file.demask.finance/32822c4cf42d70c3f825e63bfd877319.svg",
    urlPNGFile: "/branding/png/Stacked_Dark.png",
    urlSVGFile: "/branding/svg/Stacked_Dark.svg",
  },
];
const logoMark: LogoProps[] = [
  {
    urlPNG: "https://file.demask.finance/27006bdfe63d7bd213380f342a130181.png",
    urlSVG: "https://file.demask.finance/8ff826c8e14e14c49e33c5b177d3abce.svg",
    urlPNGFile: "/branding/png/Logomark_Light.png",
    urlSVGFile: "/branding/svg/Logomark_Light.svg",
  },
  {
    urlPNG: "https://file.demask.finance/1c6f41395ba54ec0faa5665b7addcc82.png",
    urlSVG: "https://file.demask.finance/f90715665a6e1a824a502c5f4495ffac.svg",
    urlPNGFile: "/branding/png/Logomark_Purple.png",
    urlSVGFile: "/branding/svg/Logomark_Purple.svg",
  },
  {
    urlPNG: "https://file.demask.finance/0715037a9be154d92a694168306ddd7b.png",
    urlSVG: "https://file.demask.finance/25d846a743e31b7085e9e90b7c4f2461.svg",
    urlPNGFile: "/branding/png/Logomark_Dark.png",
    urlSVGFile: "/branding/svg/Logomark_Dark.svg",
  },
];
export { version, primaryLogo, secondLogo, logoMark };
