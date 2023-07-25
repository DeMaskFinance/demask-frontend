import React from "react";
import Header from "../Header";
import { PropsWithChildren } from "react";
import { Footer } from "../Footer";
export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="box-border w-full ">
      <Header />
      <main className="mt-[64px] lg:px-primary md:px-14 px-4">{children}</main>
      <Footer />
    </div>
  );
}
