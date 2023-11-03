import Launchpad from "@/components/LaunchPad";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
export default function LaunchPad() {
  const updateMeta = {
    ...SEO,
    title: "Launchpad",
  };

  return (
    <section className="launchpad">
      <NextSeo {...updateMeta} />
      {/* <Launchpad /> */}
      <div className="min-h-[75vh]">
        Comming soon
      </div>
    </section>
  );
}
