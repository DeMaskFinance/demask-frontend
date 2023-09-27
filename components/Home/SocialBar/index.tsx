import React from "react";
import InterestItem from "./InterestItem";
import Creators from "./Creators";
import Link from "next/link";

function SocialBar() {
  return (
    <div className="lg:w-[30%] md:w-[30%] w-full lg:block md:block hidden">
      <div className="sticky transition-all top-5">
        <InterestItem />
        <Creators />
        <div className="mt-4 ml-4 text-xs">
          <ul className="flex flex-wrap gap-x-[10px]">
            <span className="font-semibold text-dark2">© 2023 Demask</span>
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
                href="https://docs.demask.finance/audit"
                rel="noreferrer noopener"
                target="_blank"
              >
                Audits
              </a>
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
            <li className="mb-1 text-dark2">
              <p className="cursor-not-allowed">Careers</p>
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
                href="https://docs.demask.finance/audit"
                rel="noreferrer noopener"
                target="_blank"
              >
                Audits
              </a>
            </li>
            <li className="mb-1 text-dark2">
              <p className="cursor-not-allowed">Customer Support</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SocialBar;
