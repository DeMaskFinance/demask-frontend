import { useEffect, useRef, useState } from "react";

interface TabGroupProps {
  choices: string[];
  activeChoice: string;
  onChoiceChange: (choice: string) => void;
}

const TabTable: React.FunctionComponent<TabGroupProps> = ({
  choices,
  activeChoice,
  onChoiceChange,
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
  // const isInclude = choices.includes(`${activeChoice}%`);
  // console.log(isInclude);

  return (
    <div
      className={`flex relative items-center py-1 text-sm text-center text-white`}
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
      {choices.map((choice, index) => (
        <button
          key={choice}
          ref={(el) => (buttonRefs.current[index] = el)}
          type="button"
          className={`py-3 px-9 rounded-lg z-10 font-bold ${
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

export default TabTable;
