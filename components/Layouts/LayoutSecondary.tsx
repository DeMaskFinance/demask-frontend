import React from "react";
import Header from "../Header/Header";
import { PropsWithChildren } from "react";
import NavFooter from "../Footer/NavFooter";
import { Footer } from "../Footer";
export default function LayoutSecondary({ children }: PropsWithChildren) {
  return (
    <div className="box-border w-full ">
      <Header />
      <main className="mt-[104px] ">{children}</main>

      <Footer />
      <NavFooter />
    </div>
  );
}
