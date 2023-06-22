import {useState} from 'react'
interface TwoTabProps {
    firstChoice:string,
    secondChoice:string,
}
const styles = {
    btnActive: "rounded-lg bg-secondary5",
  };
  
const TwoTab: React.FunctionComponent<TwoTabProps> = ({firstChoice,secondChoice}) => {
    const [activeButton, setActiveButton] = useState<string>(firstChoice);
    const handleButtonClick = (choice: string) => {
        setActiveButton(choice);
      };
  return (
    <div className="grid h-[34px] grid-cols-2 rounded-lg w-[142px] mb-4 text-sm bg-dark2 text-white">
      <button
        type="button"
        className={activeButton === firstChoice ? styles.btnActive : ""}
        onClick={() => handleButtonClick(firstChoice)}
      >
        {firstChoice}
      </button>
      <button
        type="button"
        className={activeButton === secondChoice ? styles.btnActive : ""}
        onClick={() => handleButtonClick(secondChoice)}
      >
        {secondChoice}
      </button>
    </div>
  );
};

export default TwoTab;
