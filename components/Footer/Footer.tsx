import Image from "next/image";
import Link from "next/link";
import React from "react";
import Icons from "@/public/icons/icon";
import { LogoDemask } from "../Logo";
import { TeleIcon, TwitterIcon } from "../Icons";
export default function Footer() {
  return (
    <footer className="pt-8 pb-10 px-primary bg-dark4 ">
      <div className="flex">
        <div className="flex basis-1/6">
          <div>
            <h2 className="mb-2 text-lg font-medium leading-6">
              <Link href="/about">About</Link>
            </h2>
            <ul>
              <li className="mb-1 text-dark2">
                <Link href="/brand">Brand</Link>
              </li>
              <li className="mb-1 text-dark2">
                <Link href="/blog">Blog</Link>
              </li>
              <li className="mb-1 text-dark2">
                <Link href="/whitepaper">Whitepaper</Link>
              </li>
              <li className="mb-1 text-dark2">
                <Link href="/term">Term of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="basis-1/6">
          <h2 className="mb-2 text-lg font-medium leading-6">
            <Link href="/brand">Help</Link>
          </h2>
          <ul>
            <li className="mb-1 text-dark2">
              <Link href="/support">Custumer Support</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/guilders">Guilders</Link>
            </li>
          </ul>
        </div>
        <div className="basis-1/6">
          <h2 className="mb-2 text-lg font-medium leading-6">
            <Link href="/term">Developers</Link>
          </h2>
          <ul>
            <li className="mb-1 text-dark2">
              <Link href="/term">Github</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/term">Documentation</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/bug">Bug Bounty</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/term">Audits</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/term">Careers</Link>
            </li>
          </ul>
        </div>
        <div className="basis-2/6"></div>
        <div className="basis-1/6 pl-[2%]">
          <div className="mb-2 text-lg font-medium leading-6">Dark/Light Mode</div>
          <div className="mt-8 mb-9">
            <h2 className="text-lg font-medium leading-6">
              <Link href="/">
                <LogoDemask width={212} height={54}/>
              </Link>
            </h2>
            <p className="mt-2 text-dark2">contact@demask.finance</p>
          </div>
          <div className="flex gap-[18px]">
            <Link href='/'>
              <TwitterIcon width={24} height={24} className="fill-dark3 hover:fill-secondary5"/>
            </Link>
            <Link href='/'>
            <TeleIcon width={24} height={24} className="fill-dark3 hover:fill-secondary5"/>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
