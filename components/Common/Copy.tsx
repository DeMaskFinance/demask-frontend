import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { CopyIcon } from "../Icons";

export default function Copy({ content }: { content: string }) {
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setIsCopy(true);
  };
  useEffect(() => {
    if (isCopy) {
      const timeoutId = setTimeout(() => {
        setIsCopy(false);
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [isCopy]);
  return (
    <div>
      <Tippy theme="dark" visible={isCopy} content={<span>Copied</span>}>
        <button onClick={copyToClipboard}>
          <CopyIcon width={16} height={16} className="text-primary_400" />
        </button>
      </Tippy>
    </div>
  );
}
