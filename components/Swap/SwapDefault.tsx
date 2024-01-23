import { Button } from '@/components/Buttons';
import { BackIcon, EtherIcon, NFTIcon, PoolIcon, RefetchIcon, SettingIcon } from '@/components/Icons';
import { ModalSearchNFTSwap } from '@/components/Modal/ModalSearchNFT';
import ModalSetting from '@/components/Modal/ModalSetting';
import { ModalWallet } from '@/components/Modal/ModalWallet';
import { TabGroups } from '@/components/NavChoice';
import AccountContext from '@/context/AccountContext';
import useInformationToken from '@/hooks/useInformationToken';
import { activeNFTPercent } from '@/libs/constants';
import formatNumber from '@/libs/utils/formatNumer';
import Tippy from '@tippyjs/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
export default function SwapDefault() {
    const router = useRouter();
    const { account, wallet, chainId, demask} = useContext(AccountContext);
    const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;
    const [activeChoice, setActiveChoice] = useState<string>("BUY");
    const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
    const [isOpenSetting, setIsOpenSetting] = useState<boolean>(false);
    const [inputNFT, setInputNFT] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>('');
    const { balanceToken} =
        useInformationToken(account, nativeAddress, wallet, routerAddress, rpc, nativeAddress);
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
        { icon: <RefetchIcon width={24} height={24} className="cursor-pointer hover:fill-secondary5" />, content: 'Refetch', onClick: () => { router.refresh() } },
        { icon: <PoolIcon width={24} height={24} className="group-hover:fill-secondary3" />, content: 'Pool', link: `/add/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}` },
        { icon: <SettingIcon width={24} height={24} className="cursor-pointer hover:rotate-90 hover:fill-secondary5" />, content: 'Setting', onClick: () => setIsOpenSetting(true) },
    ];
    return (
        <div className='mb-[100px] lg:mb-0 py-8 mx-auto max-w-screen-3xl swap'>
            <div className="flex items-center mb-6 text-xl font-semibold gap-x-2 text-dark0">
                <div onClick={() => router.back()}>
                    <BackIcon width={32} height={32} className="cursor-pointer hover:fill-secondary5" />
                </div>
                <div className="w-[32px] h-[32px] ">
                    <Image alt='demask' width={32} height={32} src='/logoIcon.png' className='object-cover rounded-lg'/>
                </div>
                <p>DEMASK</p>
            </div>
            <div className="max-w-[480px] h-fit flex gap-y-1 lg:gap-y-12 mx-auto">
                <div className="w-full p-6 border rounded-lg shadow-home">
                    <div className="flex justify-between gap-4 mb-2 text-dark1">
                        <div className="flex flex-col items-center ">
                            <TabGroups
                                choices={["BUY", "SELL"]}
                                activeChoice={activeChoice}
                                onChoiceChange={handleChoiceChange}
                            />
                        </div>
                        <div className="flex items-center gap-x-2">
                            {actions.map((action, index) => (
                                <Tippy key={index} content={<div className="text-xs">{action.content}</div>} theme='dark' placement="bottom">
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
                            <Image alt='demask' width={240} height={240} src='/logo.png' className='object-cover'/>
                        </div>
                        {/* <p
              className="mx-auto mt-1 text-xs cursor-pointer text-dark3 hover:text-secondary3"
              onClick={handleShowDetail}
            >
              Show detail
            </p> */}
                    </div>
                    <form className="mt-5">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    {account && activeChoice === "BUY" && (
                                        <div className="flex items-center text-sm text-dark1">
                                            <p className="mr-1">Your balance:</p>
                                            {formatNumber(balanceToken)}
                                            <EtherIcon width={16} height={16} className="fill-dark2" />
                                        </div>
                                    )}
                                    {account && activeChoice === "SELL" && (
                                        <div className="flex items-center text-sm text-dark1">
                                            <p className="mr-1">Your balance:</p>
                                            <p>0</p>
                                            <NFTIcon width={24} height={24} className="fill-dark1 ml-[2px]" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center text-sm text-dark1">
                                    <div className="flex items-center mr-2">
                                        <span className="mr-1">LP:</span>
                                        0.0
                                        <NFTIcon width={24} height={24} className="fill-dark1 ml-[2px]" />
                                    </div>
                                    0.0
                                    <span><EtherIcon width={20} height={20} className="fill-dark1 ml-[-1px]" /></span>
                                </div>
                            </div>
                            <div className={`relative p-2 border rounded-lg border-dark3`}>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="amountNFT"
                                        id="amountNFT"
                                        autoComplete="off"
                                        placeholder="Input amount NFT"
                                        pattern="^[1-9][0-9]*$"
                                        inputMode="numeric"
                                        onKeyDown={(event) => {
                                            if (!(event.key >= '0' && event.key <= '9') && event.key !== 'Backspace') {
                                                event.preventDefault();
                                            }
                                        }}
                                        min="1"
                                        className="text-sm font-semibold border-none outline-none lg:text-lg text-dark3 placeholder:font-semibold"
                                        value={inputNFT}
                                        onChange={(e) => {
                                            setInputNFT(e.target.value);
                                            setActiveChoiceNFT('');
                                        }}
                                    />
                                    <div
                                        className="absolute px-4 py-2 transition duration-150 ease-out bg-gradient-to-b from-[#BA8DE6] to-[#7B54E8] text-white border hover:bg-gradient-to-r hover:border-secondary5 hover:from-white active:bg-secondary3 active:text-white hover:text-secondary2 hover:bg-white rounded-lg cursor-pointer font-semibold right-1 top-1 border-secondary5 "
                                        onClick={handleSearchNFT}
                                    >
                                        <div className="text-center">
                                            <h2 className="">Select NFT</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-8">
                                    {activeNFTPercent.map((item, index) => (
                                        <button type="button" className={`ml-3 text-[12px] font-semibold text-dark3 p-1 border-dark3 border rounded-lg ${item.text === activeChoiceNFT && 'bg-secondary5 text-white'}`} key={index}

                                        >{item.text}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="justify-between block mb-4 lg:flex">
                                <div className="text-sm text-dark1">
                                    Total Proceeds:
                                </div>
                                <div className="">
                                    <label htmlFor="data.royaltyFee" className=' text-dark1'>
                                        <div className="flex text-sm">
                                            <p className="mr-1">Royalties Fee: </p>
                                            0.00
                                            <p>(0.05%)</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="relative">
                                <div className='block w-full py-2 pl-2 mb-2 border rounded-lg border-dark4 text-dark1 bg-dark4'>
                                    0.0
                                </div>
                                <div
                                    className="absolute px-2 py-1 right-1 top-2"
                                >
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

                        {
                            !account && (
                                <Button
                                    className="w-[144px] py-2"
                                    primary
                                    onClick={handleOpen}
                                >
                                    CONNECT WALLET
                                </Button>
                            )
                        }
                    </div>
                    <ModalSetting isOpenSetting={isOpenSetting} setIsOpenSetting={setIsOpenSetting} />
                    <ModalSearchNFTSwap
                        setIsOpenSearchNFT={setIsOpenSearchNFT}
                        isOpenSearchNFT={isOpenSearchNFT}
                        setActiveChoiceNFT={setActiveChoiceNFT}
                    />
                    <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
            </div>
        </div>
    )
}
