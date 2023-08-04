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
    <div className="flex items-center p-1 text-base text-center text-white rounded-lg bg-dark3 w-max">
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className={`py-2 px-6 rounded-lg text-sm ${
            activeChoice === "BUY" && activeChoice === choice
              ? "bg-green"
              : activeChoice === choice
              ? "bg-secondary5"
              : ""
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
