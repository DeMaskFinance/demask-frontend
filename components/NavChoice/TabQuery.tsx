import React, { useEffect, useRef, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

const TabQuery: React.FC<TabQueryProps> = ({
  TABS,
  initialItem,
  indexChoice,
  isDefault,
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

  return (
    <>
      {isDefault ? (
        <div className="relative flex items-center w-full p-1 text-base text-center text-white rounded-lg bg-shader_500 border_500">
          <div
            className={`absolute transition-transform duration-100 ease-linear rounded-[4px] h-9 ${tab === "buy"
              ? "bg-green"
              : tab === "sell"
                ? "bg-red"
                : "bg-primary_500"
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
              className={`cursor-pointer py-2 w-1/2 z-10 text-sm font-bold ${item.key === tab ? "text-white" : "text-shader_100"
                }`}
            >
              <h2 className="font-semibold">{item.title}</h2>
            </button>
          ))}
        </div>
      ) : (
        <div
          className={`flex relative items-center py-1 text-sm text-center text-white bg-shader_800 w-full overflow-x-auto`}
        >
          <div
            className={`absolute transition-transform duration-100 ease-linear border-b-[3px] border-primary_500 h-full bottom-0`}
            style={{
              transform: `translateX(${translateX}px)`,
              width: `${tab ? widthBtn : 0}px`,
              background:
                "linear-gradient(180deg, rgba(144, 117, 254, 0) 0%, rgba(144, 117, 254, 0.15) 100%)",
            }}
          ></div>
          {TABS.map((item, index) => (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[index] = el)}
              type="button"
              className={`cursor-pointer py-2 px-8 z-10 text-sm font-bold hover:text-white ${item.key === tab ? "text-white" : "text-shader_100"
                }`}
              onClick={() => handleButtonClick(item, index)}
            >
              <h2 className="font-semibold">{item.title}</h2>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default TabQuery;
