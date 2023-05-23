import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import Head from "next/head";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
