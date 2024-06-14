import CategoryType from "@/components/Categories/CategoryType";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { BackgroundDefault } from "@/components/Backgrounds";
const updateMeta = {
  ...SEO,
  title: "Category",
};
export default function Categories() {
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />

      <div className=" py-10 mx-auto  min-h-[83vh] px-10">
        <h1 className="title text-2xl font-bold">BROWSE ALL NFT COLLECTIONS</h1>
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
