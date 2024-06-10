interface TabGroupProps {
  choices: string[];
  activeChoice: string;
  onChoiceChange: (choice: string) => void;
}
interface TabQueryProps {
  TABS: any[];
  initialItem: string;
  indexChoice: number;
  isDefault: boolean;
}
