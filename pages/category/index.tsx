import CategoryType from "@/components/Categories/CategoryType";
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
const updateMeta = {
  ...SEO,
  title: 'Category',
};
export default function Categories() {
  return (
    <>
      <NextSeo {...updateMeta} />

      <div className="max-w-6xl pt-2 pb-16 mx-auto">
        <CategoryType label={"Art"} />
        <CategoryType label={"Gaming"} />
        <CategoryType label={"Film"} />
        <CategoryType label={"Music"} />
        <CategoryType label={"Memberships"} />
        <CategoryType label={"Others"} />
      </div>
    </>
  );
}
