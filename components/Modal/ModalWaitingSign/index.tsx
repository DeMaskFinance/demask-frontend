import { LoadingIcon } from "@/components/Icons";
import { modal } from "@/pages/_app";
import { useDisconnect } from "@reown/appkit/react";
import { disconnect } from '@wagmi/core'


import React from "react";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";

const ModalWaitingSign: React.FC<any> = ({ isOpen, onClose }) => {
    const { disconnect } = useDisconnect()
    const walletInfo = modal.getWalletInfo();

    return (
        <Wrapper isOpen={isOpen}>
            <div className="container_modal">

                <button className="absolute top-2 z-10 right-2 text-white text-xl p-1 hover:bg-white/10 rounded-md hover:text-white/50 transition"
                    onClick={() => {
                        disconnect();
                        onClose();
                    }}
                >
                    <CgClose />
                </button>

                <div className="h-fit flex flex-col justify-center px-14 items-center w-full gap-6 my-3  rounded-lg p-6 relative">
                    <div>
                        <h2 className="text-xl text-center  font-semibold text-white">
                            Waiting for Signature
                        </h2>
                        {walletInfo?.icon && walletInfo?.name && <p className="text-center py-2"><img src={walletInfo?.icon} className="w-5 h-5 rounded-md inline-block mb-1" /> <span className="font-semibold text-md text-white">{walletInfo?.name} Wallet</span> </p>}
                        <p className="text-yellow">
                            Please check wallet for signature request
                        </p>

                    </div>

                    <LoadingIcon width={32} height={32} className="animate-spin" />
                </div>
            </div>
        </Wrapper >

    );
};

export default ModalWaitingSign;
