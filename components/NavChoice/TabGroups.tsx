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
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>(Array(choices.length).fill(null));
  const [translateX, setTranslateX] = useState(0);
  const [widthBtn, setWidthBtn] = useState(0);
  const handleButtonClick = (choice: string,index:number) => {
    onChoiceChange(choice);
    // console.log('width', buttonRefs.current[index], buttonRefs.current[index] ? buttonRefs.current[index].offsetWidth : 0);
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
  return (
    <div className={`flex relative items-center p-1 text-base text-center text-white rounded-lg bg-dark3 w-max ${isOverview ? 'lg:hidden' : ""}`}>
      <div className="absolute transition-transform duration-100 ease-linear rounded-lg h-9 bg-secondary5" style={{ transform: `translateX(${translateX}px)`, width:`${widthBtn}px` }}>

      </div>
      {choices.map((choice,index) => (
        <button
          key={choice}
          ref={(el) => (buttonRefs.current[index] = el)}
          type="button"
          className={`py-2 px-3 lg:px-6 rounded-lg text-sm z-10 ""
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