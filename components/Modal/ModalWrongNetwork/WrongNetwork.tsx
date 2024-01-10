import React, { useContext, useEffect, useState } from 'react'
import Web3 from 'web3';
import { WarningIcon } from '../../Icons';
import Wrapper from '../Wrapper';
import { CgClose } from 'react-icons/cg';
import { getProvider } from '@/libs/connection/getProvider';
import AccountContext from '@/context/AccountContext';
import { changeNetwork } from '@/libs/utils/changeNetwork';
import { useSearchParams } from 'next/navigation';
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/profileSlice';

interface WrongNetworkProps {
}
const WrongNetwork: React.FC<WrongNetworkProps> = () => {
    const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
    const { account, wallet, chainId, demask, tokenDefault, updateAccount, updateChainId } = useContext(AccountContext);
    const [tab, setTab] = useQueryParam("chain", withDefault(StringParam, chainId));
    const router = useRouter();
    const { chain } = router.query;
    const dispatch = useDispatch();

    useEffect(() => {
        if (account && wallet && router.isReady && chain && wallet !== "WalletConnect") {
            const checkNetwork = async () => {
                const provider = await getProvider(wallet);
                const networkId = await provider.request({ method: "net_version" });
                console.log({
                    networkId,
                    chain
                });

                if (networkId !== chain) {
                    setIsWrongNetwork(true);
                    document.body.style.overflowY = "hidden";
                } else {
                    setIsWrongNetwork(false);
                    document.body.style.overflowY = "auto";
                }
            }
            checkNetwork();
        } else {
            setIsWrongNetwork(false);
        }
    }, [chain, account, wallet, router.isReady])

    const disconnectWallet = () => {
        localStorage.removeItem("ACCOUNT_DEMASK");
        // localStorage.removeItem("WALLET_DEMASK");
        updateAccount("");
        setIsWrongNetwork(false);
        dispatch(logout());
        document.body.style.overflowY = "auto";
    };

    const PORT = process.env.NEXT_PUBLIC_APP_PORT;
    return (
        <Wrapper isOpen={isWrongNetwork}>
            <div className="z-50 flex flex-col justify-center h-full">
                <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-6 relative">
                    <h2 className='text-xl font-semibold text-dark1'>Check your network</h2>
                    <h3 className='my-4 font-medium text-dark2'>Currently Demask only supported in {PORT === '3000' ? 'zkSync Testnet and Goerli Testnet' : 'BNB Smart Chain Testnet and Polygon Testnet'}</h3>
                    <h2 className='font-medium text-yellow'>Warning</h2>
                    <div className='flex my-4 gap-x-3'>
                        <WarningIcon />
                        <p className=' text-yellow'>Please switch your network to continue</p>
                    </div>
                    <div className='flex justify-between px-0 lg:px-6'>
                        <button className='p-2 text-sm font-medium text-white rounded-lg bg-secondary2' onClick={() => changeNetwork(chainId, wallet, demask, setIsWrongNetwork, updateChainId, setTab)}>Switch Network</button>
                        <button className='p-2 text-sm font-medium text-white rounded-lg bg-red' onClick={disconnectWallet}>Disconnect wallet</button>
                    </div>
                    <button
                        className="absolute top-0 right-0 p-2 text-lg"
                        onClick={disconnectWallet}
                    >
                        <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
                    </button>
                </div>
            </div>
        </Wrapper>
    )
}

export default WrongNetwork
