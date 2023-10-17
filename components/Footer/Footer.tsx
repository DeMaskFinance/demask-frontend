import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import Icons from "@/public/icons/icon";
import { TeleIcon, TwitterIcon } from "../Icons";
import { TabGroups } from "../NavChoice";
import useSvgComponents from "../Picture/Picture";
import { LogoDeMaskFooter } from "../Logo/Logo";
export default function Footer() {
  const svgComponents = useSvgComponents();

  const [activeChoice, setActiveChoice] = useState<string>("Light");

  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  return (
    <footer className="hidden px-4 pt-8 pb-10 overflow-hidden lg:block md:hidden lg:px-primary md:px-14 bg-dark4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 md:grid-cols-3">
        <div className="order-1 lg:order-none md:order-none">
          <h2 className="mb-2 text-lg font-medium leading-6">
            <Link href="/about">About</Link>
          </h2>
          <ul>
            <li className="mb-1 text-dark2">
            <a
                href="https://github.com/DeMaskFinance/demask_brand/tree/master"
                rel="noreferrer noopener"
                target="_blank"
              >
                Brand
              </a>
            </li>
            <li className="mb-1 text-dark2">
              <p className="cursor-not-allowed">Blog</p>
            </li>
            <li className="mb-1 text-dark2">
              <a
                href="https://docs.demask.finance/whitepaper"
                rel="noreferrer noopener"
                target="_blank"
              >
                Whitepaper
              </a>
            </li>
            <li className="mb-1 text-dark2">
              <p className="cursor-not-allowed">Term of Service</p>
            </li>
          </ul>
        </div>
        <div className="order-3 lg:order-none md:order-none">
          <h2 className="mb-2 text-lg font-medium leading-6">
            Help
          </h2>
          <ul>
            <li className="mb-1 text-dark2">
              <p className="cursor-not-allowed">Customer Support</p>
            </li>
            <li className="mb-1 text-dark2">
              <a
                href="https://docs.demask.finance/product"
                rel="noreferrer noopener"
                target="_blank"
              >
                Guilders
              </a>
            </li>
          </ul>
        </div>
        <div className="order-4 lg:order-none md:order-none">
          <h2 className="mb-2 text-lg font-medium leading-6">
            Developers
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
              <a
                href=" https://docs.demask.finance/"
                rel="noreferrer noopener"
                target="_blank"
              >
                Documentation
              </a>
            </li>
            <li className="mb-1 text-dark2">
              <a
                href="https://docs.demask.finance/welcome-to-demask-docs/roadmap"
                rel="noreferrer noopener"
                target="_blank"
              >
                Road Map
              </a>
            </li>
            <li className="mb-1 text-dark2">
              <a
                href="https://docs.demask.finance/audit"
                rel="noreferrer noopener"
                target="_blank"
              >
                Audits
              </a>
            </li>
            <li className="mb-1 text-dark2">
            <p className="cursor-not-allowed">Careers</p>
            </li>
          </ul>
        </div>
        <div className="lg:order-none md:order-none order-2 pl-[2%]">
          <div className="flex items-center p-1 text-base text-center text-white rounded-lg bg-dark3 w-max">
            <div
              className={`p-2 cursor-pointer rounded-lg text-sm flex gap-2 items-center ${activeChoice === "Light" ? "bg-secondary5" : ""
                }`}
              onClick={() => handleChoiceChange("Light")}
            >
              <svgComponents.buttonLight />
            </div>

            <div
              className={`p-2 cursor-pointer rounded-lg text-sm flex items-center gap-2 ${activeChoice === "Dark" ? "bg-dark0" : ""
                }`}
              onClick={() => handleChoiceChange("Dark")}
            >
              <svgComponents.buttonDark />
            </div>
          </div>
          <div className="py-4">
            <h2 className="flex text-lg font-medium leading-6">
              <Link href="/">
                <LogoDeMaskFooter width={212}
                  height={54} />
              </Link>
            </h2>
            <p className="mt-2 text-dark2">contact@demask.finance</p>
          </div>
          <div className="flex gap-[18px]">
            <a
              href="https://twitter.com/DemaskFinance"
              rel="noreferrer noopener"
              target="_blank"
            >
              <TwitterIcon
                width={24}
                height={24}
                className="fill-dark3 hover:fill-secondary5"
              />
            </a>
            <a
              href="https://t.me/DemaskFinance"
              rel="noreferrer noopener"
              target="_blank"
            >
              <TeleIcon
                width={24}
                height={24}
                className="fill-dark3 hover:fill-secondary5"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
