import { Button } from "@/components/Buttons";
import {
  BackIcon,
  EtherIcon,
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
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
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
          width={24}
          height={24}
          className="cursor-pointer hover:fill-dark2"
        />
      ),
      content: "Refresh",
      onClick: () => {
        router.refresh();
      },
    },
    {
      icon: <PoolIcon width={24} height={24} className="hover:fill-dark2" />,
      content: "Pool",
      link: `/add/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}`,
    },
    {
      icon: (
        <SettingIcon
          width={24}
          height={24}
          className="cursor-pointer hover:rotate-90 hover:fill-dark2"
        />
      ),
      content: "Setting",
      onClick: () => setIsOpenSetting(true),
    },
  ];
  return (
    <div className="mb-[100px] lg:mb-0 py-8 mx-auto swap lg:px-primary md:px-14 px-4">
      <div className="flex items-center mb-6 text-xl font-semibold gap-x-2 text-dark0">
        <div onClick={() => router.back()}>
          <BackIcon width={20} height={20} />
        </div>
        <div className="w-[32px] h-[32px] ">
          <Image
            alt="demask"
            width={32}
            height={32}
            src="/logoIcon.svg"
            className="object-cover rounded-lg"
          />
        </div>
        <p className="title">DEMASK</p>
      </div>
      <div className="max-w-[480px] h-fit flex gap-y-1 lg:gap-y-12 mx-auto">
        <div className="w-full p-6 bg-white border rounded-lg shadow-home dark:bg-darkBG1 dark:border-none">
          <div className="flex justify-between gap-4 mb-2 text-dark1">
            <div className="flex flex-col items-center ">
              <TabGroups
                choices={["Buy", "Sell"]}
                activeChoice={activeChoice}
                onChoiceChange={handleChoiceChange}
              />
            </div>
            <div className="flex items-center gap-x-2">
              {actions.map((action, index) => (
                <Tippy
                  key={index}
                  content={<div className="text-xs">{action.content}</div>}
                  theme="dark"
                  placement="bottom"
                >
                  {action.link ? (
                    <Link href={action.link} className="group">
                      {action.icon}
                    </Link>
                  ) : (
                    <div onClick={action.onClick}>{action.icon}</div>
                  )}
                </Tippy>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center my-6">
            <div className="mx-auto w-60 ">
              <Image
                alt="demask"
                width={240}
                height={240}
                src="/logoDefault.svg"
                className="object-cover rounded-xl"
              />
            </div>
          </div>
          <form className="mt-5">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  {account && activeChoice === "Buy" && (
                    <div className="flex items-center text-sm text-dark1">
                      <p className="mr-1">Your balance:</p>
                      {formatNumber(balanceToken)}
                      <EtherIcon
                        width={16}
                        height={16}
                        className="fill-dark2"
                      />
                    </div>
                  )}
                  {account && activeChoice === "Sell" && (
                    <div className="flex items-center text-sm text-dark1">
                      <p className="mr-1">Your balance:</p>
                      <p>0</p>
                      <NFTIcon
                        width={24}
                        height={24}
                        className="fill-dark1 ml-[2px]"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-dark1">
                  <div className="flex items-center mr-2">
                    <span className="mr-1">LP:</span>
                    0.0
                    <NFTIcon
                      width={24}
                      height={24}
                      className="fill-dark1 ml-[2px]"
                    />
                  </div>
                  0.0
                  <span>
                    <EtherIcon
                      width={20}
                      height={20}
                      className="fill-dark1 ml-[-1px]"
                    />
                  </span>
                </div>
              </div>
              <div
                className={`relative p-2 rounded-lg bg-dark5 border border-dark5 hover:border-dark3 dark:bg-darkBG2 dark:border-darkBG2`}
              >
                <div className="relative">
                  <NumericFormat
                    name="amountNFT"
                    id="amountNFT"
                    autoComplete="off"
                    placeholder="Input amount NFT"
                    pattern="^[1-9][0-9]*$"
                    min="1"
                    decimalScale={0}
                    thousandSeparator=","
                    className="w-1/2 text-sm font-semibold border-none outline-none text-dark2 bg-dark5 placeholder:text-dark2 placeholder:font-medium"
                    value={inputNFT}
                    onChange={(e) => {
                      let newValue = e.target.value.replace(/,/g, "");
                      setInputNFT(newValue);
                      setActiveChoiceNFT("");
                    }}
                  />
                  <Button
                    className="absolute px-4 py-2 font-semibold transition duration-150 ease-out rounded-lg cursor-pointer right-1 top-1 "
                    onClick={handleSearchNFT}
                    active
                    type="button"
                  >
                    <div className="text-center">
                      <h2 className="">Select NFT</h2>
                    </div>
                  </Button>
                </div>
                <div className="flex flex-col items-end">
                  <ul className="flex p-2 mt-8 rounded-lg bg-dark4 w-fit area_darkBG0">
                    {activeNFTPercent.map((item, index) => (
                      <li
                        className={`text-[12px] w-10 flex justify-center last:border-none border-r border-dark3 font-semibold text-dark3 ${
                          item.text === activeChoiceNFT &&
                          "bg-secondary5 text-white"
                        }`}
                        key={index}
                      >
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="justify-between block mb-4 lg:flex">
                <div className="text-sm text-dark1">Total Proceeds:</div>
                <div className="">
                  <label htmlFor="data.royaltyFee" className=" text-dark1">
                    <div className="flex text-sm">
                      <p className="mr-1">Royalties Fee: </p>
                      0.00
                      <p>(0.05%)</p>
                    </div>
                  </label>
                </div>
              </div>
              <div className="relative">
                <div className="block w-full py-2 pl-2 mb-2 font-semibold rounded-lg text-dark2 bg-dark4 dark:bg-darkBG2">
                  0.0
                </div>
                <div className="absolute px-2 py-1 right-1 top-2">
                  <EtherIcon width={16} height={16} className="fill-dark2" />
                </div>
              </div>
            </div>
          </form>
          <div className="flex justify-center w-full">
            {activeChoice === "BUY" && account && (
              <button
                type="button"
                className="py-2 w-[144px] bg-green hover:text-green hover:bg-white hover:border-green border rounded-lg text-sm text-white"
              >
                BUY NFT
              </button>
            )}
            {activeChoice === "SELL" && account && (
              <button
                type="button"
                className="py-2 w-[144px] bg-red rounded-lg text-sm text-white"
              >
                SELL NFT
              </button>
            )}

            {!account && (
              <Button className="w-[144px] py-2" primary onClick={handleOpen}>
                CONNECT WALLET
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
            setActiveChoiceNFT={setActiveChoiceNFT}
          />
          <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </div>
  );
}
