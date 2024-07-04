"use client";
import { version } from "@/lib/constants";
import Link from "next/link";
import {
  DemaskIcon,
  DemaskTitle,
  DiscordIcon,
  GithubIcon,
  GmailIcon,
  TeleIcon,
  TwitterIcon,
} from "../Icons";
const styles = {
  icon: "cursor-pointer",
};
export default function Footer() {
  const linksLeft = [
    { href: "#about", text: "About" },
    { href: "https://substack.com/@demaskfi/", text: "Blog" },
    { href: "https://docsend.com/view/nuc8dre4e9vp55s7", text: "Pitch Deck" },
  ];
  const linksRight = [
    { href: "https://demask.finance/", text: "Developer" },
    { href: "https://docs.demask.finance/", text: "Docs" },
    // { href: "/media-kit", text: "Branding & Media Kit" },
  ];
  const policy = [
    { href: "https://demask.finance/", text: "Terms" },
    { href: "https://demask.finance/", text: "Privacy Policy" },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-shader_600 bg-shader_900">
      <div className="md:flex items-center justify-between pt-8 pb-10  px-4 2xl:px-[150px] md:px-14 z-10 relative">
        <div className="flex justify-center items-center flex-col md:block">
          <div
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo(0, 0);
            }}
            className="flex items-center gap-x-3 cursor-pointer"
          >
            <DemaskIcon width={48} height={48} />
            <DemaskTitle width={148} height={26} />
          </div>
          <p className="text-xs font-semibold text-primary_400 mb-[20px]">
            {version}
          </p>
          <div className="flex items-center mt-2 gap-x-4">
            <a href="mailto:contact@demask.finance">
              <GmailIcon width={32} height={32} className={styles.icon} />
            </a>
            <a
              href="https://twitter.com/DemaskFinance"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TwitterIcon width={32} height={32} className={styles.icon} />
            </a>
            <a
              href="https://t.me/DemaskFinance"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TeleIcon width={32} height={32} className={styles.icon} />
            </a>

            <a
              href="https://discord.com/invite/demaskfinance"
              target="_blank"
              rel="noopener noreferrer"
            >
              <DiscordIcon width={32} height={32} className={styles.icon} />
            </a>
            <a
              href="https://github.com/DeMaskFinance"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon width={32} height={32} className={styles.icon} />
            </a>
          </div>
        </div>
        <ul className="grid grid-cols-2 text-center font-semibold text-white gap-x-8 mt-10 md:mt-0 text-base md:flex">
          <div className="flex md:flex-row flex-col gap-x-8 gap-y-2">
            {linksLeft.map((link, index) => (
              <li
                key={index}
                className="transition-all duration-100 hover:text-primary_500 whitespace-nowrap"
              >
                <a href={link.href} rel="noreferrer noopener">
                  {link.text}
                </a>
              </li>
            ))}
          </div>
          <div className="flex md:flex-row flex-col gap-x-8 gap-y-2">
            {linksRight.map((link, index) => (
              <li
                key={index}
                className="transition-all duration-100 hover:text-primary_500 whitespace-nowrap"
              >
                <a href={link.href} rel="noreferrer noopener" target="_blank">
                  {link.text}
                </a>
              </li>
            ))}

            <li className="transition-all duration-100 hover:text-primary_500 whitespace-nowrap">
              <Link href="/media-kit">Branding & Media Kit</Link>
            </li>
          </div>
        </ul>
      </div>
      <div className="flex md:flex-row flex-col items-center justify-between text-sm px-4 2xl:px-[150px] md:px-14 bg-shader_700 text-shader_200 py-4 font-semibold">
        <p>Copyright © 2024 Demask. All rights reserved.</p>
        <ul className="flex gap-x-4">
          {policy.map((link, index) => (
            <li
              key={index}
              className="transition-all duration-100 hover:text-primary_500 whitespace-nowrap"
            >
              <a href={link.href} rel="noreferrer noopener" target="_blank">
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
