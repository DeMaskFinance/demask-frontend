import { SearchIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { CgClose } from "react-icons/cg";
interface FilterItemsProps {
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
}
const FilterItems: React.FC<FilterItemsProps> = ({ setIsFilter }) => {
  const [activeChoice, setActiveChoice] = useState<string>("All");
  const handleChoice = (item: string) => {
    setActiveChoice(item);
  };
  return (
    <div className="w-[350px] p-4 text-white">
      <div className="flex justify-between items-center">
        <p className="text-primary_300 text-lg font-bold">Filters</p>
        <CgClose
          width={20}
          height={20}
          className="text-xl cursor-pointer"
          onClick={() => setIsFilter(false)}
        />
      </div>
      <div className="">
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={["item-1", "item-2"]}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>Collections</AccordionTrigger>
            <AccordionContent>
              <div className="flex  rounded-lg bg-shader_600 border-shader_700 px-3 h-10 mb-2">
                <div className="flex items-center justify-center  h-full mr-2">
                  <SearchIcon width={20} height={20} className="text-white" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name"
                  // onChange={(e) => {
                  //   setSearchCollection(e.target.value);
                  // }}
                  className="relative w-full text-white transition-all bg-transparent outline-none placeholder:text-shader_300"
                />
              </div>
              <TabGroups
                choices={["All", "ERC-721", "ERC-1155"]}
                activeChoice={activeChoice}
                onChoiceChange={handleChoice}
                isDefault
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Price</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other
              components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterItems;
