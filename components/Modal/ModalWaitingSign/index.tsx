import React from "react";
import Wrapper from "../Wrapper";
import { LoadingIcon } from "@/components/Icons";
import { useDisconnect } from "@reown/appkit/react";
import { BiCloset } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

const ModalWaitingSign: React.FC<any> = ({ isOpen, onClose }) => {
    const { disconnect } = useDisconnect()

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
