import { Creator } from "@/components/Create";
import { SEO } from "../../next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Create",
};
const Create = () => {
  return (
    <div>
      <NextSeo {...updateMeta} />
      <Creator />
    </div>
  );
};

export default Create;
