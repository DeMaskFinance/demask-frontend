import React, { useEffect, useRef, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
interface TabQueryProps {
  TABS: any[];
  initialItem: string;
  indexChoice: number;
}
const TabQuery: React.FC<TabQueryProps> = ({
  TABS,
  initialItem,
  indexChoice,
}) => {
  const [tab, setTab] = useQueryParam(
    "tab",
    withDefault(StringParam, initialItem)
  );
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>(
    Array(TABS.length).fill(null)
  );
  const [translateX, setTranslateX] = useState(0);
  const [widthBtn, setWidthBtn] = useState(0);
  const handleButtonClick = (item: any, index: number) => {
    setTab(item.key);
    setWidthBtn(buttonRefs.current[index]?.offsetWidth ?? 0);
    const totalWidth = buttonRefs.current
      .slice(0, index)
      .reduce((acc, ref) => (ref ? acc + ref.offsetWidth : acc), 0);
    setTranslateX(totalWidth);
  };
  useEffect(() => {
    if (buttonRefs.current && buttonRefs.current[indexChoice]) {
      // @ts-ignore
      setWidthBtn(buttonRefs.current[indexChoice].offsetWidth);
    }
    const totalWidth = buttonRefs.current
      .slice(0, indexChoice)
      .reduce((acc, ref) => (ref ? acc + (ref.offsetWidth || 0) : acc), 0);
    setTranslateX(totalWidth);
  }, [tab, TABS]);
  console.log(tab);

  return (
    <div className="relative flex items-center w-full p-1 text-base text-center text-white rounded-lg bg-shader_500 border_500">
      <div
        className={`absolute transition-transform duration-100 ease-linear rounded-[4px] h-9 ${
          tab === "buy"
            ? "bg-green"
            : tab === "sell"
            ? "bg-red"
            : "bg-primary_400"
        }`}
        style={{
          transform: `translateX(${translateX}px)`,
          width: `${widthBtn}px`,
        }}
      ></div>
      {TABS.map((item, index) => (
        <button
          key={index}
          ref={(el) => (buttonRefs.current[index] = el)}
          onClick={() => handleButtonClick(item, index)}
          className={`cursor-pointer py-2 w-1/2 z-10 text-sm font-bold ${
            item.key === tab ? "text-white" : "text-shader_100"
          }`}
        >
          <h2 className="font-semibold">{item.title}</h2>
        </button>
      ))}
    </div>
  );
};

export default TabQuery;
