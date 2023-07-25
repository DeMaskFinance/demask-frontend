import Features from "@/components/AboutPage/Features";
import Introduction from "@/components/AboutPage/Introduction";
import Market from "@/components/AboutPage/Market";
import Head from "next/head";
import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <>
      <Head>
        <title>About | DeMask</title>
      </Head>

      <section className="pb-32">
        <Introduction />
        <Market />
        <Features />
      </section>
    </>
  );
}
