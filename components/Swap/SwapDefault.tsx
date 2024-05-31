import { Button } from "@/components/Buttons";
import {
  BgDefaultIcon,
  BgGradient,
  EtherIcon,
  EyeIcon,
  ImgIcon,
  NFTIcon,
  PoolIcon,
  RefetchIcon,
  SettingIcon,
} from "@/components/Icons";
import { ModalSearchNFTSwap } from "@/components/Modal/ModalSearchNFT";
import ModalSetting from "@/components/Modal/ModalSetting";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import useInformationToken from "@/hooks/useInformationToken";
import { activeNFTPercent } from "@/libs/constants";
import formatNumber from "@/libs/utils/formatNumer";
import Tippy from "@tippyjs/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { NumericFormat } from "react-number-format";
export default function SwapDefault() {
  const router = useRouter();
  const { account, wallet, chainId, demask } = useContext(AccountContext);
  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const [activeChoice, setActiveChoice] = useState<string>("Buy");
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
  const [inputNFT, setInputNFT] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("25%");
  const { balanceToken } = useInformationToken(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress
  );
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const handleChoicePercent = (choice: string) => {
    setActiveChoiceNFT(choice);
  };
  const handleSearchNFT = () => {
    setIsOpenSearchNFT(true);
    document.body.style.overflowY = "hidden";
  };
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const actions = [
    {
      icon: (
        <RefetchIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Refresh",
      onClick: () => {
        router.refresh();
      },
    },
    {
      icon: (
        <PoolIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Pool",
      link: `/add/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}`,
    },
    {
      icon: (
        <SettingIcon
          width={18}
          height={18}
          className="cursor-pointer text-primary_200"
        />
      ),
      content: "Setting",
      onClick: () => setIsOpenSetting(true),
    },
  ];
  return (
    <div className="relative px-4 pt-24 pb-32 mx-auto lg:mb-0 swap lg:px-primary md:px-14">
      <div className="absolute top-0 -translate-x-1/2 left-1/2 -z-10">
        <BgGradient className="w-[1020px] h-[350px]" />
      </div>
      <div className="max-w-[480px] h-fit flex gap-y-1 lg:gap-y-12 mx-auto">
        <div className="relative w-full p-6 font-semibold border rounded-lg bg-shader_800 border-shader_600">
          <div className="flex justify-between gap-4 mb-2">
            <p className="text-xl text-white">Demask Swaps</p>
            <div className="flex items-center gap-x-2">
              {actions.map((action, index) => (
                <Tippy
                  key={index}
                  content={<div className="text-xs">{action.content}</div>}
                  theme="dark"
                  placement="bottom"
                >
                  <div className="border rounded-full border-shader_400 p-[7px]">
                    {action.link ? (
                      <Link href={action.link} className="group">
                        {action.icon}
                      </Link>
                    ) : (
                      <div onClick={action.onClick} className="">
                        {action.icon}
                      </div>
                    )}
                  </div>
                </Tippy>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center my-4">
            <TabGroups
              choices={["Buy", "Sell"]}
              activeChoice={activeChoice}
              onChoiceChange={handleChoiceChange}
            />
          </div>
          <div className="flex flex-col justify-center my-6 rounded-lg bg-shader_700 h-[300px] border relative border-shader_600">
            <div className="absolute top-0 w-full overflow-hidden -translate-x-1/2 left-1/2">
              <BgGradient className="w-[514px] h-[176px]" />
            </div>
            <div className="mx-auto rounded-lg p-[10px] bg-primary_500 bg-opacity-10">
              <BgDefaultIcon width={87} height={87} />
            </div>
            <Button
              className="flex mx-auto mt-4 whitespace-nowrap gap-x-2"
              green_2
              onClick={handleSearchNFT}
            >
              <ImgIcon width={20} height={20} />
              Select NFT
            </Button>
          </div>
          <form className="mt-5 text-sm text-shader_200">
            <div>
              <div className="flex gap-x-2">
                <div className="relative w-[60%]">
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
                <div className="w-[40%]">
                  <TabGroups
                    choices={["25%", "50%", "75%", "100%"]}
                    activeChoice={activeChoiceNFT}
                    onChoiceChange={handleChoicePercent}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="items-center justify-between block mb-4 lg:flex">
                <p className="mr-1 text-xs font-normal">Royalties Fee: </p>
                <div className="">
                  <label htmlFor="data.royaltyFee" className="">
                    <div className="flex text-sm">
                      0.00
                      <p>(0.05%)</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="relative flex items-center justify-between w-full py-2 pl-2 mb-2 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                <div className="">Total Pay</div>
                <div className="flex items-center px-2 py-1 text-white gap-x-1">
                  0
                  <EtherIcon width={16} height={16} />
                </div>
              </div>
            </div>
          </form>
          <div className="flex justify-center w-full">
            {activeChoice === "Buy" && account && (
              <Button type="button" green className="py-2 w-[144px]">
                Buy Now
              </Button>
            )}
            {activeChoice === "Sell" && account && (
              <Button type="button" red className="py-2 w-[144px]">
                Sell Now
              </Button>
            )}

            {!account && (
              <Button
                className="w-[144px] py-2 font-semibold"
                gradient
                onClick={handleOpen}
              >
                Connect Wallet
              </Button>
            )}
          </div>
          <ModalSetting
            isOpenSetting={isOpenSetting}
            setIsOpenSetting={setIsOpenSetting}
          />
          <ModalSearchNFTSwap
            setIsOpenSearchNFT={setIsOpenSearchNFT}
            isOpenSearchNFT={isOpenSearchNFT}
          />
          <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
