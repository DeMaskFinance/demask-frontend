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

      <div className="">
        <Launchpad />
      </div>
    </section>
  );
}
