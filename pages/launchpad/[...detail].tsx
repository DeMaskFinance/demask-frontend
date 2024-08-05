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
      <DetailLaunchPad />
    </section>
  );
}
