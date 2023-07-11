import { useState } from "react";
interface TwoTabProps {
  firstChoice: string;
  secondChoice: string;
  activeChoice: string;
  onChoiceChange: (choice: string) => void;
  mode?: string;
}
const styles = {
  btnActive: "rounded-lg bg-secondary5 px-2",
};

const TwoTab: React.FunctionComponent<TwoTabProps> = ({
  firstChoice,
  secondChoice,
  activeChoice,
  onChoiceChange,
  mode,
}) => {
  const handleButtonClick = (choice: string) => {
    onChoiceChange(choice);
  };
  return (
    <div className="flex h-[34px] rounded-lg w-auto text-sm bg-dark1 text-white">
      <button
        type="button"
        className={mode === firstChoice ? styles.btnActive : "px-2"}
        onClick={() => handleButtonClick(firstChoice)}
      >
        {firstChoice}
      </button>
      <button
        type="button"
        className={mode === secondChoice ? styles.btnActive : "px-2"}
        onClick={() => handleButtonClick(secondChoice)}
      >
        {secondChoice}
      </button>
    </div>
  );
};

export default TwoTab;
