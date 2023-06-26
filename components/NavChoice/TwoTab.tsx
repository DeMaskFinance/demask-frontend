import { useState } from "react";
interface TwoTabProps {
  firstChoice: string;
  secondChoice: string;
  activeChoice: string;
  onChoiceChange: (choice: string) => void;
}
const styles = {
  btnActive: "rounded-lg bg-secondary5",
};

const TwoTab: React.FunctionComponent<TwoTabProps> = ({
  firstChoice,
  secondChoice,
  activeChoice,
  onChoiceChange,
}) => {
  const handleButtonClick = (choice: string) => {
    onChoiceChange(choice);
  };
  return (
    <div className="grid h-[34px] grid-cols-2 rounded-lg w-[142px] mb-4 text-sm bg-dark2 text-white">
      <button
        type="button"
        className={activeChoice === firstChoice ? styles.btnActive : ""}
        onClick={() => handleButtonClick(firstChoice)}
      >
        {firstChoice}
      </button>
      <button
        type="button"
        className={activeChoice === secondChoice ? styles.btnActive : ""}
        onClick={() => handleButtonClick(secondChoice)}
      >
        {secondChoice}
      </button>
    </div>
  );
};

export default TwoTab;
