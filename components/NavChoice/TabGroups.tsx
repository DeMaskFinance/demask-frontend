import { Fragment, useEffect, useRef, useState } from "react";

interface TabGroupProps {
  choices: string[];
  activeChoice: string;
  onChoiceChange: (choice: string) => void;
  isOverview?: boolean;
  isDefault?: boolean;
}

const TabGroups: React.FunctionComponent<TabGroupProps> = ({
  choices,
  activeChoice,
  onChoiceChange,
  isOverview,
  isDefault,
}) => {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>(
    Array(choices.length).fill(null)
  );
  const [translateX, setTranslateX] = useState(0);
  const [widthBtn, setWidthBtn] = useState(0);
  const [isInclude, setIsInclude] = useState<boolean>(false);
  const handleButtonClick = (choice: string, index: number) => {
    onChoiceChange(choice);
    setWidthBtn(buttonRefs.current[index]?.offsetWidth ?? 0);
    const totalWidth = buttonRefs.current
      .slice(0, index)
      .reduce((acc, ref) => (ref ? acc + ref.offsetWidth : acc), 0);
    setTranslateX(totalWidth);
  };
  useEffect(() => {
    if (buttonRefs.current.length > 0) {
      const activeIndex = choices.indexOf(activeChoice);
      const exists = choices.includes(activeChoice);
      setIsInclude(exists);

      const totalWidth = buttonRefs.current
        .slice(0, activeIndex)
        .reduce((acc, ref) => (ref ? acc + ref.offsetWidth : acc), 0);

      if (buttonRefs.current[activeIndex]) {
        setWidthBtn(buttonRefs.current[activeIndex]?.offsetWidth || 92);
      }

      setTranslateX(totalWidth);
    }
  }, [activeChoice, choices]);

  return (
    <Fragment>
      {isDefault ? (
        <div
          className={`flex relative items-center py-1 text-sm text-center text-white bg-shader_800`}
        >
          <div
            className={`absolute transition-transform duration-100 ease-linear border-b-[3px] border-primary_500 h-full bottom-0`}
            style={{
              transform: `translateX(${translateX}px)`,
              width: `${activeChoice ? widthBtn : 0}px`,
              background:
                "linear-gradient(180deg, rgba(144, 117, 254, 0) 0%, rgba(144, 117, 254, 0.15) 100%)",
            }}
          ></div>
          {choices.map((item, index) => (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[index] = el)}
              type="button"
              className={`cursor-pointer py-2 px-8 z-10 text-sm font-bold hover:text-white ${
                item === activeChoice ? "text-white" : "text-shader_100"
              }`}
              onClick={() => handleButtonClick(item, index)}
            >
              <h2 className="font-semibold whitespace-nowrap">{item}</h2>
            </button>
          ))}
        </div>
      ) : (
        <div
          className={`flex relative items-center p-1 text-sm text-center text-white h-10 rounded-lg bg-shader_600 border_500 w-full ${
            isOverview ? "lg:hidden" : ""
          }`}
        >
          <div
            className={`absolute transition-transform duration-100 ease-linear rounded-[4px] h-8 ${
              activeChoice === "Buy"
                ? "bg-green"
                : activeChoice === "Sell"
                ? "bg-red"
                : "bg-primary_500"
            }`}
            style={{
              transform: `translateX(${translateX}px)`,
              width: `${activeChoice && isInclude ? widthBtn : 0}px`,
            }}
          ></div>
          {choices.map((choice, index) => (
            <button
              key={choice}
              ref={(el) => (buttonRefs.current[index] = el)}
              type="button"
              className={`py-2 w-1/2 rounded-lg z-10 font-bold ${
                activeChoice === choice ? "text-white" : "text-shader_300"
              }`}
              onClick={() => handleButtonClick(choice, index)}
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default TabGroups;
