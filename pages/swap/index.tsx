import SwapDefault from "@/components/Swap/SwapDefault";
import { SEO } from "@/next-seo.config";
import { NextSeo } from "next-seo";

export default function Swap() {
  const updateMeta = {
    ...SEO,
    title: "Swap",
  };

  return (
    <div>
      <NextSeo {...updateMeta} />
      {/* <NextSeo
        title="Swap"
        description="Description about pages."
        canonical="https://dhanar98.hashnode.dev/"
        openGraph={{
          url: "https://dhanar98.hashnode.dev/",
          title: "Open Graph Title",
          description: "Open Graph Description",
          site_name: "Dhanar98",
          images: [
            {
              url: "https://assets.pancakeswap.finance/web/og/v2/hero.jpg", 
              width: 800, 
              height: 600, 
              alt: "Alternate Text", 
            },
          ],
        }}
        twitter={{
          handle: "@dhanar98",
          site: "@dhanar98",
          cardType: "summary_large_image",
        }}
      /> */}
      <SwapDefault />
    </div>
  );
}
