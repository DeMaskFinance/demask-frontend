import { Button } from "@/components/Buttons";
import {
  BgDefaultIcon,
  BgGradient,
  EtherIcon,
  ImgIcon,
  PoolIcon,
  RefetchIcon,
  SettingIcon,
} from "@/components/Icons";
import { ModalSearchCollectionSwap } from "@/components/Modal/ModalSearchCollection";
import ModalSetting from "@/components/Modal/ModalSetting";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { TabGroups } from "@/components/NavChoice";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { NumericFormat } from "react-number-format";
import Actions from "./Action";
export default function TradeDefault() {
  const router = useRouter();
  const { account, demask, slippage } = useContext(AccountContext);
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const [inputNFT, setInputNFT] = useState<string>("");
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("25%");
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const handleChoicePercent = (choice: string) => {
    setActiveChoiceNFT(choice);
  };
  return (
    <div className="relative px-4 h-[95vh] md:h-[88vh] flex flex-col mx-auto items-center justify-center overflow-hidden">
      <div className="absolute top-0 -translate-x-1/2 left-1/2 -z-10">
        <BgGradient className="w-[1000px] md:w-screen h-[350px]" />
      </div>
      <div className="md:w-[480px] w-full h-fit flex gap-y-1 lg:gap-y-12 mx-auto">
        <div className="relative w-full p-4 md:p-6 font-semibold border rounded-lg bg-shader_800 border-shader_600">
          <div className="flex justify-between gap-4">
            <p className="text-lg text-white">Demask Swaps</p>
            <Actions
              nftAddress={demask.CREATOR}
              tokenAddress={demask.NATIVE_ADDRESS}
              idNFT={demask.IDNFT}
              refetch={router.refresh}
            />
          </div>
          <div className="flex flex-col items-center my-4">
            <TabGroups
              choices={["Buy", "Sell"]}
              activeChoice={activeChoice}
              onChoiceChange={handleChoiceChange}
            />
          </div>
          <div className="flex flex-col justify-center my-4 rounded-lg bg-shader_700 h-[250px] md:h-[300px] border relative border-shader_600">
            <div className="absolute top-0 w-full overflow-hidden -translate-x-1/2 left-1/2">
              <BgGradient className="w-[514px] h-[176px]" />
            </div>
            <div className="mx-auto rounded-lg p-[10px] bg-primary_500 bg-opacity-10">
              <BgDefaultIcon width={87} height={87} />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="flex mx-auto mt-4 whitespace-nowrap gap-x-2"
                  green_2
                >
                  <ImgIcon width={20} height={20} />
                  Select
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl bg-shader_800 border border-shader_500 p-0">
                <ModalSearchCollectionSwap />
              </DialogContent>
            </Dialog>
          </div>
          <form className="text-sm text-shader_200">
            <div className="flex gap-x-2">
              <div className="relative">
                <NumericFormat
                  name="amountNFT"
                  id="amountNFT"
                  autoComplete="off"
                  placeholder="NFT quantity"
                  pattern="^[1-9][0-9]*$"
                  min="1"
                  decimalScale={0}
                  thousandSeparator=","
                  className="w-full h-full pl-2 font-semibold text-white rounded-lg outline-none bg-shader_600 placeholder:text-shader_300 placeholder:font-medium border_500"
                  value={inputNFT}
                  onChange={(e) => {
                    let newValue = e.target.value.replace(/,/g, "");
                    setInputNFT(newValue);
                    setActiveChoiceNFT("");
                  }}
                />
              </div>
              <div className="flex-1">
                <TabGroups
                  choices={["25%", "50%", "75%", "100%"]}
                  activeChoice={activeChoiceNFT}
                  onChoiceChange={handleChoicePercent}
                />
              </div>
            </div>
            <div className="mt-4">
              <div className="items-center justify-between  mb-4 flex">
                <p className="mr-1 text-xs font-normal">Slippage </p>
                <div className="flex text-sm text-primary_300">{slippage}%</div>
              </div>
              <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                <div className="">
                  {activeChoice === "Buy" ? "Total Pay" : "Total Receipts"}
                </div>
                <div className="flex items-center px-2 py-1 text-white gap-x-1">
                  0
                  <EtherIcon width={16} height={16} />
                </div>
              </div>
            </div>
          </form>
          <div className="flex justify-center w-full">
            {activeChoice === "Buy" && account && (
              <Button type="button" green className="py-2 w-full">
                Buy Now
              </Button>
            )}
            {activeChoice === "Sell" && account && (
              <Button type="button" red className="py-2 w-full">
                Sell Now
              </Button>
            )}

            {!account && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full py-2 font-semibold" gradient>
                    Connect Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[350px] p-0 border-none">
                  <ModalWallet />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
