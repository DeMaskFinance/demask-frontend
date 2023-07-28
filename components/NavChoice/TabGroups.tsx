import { useState } from "react";

interface TabGroupProps {
  choices: string[];
  activeChoice: string;
  onChoiceChange: (choice: string) => void;
}

const TabGroups: React.FunctionComponent<TabGroupProps> = ({
  choices,
  activeChoice,
  onChoiceChange,
}) => {
  const handleButtonClick = (choice: string) => {
    onChoiceChange(choice);
  };

  return (
    <div className="flex text-base text-white bg-dark3 p-1 rounded-lg w-max items-center text-center">
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className={`py-2 px-6 rounded-lg text-sm ${
            activeChoice === choice ? "bg-secondary5" : ""
          }`}
          onClick={() => handleButtonClick(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default TabGroups;
