import { EtherIcon, SearchIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import Image from "next/image";
import React, { useContext, useState } from "react";

const TotalPools = () => {
  const { account, chainId } = useContext(AccountContext);
  const [activeChoice, setActiveChoice] = useState<string>("ERC-1155");
  const [type, setType] = useState<string>("erc1155");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
    choice === "ERC-1155" ? setType("erc1155") : setType("erc721");
  };
  return (
    <div className="rounded-lg bg-shader_800 flex flex-col overflow-hidden mb-8 min-h-[550px] max-h-[550px]">
      <TabGroups
        choices={["ERC-1155", "ERC-721"]}
        activeChoice={activeChoice}
        onChoiceChange={handleChoiceChange}
        isDefault
      />
      {/* || data?.pages[0]?.combinedRecords.length === 0 */}
      {!account ? (
        <div className="flex flex-col items-center justify-center flex-grow h-full text-sm font-semibold text-shader_200">
          <div className="flex items-center justify-center w-10 h-10 mb-1 border rounded-lg border-primary_500 bg-primary_500 bg-opacity-20">
            <SearchIcon width={20} height={20} className="text-primary_400" />
          </div>
          <p>Your active liquidity positions will appear here. </p>
          <a
            href="https://docs.demask.finance/products/dex/how-to-add-remove-lp"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary_400"
          >
            How to add Liquidity?
          </a>
        </div>
      ) : (
        <>
          <div className="overflow-auto text-sm ">
            <table className="w-full text-left border-collapse ">
              <thead className=" bg-shader_600 text-shader_200 uppercase sticky top-0 z-10">
                <tr className="flex px-4 py-3">
                  <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                    Name
                  </th>
                  <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                    TVL
                  </th>
                  <th className="flex justify-end lg:w-full md:w-full w-[140px]  items-center">
                    VOLUME(24H)
                  </th>
                  <th className="flex justify-end lg:w-full md:w-full w-[140px]  items-center">
                    FEES(24H)
                  </th>
                  <th className="flex items-center justify-end lg:w-full md:w-full w-[140px] ">
                    APR
                  </th>
                </tr>
              </thead>

              <tbody className="flex flex-col flex-auto text-base">
                {/* {isLoading || isFetching ? (
              <div className="w-full h-full flex-auto justify-center items-center flex">
                <LoadingIcon width={30} height={30} className="animate-spin" />
              </div>
            ) : (
              <Fragment>
                <TransactionItem data={data} isFetching={isFetching} />
              </Fragment>
            )} */}
                {Array.from({ length: 20 }, (_, index) => (
                  <tr className="flex px-4 py-3 text-white border-b border-shader_500 hover:bg-shader_700 cursor-pointer font-bold">
                    <th className="flex justify-start lg:w-full md:w-full w-[200px] gap-x-3 items-center">
                      <div className="relative w-[52px] ">
                        <EtherIcon width={32} height={32} />
                        <Image
                          src="/images/test.png"
                          width={32}
                          height={32}
                          alt="pool_img"
                          className="w-8 h-8 object-cover rounded-full absolute top-0 right-0"
                        />
                      </div>
                      <p className="font-semibold">ETH/MAYC</p>
                    </th>
                    <th className="flex justify-end lg:w-full md:w-full w-[140px] items-center gap-x-1">
                      241.2
                      <EtherIcon width={16} height={16} />
                    </th>
                    <th className="flex justify-end lg:w-full md:w-full w-[140px] items-center gap-x-1">
                      241.2
                      <EtherIcon width={16} height={16} />
                    </th>
                    <th className="flex justify-end lg:w-full md:w-full w-[140px] items-center gap-x-1">
                      241.2
                      <EtherIcon width={16} height={16} />
                    </th>
                    <th className="flex items-center justify-end lg:w-full md:w-full w-[140px] ">
                      2.34%
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* {isFetchingNextPage && (
            <div className="flex items-center justify-center w-full h-full grow">
              <LoadingIcon width={30} height={30} className=" animate-spin" />
            </div>
          )} */}
        </>
      )}
      {/* {isLoading && account && (
        <div className="flex items-center justify-center w-full h-full grow">
          <LoadingIcon width={30} height={30} className=" animate-spin" />
        </div>
      )} */}
    </div>
  );
};

export default TotalPools;
