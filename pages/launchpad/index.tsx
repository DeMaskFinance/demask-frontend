import Head from "next/head";
import React from "react";
import { NextSeo } from "next-seo";
import { SEO } from '../../next-seo.config';
export default function Launchpad() {
  // const updateMeta = {
  //   ...SEO,
  //   title: 'Launchpad',
  //   description: 'Test',
  // };
  return (
    <section className="launchpad">
      {/* <Head>
        <title>Launchpad | DeMask</title>
      </Head> */}
      <NextSeo {...SEO} />
      <div className="w-full h-[100vh] m-auto flex items-center justify-center text-4xl text-dark1 font-medium">
        <p>Under construction</p>
      </div>
    </section>
  );
}
