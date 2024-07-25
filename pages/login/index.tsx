// import { LoginSocials } from "@/components/LoginSocials";
import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  return <div>123</div>;
};

// Getting some weird styling (unrelated to Capsule) when using SSR on this page.
export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
