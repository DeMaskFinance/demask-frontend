import Collectibles from "@/components/AboutPage/Collectibles";
import Features from "@/components/AboutPage/Features";
import Introduction from "@/components/AboutPage/Introduction";
import Market from "@/components/AboutPage/Market";
import NFTTop from "@/components/AboutPage/NFTTop";
import React from "react";
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
export default function About() {
  const updateMeta = {
    ...SEO,
    title: 'About',
  };
  return (
    <>
      <NextSeo {...updateMeta} />
      <section className="max-w-screen-xl pb-32 mx-auto">
        <Introduction />
        <Market />
        <Features />
        <Collectibles />
        <NFTTop/>
      </section>
    </>
  );
}
