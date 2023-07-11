import Link from "next/link";
import React, { useState,useEffect } from "react";
import { LogoDemask } from "../Logo";
import { TeleIcon, TwitterIcon } from "../Icons";
import { TwoTab } from "../NavChoice";

export default function FooterSecondary() {
  const [mode,setMode] = useState<string>('');
  const [activeChoice, setActiveChoice] = useState<string>(mode);
  useEffect(() => {
    setMode(localStorage.getItem('MODE_DEMASK')||'');
  }, [activeChoice]);
  console.log(mode);
  const handleChoiceChange = (choice: string) => {
    localStorage.setItem("MODE_DEMASK", choice);
    window.dispatchEvent(new Event("storage"));
    setActiveChoice(choice);
  };
  console.log(activeChoice);
  
  
  return (
    <footer className="flex items-center gap-x-8 h-[66px] px-primary bg-dark4 fixed bottom-0 left-0 right-0 z-[100]">
      <div className="mr-2">
        <Link href="/">
          <LogoDemask width={94} height={24} />
        </Link>
      </div>
      <div className="flex gap-x-4">
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
      <div>
        <p className="font-medium text-dark2">Gas price: $0.001</p>
      </div>
      <div className="font-medium text-dark2">Light/Dark</div>
      <div>
        <TwoTab
          firstChoice="NEWFEEDS"
          secondChoice="REELS"
          activeChoice={activeChoice}
          onChoiceChange={handleChoiceChange}
          mode ={mode}
        />
      </div>
    </footer>
  );
}
