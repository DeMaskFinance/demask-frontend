import { EtherIcon, LineRightIcon, SearchIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
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
    <div className="border-r border-shader_500">
      <div className="w-[350px]  text-white overflow-y-scroll h-[calc(100vh-200px)] sticky top-8">
        <div className="flex justify-between items-center sticky top-4 bg-shader_900 z-10 px-4 pb-3">
          <p className="text-primary_300 text-lg font-bold">Filters</p>
          <CgClose
            width={20}
            height={20}
            className="text-xl cursor-pointer"
            onClick={() => setIsFilter(false)}
          />
        </div>
        <div className="p-4">
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
                <div className="max-h-[300px] overflow-y-scroll">
                  <div className="p-3 flex justify-between font-semibold mb-1">
                    <div className="flex items-center gap-x-2">
                      <Image
                        src="/images/test.png"
                        alt="collection"
                        width={100}
                        height={100}
                        className="w-8 h-8 rounded-md"
                      />
                      <div>
                        <p className="title font-bold">Demask Collection</p>
                        <p className="text-shader_100">Balance:9,999</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-x-1">
                        <span className="title font-bold">123</span>
                        <span>
                          <EtherIcon width={16} height={16} />
                        </span>
                      </div>
                      <div className="flex text-shader_100 gap-x-1 items-center">
                        Floor:0.123
                        <EtherIcon width={16} height={16} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between font-semibold mb-1">
                    <div className="flex items-center gap-x-2">
                      <Image
                        src="/images/test.png"
                        alt="collection"
                        width={100}
                        height={100}
                        className="w-8 h-8 rounded-md"
                      />
                      <div>
                        <p className="title font-bold">Demask Collection</p>
                        <p className="text-shader_100">Balance:9,999</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-x-1">
                        <span className="title font-bold">123</span>
                        <span>
                          <EtherIcon width={16} height={16} />
                        </span>
                      </div>
                      <div className="flex text-shader_100 gap-x-1 items-center">
                        Floor:0.123
                        <EtherIcon width={16} height={16} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between font-semibold mb-1">
                    <div className="flex items-center gap-x-2">
                      <Image
                        src="/images/test.png"
                        alt="collection"
                        width={100}
                        height={100}
                        className="w-8 h-8 rounded-md"
                      />
                      <div>
                        <p className="title font-bold">Demask Collection</p>
                        <p className="text-shader_100">Balance:9,999</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-x-1">
                        <span className="title font-bold">123</span>
                        <span>
                          <EtherIcon width={16} height={16} />
                        </span>
                      </div>
                      <div className="flex text-shader_100 gap-x-1 items-center">
                        Floor:0.123
                        <EtherIcon width={16} height={16} />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between font-semibold mb-1">
                    <div className="flex items-center gap-x-2">
                      <Image
                        src="/images/test.png"
                        alt="collection"
                        width={100}
                        height={100}
                        className="w-8 h-8 rounded-md"
                      />
                      <div>
                        <p className="title font-bold">Demask Collection</p>
                        <p className="text-shader_100">Balance:9,999</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-x-1">
                        <span className="title font-bold">123</span>
                        <span>
                          <EtherIcon width={16} height={16} />
                        </span>
                      </div>
                      <div className="flex text-shader_100 gap-x-1 items-center">
                        Floor:0.123
                        <EtherIcon width={16} height={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Price</AccordionTrigger>
              <AccordionContent>
                <div className="flex gap-x-2 items-center">
                  <input placeholder="Min" className="input_item" />
                  <div className="w-5 h-5">
                    <LineRightIcon width={20} height={20} />
                  </div>
                  <input placeholder="Max" className="input_item" />
                </div>
                <Select>
                  <SelectTrigger className="w-full mt-2 bg-primary_500 bg-opacity-15 border-none text-white font-semibold "></SelectTrigger>
                  <SelectContent className="menu border-none w-[95%]">
                    <SelectGroup>
                      <SelectItem
                        value="eth"
                        className="item_menu text-white cursor-pointer"
                      >
                        ETH
                      </SelectItem>
                      <SelectItem
                        value="weth"
                        className="item_menu text-white cursor-pointer"
                      >
                        WETH
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FilterItems;
