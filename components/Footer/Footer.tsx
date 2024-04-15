import { version } from "@/libs/constants";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../Buttons";
import {
  DiscordIcon,
  EmailIcon,
  GithubIcon,
  TeleIcon,
  TwitterIcon,
} from "../Icons";
import { LogoDeMask } from "../Logo/Logo";
import useSvgComponents from "../Picture/Picture";
import { useTheme } from "next-themes";
const styles = {
  icon: "cursor-pointer fill-dark3 hover:fill-dark1 dark:fill-dark3 dark:hover:fill-dark5",
};
export default function Footer() {
  const svgComponents = useSvgComponents();
  const { theme, setTheme, systemTheme } = useTheme();
  const [activeChoice, setActiveChoice] = useState<string>("Light");
  const currentTheme = theme === "system" ? systemTheme : theme;
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
    if (
      (theme === "dark" && choice === "Dark") ||
      (theme === "light" && choice === "Light")
    ) {
      return;
    }
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  return (
    <footer className="justify-between hidden items-center px-4 pt-8 pb-10 overflow-hidden lg:flex 2xl:px-[140px] md:px-14 bg-white border-dark5 border-t">
      <div>
        <div className="flex gap-x-[120px]">
          <ul className="flex font-semibold gap-x-8 text-dark3">
            <li>
              <Link
                href="https://demask.finance/"
                target="_blank"
                className="text-dark1 dark:text-dark5"
              >
                About
              </Link>
            </li>
            <li className="transition-all duration-100 hover:text-dark2 whitespace-nowrap">
              <a
                href="https://demask.finance/media-kit"
                rel="noreferrer noopener"
                target="_blank"
              >
                Branding & Media Kit
              </a>
            </li>
            <li className="transition-all duration-100 hover:text-dark2">
              <a
                href="https://cryptoviet.info/he-sinh-thai-cryptoviet/demask"
                rel="noreferrer noopener"
                target="_blank"
              >
                Blog
              </a>
            </li>
            <li className="transition-all duration-100 hover:text-dark2">
              <a
                href="https://docsend.com/view/nuc8dre4e9vp55s7"
                rel="noreferrer noopener"
                target="_blank"
              >
                Pitch Desk
              </a>
            </li>
          </ul>
          <ul className="flex font-semibold gap-x-8 text-dark3">
            <li>
              <Link
                href="https://demask.finance/"
                target="_blank"
                className="text-dark1 dark:text-dark5"
              >
                Developer
              </Link>
            </li>
            <li className="transition-all duration-100 hover:text-dark2">
              <a
                href="https://github.com/DeMaskFinance"
                rel="noreferrer noopener"
                target="_blank"
              >
                Github
              </a>
            </li>
            <li className="transition-all duration-100 hover:text-dark2">
              <a
                href=" https://docs.demask.finance/"
                rel="noreferrer noopener"
                target="_blank"
              >
                Documentation
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center mt-8 gap-x-8">
          <div className="flex items-center p-1 text-base text-center text-white rounded-lg bg-dark3 dark:bg-dark1 w-max">
            <div
              className={`p-2 cursor-pointer rounded-lg text-sm flex gap-2 items-center ${
                activeChoice === "Light" ? "bg-secondary5" : ""
              }`}
              onClick={() => handleChoiceChange("Light")}
            >
              <svgComponents.buttonLight />
            </div>

            <div
              className={`p-2 cursor-pointer rounded-lg text-sm flex items-center gap-2 ${
                activeChoice === "Dark" ? "bg-dark0" : ""
              }`}
              onClick={() => handleChoiceChange("Dark")}
            >
              <svgComponents.buttonDark />
            </div>
          </div>
          <a href="mailto:contact@demask.finance">
            <Button
              active
              className="flex items-center h-full px-6 py-3 font-semibold transition-all duration-200 ease-in-out border gap-x-2 group"
            >
              <span>Contact Us</span>
              <span>
                <EmailIcon width={24} height={24} className="" />
              </span>
            </Button>
          </a>
        </div>
      </div>
      <div>
        <Link href="https://demask.finance/" target="_blank">
          <LogoDeMask
            width={245}
            height={56}
            className="fill-purple dark:fill-white"
          />
        </Link>
        <p className="text-xs font-semibold text-dark3">{version}</p>
        <div className="flex items-center mt-2 gap-x-4">
          <a
            href="https://twitter.com/DemaskFinance"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon width={20} height={20} className={styles.icon} />
          </a>
          <a
            href="https://t.me/DemaskFinance"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TeleIcon width={24} height={24} className={styles.icon} />
          </a>

          <a
            href="https://discord.com/invite/demaskfinance"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon width={24} height={24} className={styles.icon} />
          </a>
          <a
            href="https://github.com/DeMaskFinance"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon width={24} height={24} className={styles.icon} />
          </a>
        </div>
      </div>
    </footer>
  );
}
