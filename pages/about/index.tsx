import Collectibles from "@/components/AboutPage/Collectibles";
import Features from "@/components/AboutPage/Features";
import Introduction from "@/components/AboutPage/Introduction";
import React from "react";
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
import Function from "@/components/AboutPage/Funtions";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
export default function About() {
  const updateMeta = {
    ...SEO,
    title: 'About',
  };
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  return (
    <>
      <NextSeo {...updateMeta} />
      <section className="max-w-screen-xl pb-32 mx-auto">
        <Introduction />
        <Function />
        <Features />
        <Collectibles />
      </section>
    </>
  );
}
