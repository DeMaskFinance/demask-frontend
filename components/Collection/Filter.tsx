import { LineRightIcon } from "@/components/Icons";
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
import { useState } from "react";
import { CgClose } from "react-icons/cg";
import { Checkbox } from "../ui/checkbox";
interface FilterItemsProps {
  setIsFilter: React.Dispatch<React.SetStateAction<boolean>>;
}
interface CheckboxItemProps {
  id: string;
  label: string;
  count: string;
  shape: "circle" | "square";
}

const CheckboxStatus: React.FC<CheckboxItemProps> = ({
  id,
  label,
  count,
  shape = "circle",
}) => {
  return (
    <div className="flex items-center space-x-2 cursor-pointer font-semibold">
      <Checkbox id={id} shape={shape} />
      <label
        htmlFor={id}
        className="text-sm leading-none peer-disabled:opacity-70 flex w-full justify-between cursor-pointer"
      >
        <p>{label}</p>
        <p className="text-shader_200">{count}</p>
      </label>
    </div>
  );
};
const Filter: React.FC<FilterItemsProps> = ({ setIsFilter }) => {
  const [activeChoice, setActiveChoice] = useState<string>("All");
  const handleChoice = (item: string) => {
    setActiveChoice(item);
  };
  const items = [
    { id: "all", label: "All NFT", count: "2,000" },
    { id: "now", label: "Sell now", count: "2,000" },
    { id: "release", label: "New release", count: "4,144" },
  ];
  return (
    <div className="border-r border-shader_500">
      <div className="w-[350px]  text-white overflow-y-scroll h-[100vh] sticky top-8">
        <div className="flex justify-between items-center sticky top-4 bg-shader_900 z-10 px-4">
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
            defaultValue={["item-1", "item-2", "item-3"]}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Status</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-y-2">
                  {items.map((item) => (
                    <CheckboxStatus
                      key={item.id}
                      id={item.id}
                      label={item.label}
                      count={item.count}
                      shape="circle"
                    />
                  ))}
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
                  <SelectTrigger className="w-full mt-2 bg-primary_500 bg-opacity-15 border-none text-white font-semibold ">
                    <SelectValue placeholder="MON" defaultValue="eth" />
                  </SelectTrigger>
                  <SelectContent className="menu border-none w-[95%]">
                    <SelectGroup>
                      <SelectItem
                        value="eth"
                        className="item_menu text-white cursor-pointer"
                      >
                        MON
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
            <AccordionItem value="item-3">
              <AccordionTrigger className="pb-4">
                <div className="flex items-center justify-between w-full pr-2">
                  <p>Traits</p>
                  <p className="text-sm text-primary_300">Reset</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-0">
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-sm py-2">
                    <div className="flex items-center justify-between w-full pr-2 text-sm">
                      <p className="text-primary_400"> Background</p>
                      <p className="text-shader_200">10</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-y-2">
                      {items.map((item) => (
                        <CheckboxStatus
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          count={item.count}
                          shape="square"
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </AccordionContent>
              <AccordionContent className="px-2 pb-0">
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-sm py-2">
                    <div className="flex items-center justify-between w-full pr-2 text-sm">
                      <p className="text-primary_400"> Background</p>
                      <p className="text-shader_200">10</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-y-2">
                      {items.map((item) => (
                        <CheckboxStatus
                          key={item.id}
                          id={item.id}
                          label={item.label}
                          count={item.count}
                          shape="square"
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Filter;
