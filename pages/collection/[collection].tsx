import DetailCollection from "@/components/Collection";
import { SEO } from "../../next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Detail Collection",
};
const Collections = () => {
  return (
    <div>
      <NextSeo {...updateMeta} />
      <DetailCollection />
    </div>
  );
};

export default Collections;
