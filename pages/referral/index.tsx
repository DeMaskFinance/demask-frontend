import { Button } from '@/components/Buttons';
import { ModalWallet } from '@/components/Modal/ModalWallet';
import AccountContext from '@/context/AccountContext';
import { getProvider } from '@/libs/connection/getProvider';
import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react'
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import abiReferral from "@/abi/abiReferral.json";
import { ModalError, ModalSuccess, ModalTransation } from '@/components/Modal/ModalTransation';
export default function Referral() {
    const [sponsor] = useQueryParam('sponsor', withDefault(StringParam, '0x4699A9A5607c9281103Ad504fA922276Eb6385A2'));
    const { account, wallet, demask } = useContext(AccountContext);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [messageError, setMessageError] = useState<string>('');
    const [sponsors, setSponsors] = useState<string>('');
    const [spender, setSpender] = useState<string>('');
    const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
    const [hash, setHash] = useState<string>('');
    const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
    const [isOpenError, setIsOpenError] = useState<boolean>(false);
    const handleOpen = () => {
        document.body.style.overflowY = "hidden";
        setIsOpen(true);
    };

    useEffect(() => {
        const getSponsor = async () => {
            if (account && wallet && sponsor) {
                const providerChoice = await getProvider(wallet);
                const provider = new ethers.providers.Web3Provider(providerChoice);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(demask.REFERRAL, abiReferral, signer);
                const result = await contract.getSponsor(account);
                const res = await contract.getSponsor(sponsor)
                setSponsors(result);
                setSpender(res);
            }
        }
        getSponsor();
    }, [account, wallet, isOpenTransaction])
    const handleSponsor = async () => {
        if (messageError === '') {
            const providerChoice = await getProvider(wallet);
            const provider = new ethers.providers.Web3Provider(providerChoice);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(demask.REFERRAL, abiReferral, signer);
            setIsOpenTransaction(true);
            const result = await contract.referee(sponsor);
            setHash(result.hash);
            const check = await provider.waitForTransaction(result.hash);
            setIsOpenTransaction(false);
            if (check.status === 1) {
                setIsOpenSuccess(true);
            } else {
                setIsOpenError(true);
            }
        }
    }
    useEffect(() => {
        if (sponsor === account) {
            setMessageError('Your account is a sponsor')
        } else if (sponsor === sponsors) {
            setMessageError("Sponsor is already exists")
        } else if (!sponsor) {
            setMessageError("Sponsor is needed")
        } else if (sponsors !== '0x0000000000000000000000000000000000000000') {
            setMessageError("Sponsor is already exists")
        } else if (spender.toLocaleLowerCase() === account.toLocaleLowerCase()) {
            setMessageError("You may not sponsor someone who has sponsored you")
        } else {
            setMessageError('');
        }
    }, [account, sponsors, sponsor, isOpenTransaction])
    return (
        <div className='min-h-[75vh] pt-5'>
            {account ? (
                <div><p>{sponsor}</p>
                    <div>
                        <Button primary className='p-2 my-3' onClick={handleSponsor} >Set sponsor</Button>
                        <p
                            className="text-xs text-red"
                            key="NFTbalance"
                        >
                            {messageError}
                        </p>
                    </div></div>
            ) : (
                <Button
                    className="w-[140px] py-2 block mx-auto"
                    primary
                    onClick={handleOpen}
                >
                    CONNECT WALLET
                </Button>
            )}
            <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
            <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
            <ModalSuccess isOpenSuccess={isOpenSuccess} transactionHash={hash} type="Set Sponsor Success" setIsOpenSuccess={setIsOpenSuccess} />
            <ModalError isOpenError={isOpenError} transactionHash={hash} type="Set Sponsor Failed" setIsOpenError={setIsOpenError} />
        </div>
    )
}
