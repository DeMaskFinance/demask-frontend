import React, { useContext, useEffect, useState } from 'react'
import { CgClose } from 'react-icons/cg';
import Wrapper from '../Wrapper';
import { ModalWallet } from '../ModalWallet';
import { ModalTransation } from '../ModalTransation';
import useLaunchpadInfor from '@/hooks/useLaunchpadInfor';
import AccountContext from '@/context/AccountContext';
import handleReleaseLaunchPad from '@/libs/utils/handleReleaseLaunchPad';
import { getProvider } from '@/libs/connection/getProvider';
import { ethers } from 'ethers';
import abiLaunchPad from "@/abi/abiLaunchPad.json";
import Web3 from 'web3';
interface ModalConfirmClaimProps {
    data: any,
    isOpenConfirmClaim: boolean;
    setIsOpenConfirmClaim: React.Dispatch<React.SetStateAction<boolean>>;
}
const ModalClaimLaunchpad: React.FunctionComponent<
    ModalConfirmClaimProps
> = ({
    data,
    isOpenConfirmClaim,
    setIsOpenConfirmClaim,
}) => {
        const web3 = new Web3;
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
        const { demask, tokenDefault, account, wallet, slippage, txDeadline } = useContext(AccountContext);
        const { release } = useLaunchpadInfor(account, data.launchpad, wallet, isOpenTransaction);
        const [gasFee, setGasFee] = useState<string>('');
        console.log(data);
        console.log(release.toString());

        const handleClose = (e: any) => {
            e.preventDefault();
            document.body.style.overflowY = "auto";
            setIsOpenConfirmClaim(false);
        };
        useEffect(() => {
            const getFeeGas = async () => {
                const providerChoice = getProvider(wallet);
                const provider = new ethers.providers.Web3Provider(providerChoice);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    data.launchpad,
                    abiLaunchPad,
                    signer
                );
                const gasLimit = 8000000;
                const result = await contract.estimateGas.balanceOf(account);;
                // var result = web3.eth.estimateGas({
                //     to: data.launchpad, 
                //     data: "0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000305472616e7366657248656c7065723a205452414e534645525f46524f4d5f4e46545f455243313135355f4641494c454400000000000000000000000000000000"
                //  });
                const gasUse = await provider.getGasPrice();
                const gasUseInEther = web3.utils.fromWei(gasUse.toString(), 'ether');
                const gasLimitEther = web3.utils.fromWei(result.toString(), 'ether');
                const test = web3.utils.fromWei((Number(gasUse) * Number(result)).toString(), 'ether');
                setGasFee(gasUse.toString());
                console.log({
                    result: result.toString(),
                    gasUse: gasUse.toString(),
                    gasUseETH: gasUseInEther,
                    gasLimitETH: gasLimitEther,
                    test: test.toString(),
                });

            }
            getFeeGas();
        }, [])
        console.log(gasFee);

        return (
            <Wrapper isOpen={isOpenConfirmClaim} onClick={handleClose}>
                <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                    <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
                        <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
                            Confirm claim
                        </p>
                        <p>
                            Amount: {Number(data.vesting) > 0 ? release.toString() : data.amount}
                        </p>
                        <p>
                            Fee Transaction: {gasFee}
                        </p>
                        <button
                            disabled={release.toString() === '0'}
                            className={`border ${release.toString() === '0'
                                ? "text-white  bg-dark4"
                                : "border-green bg-green hover:border-green hover:text-green hover:bg-white text-white"
                                } px-6 mx-auto mt-2 py-2 rounded-lg transition-all text-sm font-medium`}
                            onClick={() => {
                                handleReleaseLaunchPad(
                                    account,
                                    wallet,
                                    data.launchpad,
                                    setIsOpenConfirmClaim,
                                    setIsOpenTransaction
                                );
                            }}
                        >
                            Claim
                        </button>
                    </div>

                    <button
                        className="absolute top-0 right-0 p-2 text-lg"
                        onClick={handleClose}
                    >
                        <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
                    </button>
                </div>
                <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
                <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
            </Wrapper>
        )
    }

export default ModalClaimLaunchpad
