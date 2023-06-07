import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { PropsWithChildren } from "react";
export default function Layout({ children }:PropsWithChildren) {
  return (
    <div className="box-border w-full">
      <Header />
      <main className="mt-[64px]">{children}</main>
      <Footer />
    </div>
  );
}
