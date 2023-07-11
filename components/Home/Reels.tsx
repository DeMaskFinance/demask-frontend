import images from "@/public/images";
import Image from "next/image";
import { TwoTab } from "../NavChoice";
import { useContext, useState } from "react";
import AccountContext from "@/context/AccountContext";
import formatNumber from "@/libs/utils/formatNumer";
import { PoolIcon } from "../Icons";
import { Button } from "../Buttons";

interface ReelsProps {
  data: any,
}

const Reels: React.FunctionComponent<ReelsProps> = ({data}) => {
  const [activeChoice, setActiveChoice] = useState<string>("BUY");
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  console.log(data);
  
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const amountNFT = [
    {
      id: 1,
      value: "1",
    },
    {
      id: 2,
      value: "2",
    },
    {
      id: 3,
      value: "5",
    },
    {
      id: 4,
      value: "10",
    },
    {
      id: 5,
      value: "CUSTOM",
    },
  ];
  return (
    <div>
      <div className="flex gap-x-10">
        <div className="w-[50%] flex flex-col items-center">
          <Image
            src={images.testImg}
            alt="test"
            width={680}
            height={576}
            sizes="(max-width: 772px) 100vw"
            className="rounded-lg max-h-[772px] max-w-[772px]"
            unoptimized
          />
        </div>
        <div className="w-[50%]">
          <div className="px-4 py-6 border rounded-lg border-dark3">
            <div className="flex mb-3 text-dark1">
              <div className="flex basis-1/3">
                <TwoTab
                  firstChoice="BUY"
                  secondChoice="SELL"
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
                {/* {activeChoice === "BUY" && account && (
                  <div className="text-4xl text-secondary3">
                    {inputNFT ? (
                      <span>
                        {Number(
                          divideByDecimal(priceBuy.toString(), decimals)
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span>0</span>
                    )}
                    <span className="ml-2">{symbolToken}</span>
                  </div>
                )}
                {activeChoice === "SELL" && account && (
                  <div className="text-4xl text-secondary3">
                    {inputNFT ? (
                      <span>
                        {Number(
                          divideByDecimal(priceSell.toString(), decimals)
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span>0</span>
                    )}
                    <span className="ml-2">{symbolToken}</span>
                  </div>
                )} */}
              </div>
              <div className="basis-1/3">
                <div className="flex justify-center text-xl font-medium text-dark1">
                  <span>NFT1</span>
                </div>
                {/* {account && activeChoice === "BUY" && (
                  <p className="text-secondary3">100 ETH</p>
                )}
                {account && activeChoice === "SELL" && (
                  <p className="text-secondary3">200 ETH</p>
                )} */}
              </div>

              <div className=" basis-1/3">
                <a
                  href={`https://mumbai.polygonscan.com/address/${123}`}
                  target="_blank"
                  className="flex justify-end font-medium transition-all duration-150 ease-linear text-dark2 group"
                >
                  <PoolIcon
                    width={24}
                    height={24}
                    className="group-hover:fill-secondary3"
                  />
                  <p className="group-hover:text-secondary3">Pool</p>
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center mb-2 text-dark2">
              <div className="w-6 h-6 mr-2 bg-black rounded-full"></div>
              <p className="font-medium text-dark2">0x...n12c</p>
              <p className="-translate-y-[4px] mx-1">.</p>
              <p className="text-xs first-letter:uppercase">A month ago</p>
            </div>
            <div className="mb-4 font-light text-center text-dark2">
              On May 2nd 2023, artist Jeremy Cowart created his historic AURAS
              project, which which is now 10,000 completely unique NFT’s
              produced in 20 minutes start to finish without relying on
              generative code.
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-4xl text-secondary3">100 ETH</h3>
              <div className="flex mt-4 mb-4 font-normal text-secondary4 gap-x-8">
                <p>Balance nft:1000</p>
                <p>Balance token:1000</p>
              </div>
            </div>
            <div className="flex justify-center">
            {amountNFT.map((item, index) => (
              <Button
                key={index}
                className="p-2 ml-4 text-sm font-medium leading-normal text-dark3"
                type="button"
                outline
                active={selectedCategory.includes(item.value)}
                onClick={() => setSelectedCategory(item.value)}
              >
                {item.value}
              </Button>
            ))}
            </div>
            {/* <form className="grid grid-cols-2 gap-x-4">
              <div>
                {reserves && (
                  <p className="mb-4 text-dark3">
                    Reverse NFT:123
                  </p>
                )}
                <div className="relative">
                  <input
                    type="number"
                    name="amountNFT"
                    id="amountNFT"
                    placeholder="Input amount NFT"
                    className={
                      showRequiredMessage
                        ? "w-full py-2 pl-2 mb-4 rounded-lg border-2 border-red"
                        : styles.inputItem
                    }
                    value={inputNFT}
                    onChange={(e) => {
                      setInputNFT(e.target.value);
                      setShowRequiredMessage(false);
                    }}
                  />
                  <div
                    className="absolute px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                    onClick={handleSearchNFT}
                  >
                    {symbolNFT}
                  </div>
                </div>
                {dmlToken !== "0x0000000000000000000000000000000000000000" &&
                  !isSufficientNFT && (
                    <p
                      className="mb-2 ml-3 -mt-3 text-xs text-red"
                      key="NFTbalance"
                    >
                      Insufficient NFT balance
                    </p>
                  )}
                  {dmlToken !== "0x0000000000000000000000000000000000000000" &&
                  !isSufficientToken && (
                    <p
                      className="mb-2 ml-3 -mt-3 text-xs text-red"
                      key="Tokenbalance"
                    >
                      Insufficient Token balance
                    </p>
                  )}
                {dmlToken === "0x0000000000000000000000000000000000000000" && (
                  <p className="mb-2 ml-3 -mt-3 text-xs text-red">
                    DML Token doesn't exist yet
                  </p>
                )}
                {showRequiredMessage && (
                  <p
                    className="mb-2 ml-3 -mt-3 text-xs text-red"
                    key="emptyNFT"
                  >
                    Required
                  </p>
                )}
              </div>

              <div>
                {reserves && (
                  <p className="mb-4 text-dark3 text-end">
                    Reverse Token:
                    {formatNumber(
                      Number(
                        divideByDecimal(reserves[0].toString(), decimals)
                      ).toFixed(2)
                    )}
                  </p>
                )}
                <div className="relative">
                  {activeChoice === "BUY" ? (
                    <div className={styles.inputItem}>
                      {formatNumber(
                        divideByDecimal(amountBuy.toFixed(), decimals)
                      )}
                    </div>
                  ) : (
                    <div className={styles.inputItem}>
                      {formatNumber(
                        divideByDecimal(amountSell.toFixed(), decimals)
                      )}
                    </div>
                  )}
                  <div
                    className="absolute px-2 py-1 transition duration-150 ease-out bg-white border rounded-lg cursor-pointer hover:text-white hover:bg-secondary5 active:bg-secondary3 text-secondary5 right-1 top-1 border-secondary5 "
                    onClick={handleSearchToken}
                  >
                    {symbolToken}
                  </div>
                </div>
              </div>
            </form>
            <div className="flex justify-center w-full">
              {isApprovedToken && activeChoice === "BUY" && (
                <button
                  type="button"
                  className="py-2 w-[144px] bg-green rounded-lg text-sm text-white"
                  onClick={handleBuyNFT}
                >
                  BUY NFT
                </button>
              )}
              {isApprovedNFT && activeChoice === "SELL" && (
                <button
                  type="button"
                  className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
                  onClick={handleSellNFT}
                >
                  SELL NFT
                </button>
              )}
              {!isApprovedNFT && activeChoice === "SELL" && (
                <Button
                  className="w-[126px] py-2"
                  primary
                  onClick={hanldeApproveNFT}
                >
                  APPROVE NFT
                </Button>
              )}
              {!isApprovedToken &&
                tokenAddress !== "MATIC" &&
                activeChoice === "BUY" && (
                  <Button
                    className="w-[126px] py-2"
                    type="button"
                    primary
                    onClick={handleApproveToken}
                  >
                    APPROVE TOKEN
                  </Button>
                )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reels;
