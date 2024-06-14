import CategoryType from "@/components/Categories/CategoryType";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { BackgroundDefault } from "@/components/Backgrounds";
import {
  ArtIcon,
  FilmIcon,
  GamingIcon,
  MembershipIcon,
  MusicIcon,
} from "@/components/Icons";
const updateMeta = {
  ...SEO,
  title: "Category",
};
export default function Categories() {
  const types = [
    {
      key: "all",
      title: "All Category",
      panel: () => <div>123</div>,
    },
    {
      key: "art",
      title: "ART",
      panel: () => <div>123</div>,
      icon: <ArtIcon width={24} height={24} />,
    },
    {
      key: "gaming",
      title: "GAMING",
      panel: () => <div>123</div>,
      icon: <GamingIcon width={24} height={24} />,
    },
    {
      key: "film",
      title: "FILM",
      panel: () => <div>123</div>,
      icon: <FilmIcon width={24} height={24} />,
    },
    {
      key: "music",
      title: "MUSIC",
      panel: () => <div>123</div>,
      icon: <MusicIcon width={24} height={24} />,
    },
    {
      key: "membership",
      title: "MEMBERSHIP",
      panel: () => <div>123</div>,
      icon: <MembershipIcon width={24} height={24} />,
    },
  ];
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />

      <div className=" py-10 mx-auto  min-h-[83vh] px-10">
        <h1 className="title text-2xl font-bold mb-10">
          BROWSE ALL NFT COLLECTIONS
        </h1>
        <div className="flex gap-x-3 mb-6">
          {types.map((type, index: number) => (
            <div
              key={index}
              className="bg-shader_700 flex gap-x-1 border border-shader_400 rounded-lg py-2 px-3 text-white font-semibold text-lg items-center hover:bg-shader_400 transition-all duration-300 cursor-pointer"
            >
              {type.icon}
              {type.title}
            </div>
          ))}
        </div>
        <CategoryType label={"Art"} />
        <CategoryType label={"Gaming"} />
        <CategoryType label={"Film"} />
        <CategoryType label={"Music"} />
        <CategoryType label={"Memberships"} />
        <CategoryType label={"Others"} />
      </div>
    </BackgroundDefault>
  );
}
