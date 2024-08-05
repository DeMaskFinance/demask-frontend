import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { CopyIcon } from "../Icons";

export default function Copy({
  content,
  title,
}: {
  content: string;
  title?: String;
}) {
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
    <div className="leading-[100%]">
      <Tippy theme="dark" visible={isCopy} content={<span>Copied</span>}>
        <button onClick={copyToClipboard} className="flex gap-x-2">
          <CopyIcon width={16} height={16} className="text-primary_400 " />
          {title}
        </button>
      </Tippy>
    </div>
  );
}
