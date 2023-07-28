import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Icons from "@/public/icons/icon";
import { LogoDemask } from "../Logo";
import { TeleIcon, TwitterIcon } from "../Icons";
import { TabGroups } from "../NavChoice";
import useSvgComponents from "../Picture/Picture";
export default function Footer() {
  const svgComponents = useSvgComponents();

  const [activeChoice, setActiveChoice] = useState<string>("Light");

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <footer className="pt-8 pb-10 lg:px-primary md:px-14 px-4 bg-dark4 overflow-hidden">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
        <div className="lg:order-none md:order-none order-1">
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
        <div className="lg:order-none md:order-none order-3">
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
        <div className="lg:order-none md:order-none order-4">
          <h2 className="mb-2 text-lg font-medium leading-6">
            <Link href="/term">Developers</Link>
          </h2>
          <ul>
            <li className="mb-1 text-dark2">
              <a
                href="https://github.com/DeMaskFinance"
                rel="noreferrer noopener"
                target="_blank"
              >
                Github
              </a>
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
        <div className="lg:order-none md:order-none order-2 pl-[2%]">
          <div className="flex text-base text-white bg-dark3 p-1 rounded-lg w-max items-center text-center">
            <div
              className={`py-2 cursor-pointer px-6 rounded-lg text-sm flex gap-2 items-center ${
                activeChoice === "Light" ? "bg-secondary5" : ""
              }`}
              onClick={() => handleChoiceChange("Light")}
            >
              Light
              <svgComponents.buttonLight />
            </div>

            <div
              className={`py-2 cursor-pointer px-6 rounded-lg text-sm flex items-center gap-2 ${
                activeChoice === "Dark" ? "bg-dark0" : ""
              }`}
              onClick={() => handleChoiceChange("Dark")}
            >
              Dark
              <svgComponents.buttonDark />
            </div>
          </div>
          <div className="py-4">
            <h2 className="text-lg font-medium flex leading-6">
              <Link href="/">
                {/* <LogoDemask width={94} height={24} /> */}
                <Image
                  src={"/logoHeader.svg"}
                  alt=""
                  width={212}
                  height={54}
                ></Image>
              </Link>
            </h2>
            <p className="mt-2 text-dark2">contact@demask.finance</p>
          </div>
          <div className="flex gap-[18px]">
            <Link href="/">
              <TwitterIcon
                width={24}
                height={24}
                className="fill-dark3 hover:fill-secondary5"
              />
            </Link>
            <Link href="/">
              <TeleIcon
                width={24}
                height={24}
                className="fill-dark3 hover:fill-secondary5"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
