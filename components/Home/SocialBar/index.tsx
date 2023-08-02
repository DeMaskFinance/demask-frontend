import React from "react";
import InterestItem from "./InterestItem";
import Creators from "./Creators";
import Link from "next/link";

function SocialBar() {
  return (
    <div className="lg:w-[30%] md:w-[30%] w-full">
      <div className="sticky transition-all top-5">
        <InterestItem />
        <Creators />
        <div className="mt-4 ml-4 text-xs">
          <ul className="flex flex-wrap gap-x-[10px]">
            <span className="font-semibold text-dark2">© 2023 Demask</span>
            <li className="mb-1 text-dark2">
              <Link href="/brand">Brand</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/blog">Blog</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/term">Audits</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/whitepaper">Whitepaper</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/term">Term of Service</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/term">Careers</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/guilders">Guilders</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/term">Documentation</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/bug">Bug Bounty</Link>
            </li>
            <li className="mb-1 text-dark2">
              <Link href="/support">Custumer Support</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SocialBar;
