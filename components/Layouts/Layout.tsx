import React, { useContext, useEffect } from "react";
import Header from "../Header";
import { PropsWithChildren } from "react";
import { Footer } from "../Footer";
import NavFooter from "../Footer/NavFooter";
import AccountContext from "@/context/AccountContext";
import { useRouter } from "next/router";
export default function Layout({ children }: PropsWithChildren) {
  const { chainId } = useContext(AccountContext);
  const router = useRouter();
  useEffect(() => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, chain: chainId },
    });
  }, [chainId, router.asPath]);
 console.log(router);
 
  return (
    <div className="box-border w-full overflow-hidden">
      <Header />
      <main className="mt-[64px] lg:px-primary md:px-14 px-4">{children}</main>
      <Footer />
      <NavFooter reels={false} />
    </div>
  );
}
