import React, { useContext, useEffect } from 'react'
import Web3 from 'web3';
import { WarningIcon } from '../../Icons';
import Wrapper from '../Wrapper';
import { CgClose } from 'react-icons/cg';
import { getProvider } from '@/libs/connection/getProvider';
import AccountContext from '@/context/AccountContext';

interface WrongNetworkProps {
    isWrongNetwork: boolean
}
const WrongNetwork: React.FC<WrongNetworkProps> = ({ isWrongNetwork }) => {
    const { account, wallet, chainId, demask, tokenDefault,updateAccount} = useContext(AccountContext);
    const disconnectWallet = () => {
        localStorage.removeItem("ACCOUNT_DEMASK");
        // localStorage.removeItem("WALLET_DEMASK");
        updateAccount("");
      };
    const changeNetwork = async (chainId: string) => {
        try {
            const provider = getProvider("Metamask");
            const networkId = await provider.request({ method: "net_version" });
            if (networkId !== chainId) {
                try {
                    await provider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: Web3.utils.toHex(chainId) }],
                    });
                    // refresh
                    window.location.reload();
                } catch (errors: any) {
                    // This error code indicates that the chain has not been added to MetaMask
                    if (errors.code === 4902) {
                        await provider.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainName: "Mumbai",
                                    chainId: Web3.utils.toHex(chainId),
                                    nativeCurrency: {
                                        name: "MATIC",
                                        decimals: 18,
                                        symbol: "MATIC",
                                    },
                                    rpcUrls: ["https://polygon-mumbai-bor.publicnode.com"],
                                },
                            ],
                        });
                    }
                    else {
                        return false;
                    }
                }
            }
        } catch (error) {
            console.error("Failed to switch network:", error);
            return;
        }
        return true;
    };

    return (
        <Wrapper isOpen={isWrongNetwork}>
            <div className="z-50 flex flex-col justify-center h-full">
                <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-6 relative">
                    <h2 className='text-xl font-semibold text-dark1'>Check your network</h2>
                    <h3 className='my-4 font-medium text-dark2'>Currently Demask only supported in BNB Smart Chain Testnet, Polygon Testnet</h3>
                    <h2 className='font-medium text-yellow'>Warning</h2>
                    <div className='flex my-4 gap-x-3'>
                        <WarningIcon />
                        <p className=' text-yellow'>Please switch your network to continue</p>
                    </div>
                    <div className='flex justify-between px-0 lg:px-6'>
                        <button className='p-2 text-sm font-medium text-white rounded-lg bg-secondary2' onClick={() => changeNetwork(chainId)}>Switch Network</button>
                        <button className='p-2 text-sm font-medium text-white rounded-lg bg-red' onClick={disconnectWallet}>Disconnect wallet</button>
                    </div>
                    <button
                        className="absolute top-0 right-0 p-2 text-lg"
                    // onClick={handleClose}
                    >
                        <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
                    </button>
                </div>
            </div>
        </Wrapper>
    )
}

export default WrongNetwork
