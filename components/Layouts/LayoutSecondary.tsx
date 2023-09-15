import React from "react";
import Header from "../Header/Header";
import { PropsWithChildren } from "react";
import { FooterSecondary } from "../Footer";
import NavFooter from "../Footer/NavFooter";
export default function LayoutSecondary({ children }: PropsWithChildren) {
  return (
    <div className="box-border w-full ">
      <Header />
      <main className="mt-[64px] ">{children}</main>

      <FooterSecondary />
      <NavFooter reels={true} />
    </div>
  );
}
