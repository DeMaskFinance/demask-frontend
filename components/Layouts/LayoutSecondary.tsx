import React from 'react'
import Header from '../Header/Header'
import { PropsWithChildren } from "react";
import { FooterSecondary } from '../Footer';
export default function LayoutSecondary({ children }:PropsWithChildren) {
  return (
    <div className="box-border w-full ">
      <Header />
      <main className="mt-[64px] px-primary">{children}</main>
      <FooterSecondary/>
    </div>
  )
}
