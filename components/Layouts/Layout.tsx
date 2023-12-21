import React, { useContext, useEffect } from "react";
import Header from "../Header";
import { PropsWithChildren } from "react";
import { Footer } from "../Footer";
import NavFooter from "../Footer/NavFooter";
import AccountContext from "@/context/AccountContext";
import { useRouter } from "next/router";
export default function Layout({ children }: PropsWithChildren) {
  const { chainId, updateChainId } = useContext(AccountContext);
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      if (!router.query.chain) {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, chain: chainId },
        });
      } else {
        console.log("NOOO");
        updateChainId(router.query.chain);
      }
    }
    // updateChainId(router.query.chain);
  }, [chainId, router.asPath, router.isReady]);
  // useEffect(() => {
  //   if (router.query.chain) {
  //     updateChainId(router.query.chain);
  //   }
  // }, [router.query.chain]);

  return (
    <div className="box-border w-full overflow-hidden">
      <Header />
      <main className="mt-[64px] lg:px-primary md:px-14 px-4">{children}</main>
      <Footer />
      <NavFooter reels={false} />
    </div>
  );
}
