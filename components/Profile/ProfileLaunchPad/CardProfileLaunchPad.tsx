import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import { CountdownTime } from './CardLaunchpad';
import { getProvider } from '@/libs/connection/getProvider';
import AccountContext from '@/context/AccountContext';
import { ethers } from 'ethers';
import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { toast } from 'react-toastify';
import TransitionURL from '@/components/Toast/TransionURL';
import ModalAddAdminLaunchpad from '@/components/Modal/ModalLaunchpadProfile/ModalAddAdminLaunchpad';
import useLaunchpadInfor from '@/hooks/useLaunchpadInfor';
export default function CardProfileLaunchPad({ item }: any) {
    const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [addressUser, setAddressUser] = useState<string>("");
    const [amountLeave, setAmountLeave] = useState(0);
    const [tokenLaunchpad, setTokenLaunchpad] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { account, wallet, chainId, demask, tokenDefault } =
        useContext(AccountContext);
        console.log(item);
        console.log(item.launchpad);
        
    const {dml} = useLaunchpadInfor(account,item.launchpad,wallet,isOpenTransaction);
    console.log(dml);
    console.log(item);
    
    const handleTransaction = async (e: any, launchpadAddress: string, actionType: string, successMessage: string, errorMessage: string) => {
        e.preventDefault();
        console.log(launchpadAddress);

        if (account) {
            const providerChoice = getProvider(wallet);
            const provider = new ethers.providers.Web3Provider(providerChoice);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(launchpadAddress, abiLaunchPad, signer);

            try {
                const result = await contract[actionType]({
                    gasLimit: 8000000,
                });

                setIsOpenTransaction(true);
                const check = await provider.waitForTransaction(result.hash);
                setIsOpenTransaction(false);
                setIsOpen(false);

                if (check.status === 1) {
                    toast.success(
                        <TransitionURL
                            type={successMessage}
                            transactionHash={result.hash}
                        />,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        }
                    );
                } else {
                    toast.error(
                        <TransitionURL
                            type={errorMessage}
                            transactionHash={result.hash}
                        />,
                        {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        }
                    );
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setIsOpenTransaction(false);
            setIsOpen(true);
        }
    };

    const handleClaimDML = (e: any, launchpadAddress: string) => {
        handleTransaction(e, launchpadAddress, 'claimDml', 'Claim DML success', 'Claim DML failed');
    };

    const handleClaimReward = (e: any, launchpadAddress: string) => {
        handleTransaction(e, launchpadAddress, 'claimReward', 'Claim Reward success', 'Claim Reward failed');
    };

    const handleWithdraw = (e: any, launchpadAddress: string) => {
        handleTransaction(e, launchpadAddress, 'claimwithdraw', 'Claim withdraw success', 'Claim withdraw failed');
    };
    return (
        <div>
            <>
                {
                    <div className="relative max-w-sm overflow-hidden bg-gray-800 rounded-b-lg">
                        <Link
                            className="overflow-hidden transition-all h-52 group"
                            href={`launchpad/${item.nftID}/${process.env.NEXT_PUBLIC_CREATOR}/${item.tokenPayment}`}
                        >
                            <Image
                                className="relative z-0 object-cover w-full transition-all scale-105 h-52 group-hover:scale-110"
                                src={item.metadata?.image}
                                alt=""
                                width={600}
                                height={600}
                            />
                        </Link>
                        <div className="relative z-40 flex items-center justify-between px-5 pt-4 pb-2 overflow-hidden">
                            <Link
                                href={`launchpad/${item.nftID}/${process.env.NEXT_PUBLIC_CREATOR}/${item.tokenPayment}`}
                            >
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 hover:text-secondary5 dark:text-white">
                                    {item.metadata?.name}
                                </h5>
                            </Link>
                        </div>
                        <CountdownTime blockNumber={Number(item.durationLock) + Number(item.endTime)} setCurrentTime={setCurrentTime} />
                        <div className="flex justify-between px-5 pb-4">
                            <button
                                onClick={() => {
                                    setIsOpenModal(true);
                                    setTokenLaunchpad(item.launchpad);
                                }}
                                className={`
                         text-red border border-red hover:border-secondary5 hover:text-secondary5
                     px-2 py-1 rounded-lg transition-all`}
                            >
                                Add Admin
                            </button>
                            {Number(item.durationLock) + Number(item.endTime) < Number(currentTime) && (
                                <button
                                    onClick={(e) => {
                                        handleClaimDML(e, item.launchpad)
                                    }}
                                    className={`
                         text-red border border-red hover:border-secondary5 hover:text-secondary5
                     px-2 py-1 rounded-lg transition-all`}
                                >
                                    Claim DML
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between px-5 pb-4">
                            <button
                                onClick={(e) => {
                                    handleWithdraw(e, item.launchpad)
                                }}
                                className={`
                         text-red border border-red hover:border-secondary5 hover:text-secondary5
                     px-2 py-1 rounded-lg transition-all`}
                            >
                                Withdraw
                            </button>
                            <button
                                onClick={(e) => {
                                    handleClaimReward(e, item.launchpad)
                                }}
                                className={`
                         text-red border border-red hover:border-secondary5 hover:text-secondary5
                     px-2 py-1 rounded-lg transition-all`}
                            >
                                Claim Reward
                            </button>
                        </div>
                        {/* <span className="text-white absolute top-0 min-w-[32px] text-center text-sm block bg-secondary4 px-2 py-2 rounded-b-full">
                  {isRefetching ? (
                    <BiLoader className="animate-spin" />
                  ) : (
                    item.amount
                  )}
                </span> */}
                    </div>
                }
            </>
            <ModalAddAdminLaunchpad
                isOpenModal={isOpenModal}
                setIsOpenModal={setIsOpenModal}
                isOpenTransation={isOpenTransaction}
                setIsOpenTransaction={setIsOpenTransaction}
                tokenLaunchpad={tokenLaunchpad}
                action="addAdmin"
            />
        </div>
    )
}
