import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { getProvider } from '@/libs/connection/getProvider';
import AccountContext from '@/context/AccountContext';
import { ethers } from 'ethers';
import abiLaunchPad from "@/abi/abiLaunchPad.json";
import { toast } from 'react-toastify';
import TransitionURL from '@/components/Toast/TransionURL';
import ModalAddAdminLaunchpad from '@/components/Modal/ModalLaunchpadProfile/ModalAddAdminLaunchpad';
import useLaunchpadInfor from '@/hooks/useLaunchpadInfor';
import CountdownTime from '@/components/Common/CountdownTime';
import { convertTime } from '@/hooks/useConvertTime';
import viewReward from '@/libs/utils/viewReward';
import divideByDecimal from '@/libs/utils/divideByDecimal';
import useBananceOfDML from '@/hooks/useBalanceOfDML';
import MediaNFT from '@/components/Common/MediaNFT';
export default function CardProfileLaunchPad({ item }: any) {
    const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [addressUser, setAddressUser] = useState<string>("");
    const [amountLeave, setAmountLeave] = useState(0);
    const [tokenLaunchpad, setTokenLaunchpad] = useState("");
    const [currentTimer, setCurrentTimer] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [blockNumberTimer, setBlockNumberTimer] = useState(0);
    const [blockNumberCurrent, setBlockNumberCurrent] = useState(0);
    const [reward, setReward] = useState("");
    const { account, wallet } =
        useContext(AccountContext);
    // const { dml, balance } = useLaunchpadInfor(account, '0xb826e94ccd8d0a6280dde44cd1049b208379e8f5', wallet, isOpenTransaction);
    // console.log(balance);
    const { balanceDML, balanceOfDML } = useBananceOfDML(item.launchpad, item.dmlAddress, wallet, isOpenTransaction);

    console.log({
        du: item.durationLock,
        end: item.endTime,
        name: item.metadata.name,
        item,
    });
    useEffect(() => {
        const fetchDataReward = async () => {
            if (account && wallet && item.dmlAddress !== '0x0000000000000000000000000000000000000000') {
                const result = await viewReward(item.dmlAddress, account, wallet);
                const rewardDec = divideByDecimal(result?.toString(), '18');
                setReward(rewardDec);
            }
        };
        fetchDataReward();
    }, [item.dmlAddress, account, wallet]);

    const timer = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        const reBase = Math.max(0, Number(item.durationLock) + Number(item.endTime) - currentTime);
        const countDownCurrentTime = Math.max(0, Number(item.durationLock) + Number(item.endTime) - currentTime);
        setBlockNumberTimer(reBase);
        setBlockNumberCurrent(countDownCurrentTime);
    };

    useEffect(() => {
        timer();
        const id = setInterval(timer, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        timer();
    }, []);

    const { days, hours, minutes, seconds } = convertTime(blockNumberTimer);
    const { days: daysCurrent, hours: hoursCurrent, minutes: minutesCurrent, seconds: secondsCurrent } = convertTime(blockNumberCurrent);
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
        handleTransaction(e, launchpadAddress, 'withdraw', 'Withdraw success', 'Withdraw failed');
    };
    return (
        <div>
            <>
                {
                    <div className="relative max-w-sm overflow-hidden bg-gray-800 rounded-lg min-h-[428px]">
                        <Link
                            className="overflow-hidden transition-all h-52 group"
                            href={`launchpad/${item.nftID}/${process.env.NEXT_PUBLIC_CREATOR}/${item.tokenPayment}`}
                        >
                            <MediaNFT data={item} isControls={false}/>
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
                        <CountdownTime blockNumber={Number(item.durationLock) + Number(item.endTime)} setCurrentTimer={setCurrentTimer} />
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
                            {days === 0 && hours === 0 && minutes === 0 && seconds === 0 && Number(balanceDML) > 0 && item.dmlAddress !== '0x0000000000000000000000000000000000000000' && (
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
                            {
                                item.dmlAddress !== '0x0000000000000000000000000000000000000000' && daysCurrent === 0 && hoursCurrent === 0 && minutesCurrent === 0 && secondsCurrent === 0 && item.totalSold >= item.softcap && (
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
                                )
                            }
                            {
                                item.dmlAddress !== '0x0000000000000000000000000000000000000000' && Number(reward) > 0 && (
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
                                )
                            }
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
