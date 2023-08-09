import Collectibles from "@/components/AboutPage/Collectibles";
import Features from "@/components/AboutPage/Features";
import Introduction from "@/components/AboutPage/Introduction";
import Market from "@/components/AboutPage/Market";
import { NFTTop } from "@/components/Home";
import Head from "next/head";
import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <>
      <Head>
        <title>About | DeMask</title>
      </Head>

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
