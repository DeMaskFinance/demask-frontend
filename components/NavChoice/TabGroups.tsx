
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
  const handleButtonClick = (choice: string) => {
    onChoiceChange(choice);
  };

  return (
    <div className={`flex items-center p-1 text-base text-center text-white rounded-lg bg-dark3 w-max ${isOverview ? 'lg:hidden' : ""}`}>
      {choices.map((choice) => (
        <button
          key={choice}
          type="button"
          className={`py-2 px-3 lg:px-6 rounded-lg text-sm ${activeChoice === "BUY" && activeChoice === choice
              ? "bg-green"
              : activeChoice === "SELL" && activeChoice === choice ? 'bg-red' : activeChoice === choice
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