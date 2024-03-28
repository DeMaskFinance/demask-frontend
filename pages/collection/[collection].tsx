import CreatedCollection from "@/components/CreatedCollection";
import { SEO } from '../../next-seo.config';
import { NextSeo } from "next-seo";
const updateMeta = {
  ...SEO,
  title: 'Detail Collection',
};
const Collections = () => {
  return (
    <div>
      <NextSeo {...updateMeta} />
      <CreatedCollection />
    </div>
  );
};

export default Collections;
