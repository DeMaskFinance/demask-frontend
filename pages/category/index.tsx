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
  OthersIcon,
} from "@/components/Icons";
import { useState } from "react";
import { CategoryDetail } from "@/components/Categories";
const updateMeta = {
  ...SEO,
  title: "Category",
};
interface Type {
  key: string;
  title: string;
  panel: () => JSX.Element;
  icon?: JSX.Element;
}
export default function Categories() {
  const types: Type[] = [
    {
      key: "all",
      title: "All Category",
      panel: () => (
        <div>
          <CategoryType label={"Art"} />
          <CategoryType label={"Gaming"} />
          <CategoryType label={"Film"} />
          <CategoryType label={"Music"} />
          <CategoryType label={"Memberships"} />
          <CategoryType label={"Others"} />
        </div>
      ),
    },
    {
      key: "art",
      title: "ART",
      panel: () => <CategoryDetail label="Art" />,
      icon: <ArtIcon width={24} height={24} />,
    },
    {
      key: "gaming",
      title: "GAMING",
      panel: () => <CategoryDetail label="Gaming" />,
      icon: <GamingIcon width={24} height={24} />,
    },
    {
      key: "film",
      title: "FILM",
      panel: () => <CategoryDetail label="Film" />,
      icon: <FilmIcon width={24} height={24} />,
    },
    {
      key: "music",
      title: "MUSIC",
      panel: () => <CategoryDetail label="Music" />,
      icon: <MusicIcon width={24} height={24} />,
    },
    {
      key: "membership",
      title: "MEMBERSHIP",
      panel: () => <CategoryDetail label="Membership" />,
      icon: <MembershipIcon width={24} height={24} />,
    },
    {
      key: "others",
      title: "OTHERS",
      panel: () => <CategoryDetail label="Others" />,
      icon: <OthersIcon width={24} height={24} />,
    },
  ];
  const [option, setOption] = useState<Type>(types[0]);
  console.log(option);

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
              onClick={() => {
                setOption(type);
              }}
              className={`${
                option.key === type.key ? "bg-shader_400" : "bg-shader_700"
              } flex gap-x-1 border border-shader_400 rounded-lg py-2 px-3 text-white font-semibold text-lg items-center hover:bg-shader_400 transition-all duration-300 cursor-pointer `}
            >
              {type.icon}
              {type.title}
            </div>
          ))}
        </div>
        {option.panel()}
      </div>
    </BackgroundDefault>
  );
}
