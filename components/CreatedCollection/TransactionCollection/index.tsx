import { EtherIcon, RefetchIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import formatNumber from "@/libs/utils/formatNumer";
import { useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import Buy from "./Buy";
import Pool from "./Pool";
const TransactionCollection = () => {
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  

  return (
    <div className="flex flex-col h-full">
      <div className="items-center justify-between lg:flex">
        <div className="flex items-center mb-3 lg:mb-0 gap-x-8">
          <TabGroups
            choices={["Buy", "Sell", "Pool"]}
            activeChoice={activeChoice}
            onChoiceChange={handleChoiceChange}
          />
          <RefetchIcon
            width={24}
            height={24}
            className="cursor-pointer hover:fill-secondary5"
          />
        </div>
        <div className="flex gap-x-4">
          <div className="flex items-center text-sm text-dark1">
            <p className="mr-1">Send:</p>
            {formatNumber("123")}
            <EtherIcon width={16} height={16} className="ml-1 fill-dark2" />
          </div>
          <div className="flex items-center text-sm text-dark1">
            <p className="mr-1">Receive:</p>
            {formatNumber("123")}
            <span className="ml-1">NFTs</span>
          </div>
          <div className="flex items-center text-sm text-dark1">
            <p className="mr-1">Price:</p>
            {formatNumber("123")}
            <EtherIcon width={16} height={16} className="ml-1 fill-dark2" />
          </div>
        </div>
      </div>
      <div className="relative h-full">
        {activeChoice === "Buy" ? (
          <Buy/>
        ) : activeChoice === "Sell" ? (
          <div>Upcoming</div>
        ) : (
          <Pool />
        )}
      </div>
    </div>
  );
};

export default TransactionCollection;
