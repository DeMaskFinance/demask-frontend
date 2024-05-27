import { useEffect, useRef, useState } from "react";

interface TabGroupProps {
  choices: string[];
  activeChoice: string;
  onChoiceChange: (choice: string) => void;
  isOverview?: boolean;
}

const TabGroups: React.FunctionComponent<TabGroupProps> = ({
  choices,
  activeChoice,
  onChoiceChange,
  isOverview,
}) => {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>(
    Array(choices.length).fill(null)
  );
  const [translateX, setTranslateX] = useState(0);
  const [widthBtn, setWidthBtn] = useState(0);
  const handleButtonClick = (choice: string, index: number) => {
    onChoiceChange(choice);
    setWidthBtn(buttonRefs.current[index]?.offsetWidth ?? 0);
    const totalWidth = buttonRefs.current
      .slice(0, index)
      .reduce((acc, ref) => (ref ? acc + ref.offsetWidth : acc), 0);
    setTranslateX(totalWidth);
  };
  useEffect(() => {
    if (buttonRefs.current[0]) {
      setWidthBtn(buttonRefs.current[0].offsetWidth);
    }
  }, []);
  console.log(activeChoice);

  return (
    <div
      className={`flex relative items-center p-1 text-sm text-center text-white rounded-lg bg-shader_600 dark:bg-shader_700 w-full ${
        isOverview ? "lg:hidden" : ""
      }`}
    >
      <div
        className={`absolute transition-transform duration-100 ease-linear rounded-lg h-9 ${
          activeChoice === "Buy"
            ? "bg-green"
            : activeChoice === "Sell"
            ? "bg-red"
            : "bg-primary_400"
        }`}
        style={{
          transform: `translateX(${translateX}px)`,
          width: `${widthBtn}px`,
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
  );
};

export default TabGroups;
