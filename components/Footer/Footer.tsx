import { version } from "@/libs/constants";
import Link from "next/link";
import {
  BgGradient,
  DiscordIcon,
  GithubIcon,
  GmailIcon,
  TeleIcon,
  TwitterIcon,
} from "../Icons";
import { LogoDeMask } from "../Logo/Logo";
const styles = {
  icon: "cursor-pointer",
};
export default function Footer() {
  const links = [
    { href: "https://demask.finance/", text: "About" },
    { href: "https://demaskfi.substack.com/", text: "Blog" },
    { href: "https://docsend.com/view/nuc8dre4e9vp55s7", text: "Pitch Deck" },
    { href: "https://demask.finance/", text: "Developer" },
    { href: "https://docs.demask.finance/", text: "Docs" },
    { href: "https://demask.finance/media-kit", text: "Branding & Media Kit" },
  ];
  const policy = [
    { href: "https://demask.finance/", text: "Terms" },
    { href: "https://demask.finance/", text: "Privacy Policy" },
  ];
  return (
    <footer className="relative hidden overflow-hidden border-t lg:block border-shader_600 bg-shader_900">
      <div className="absolute top-0 -translate-x-1/2 left-1/2 -z-10">
        <BgGradient className="w-[905px] h-[218px]" />
      </div>
      <div className="flex items-center justify-between pt-8 pb-10  px-4 2xl:px-[150px] md:px-14 z-10 relative">
        <div>
          <Link href="https://demask.finance/" target="_blank">
            <LogoDeMask width={200} height={56} className="fill-white" />
          </Link>
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
        <div>
          <ul className="flex font-semibold text-white gap-x-8">
            {links.map((link, index) => (
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
      </div>
      <div className="flex justify-between text-sm px-4 2xl:px-[150px] md:px-14 bg-shader_700 text-shader_200 py-4 font-semibold">
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
