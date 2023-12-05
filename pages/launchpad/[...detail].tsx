import DetailLaunchPad from "@/components/LaunchPad/components/DetailLaunchPad";

import React from "react";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
export default function LauchPad() {
  const updateMeta = {
    ...SEO,
    title: "Detail Launchpad",
  };
  return (
    <section className="">
      <NextSeo {...updateMeta} />
      <div className="max-w-5xl py-8 mx-auto">
        <DetailLaunchPad />
      </div>
    </section>
  );
}
