import { SEO } from "../../next-seo.config";
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: "Mint NFTs",
};
const Collections = () => {
  return (
    <div>
      <NextSeo {...updateMeta} />
      <div>12Mint</div>
    </div>
  );
};

export default Collections;
