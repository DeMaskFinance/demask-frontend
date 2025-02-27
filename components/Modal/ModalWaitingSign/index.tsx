import React from "react";
import Wrapper from "../Wrapper";
import { LoadingIcon } from "@/components/Icons";

const ModalWaitingSign: React.FC<any> = ({ isOpen }) => {

    return (
        <Wrapper isOpen={isOpen}>
            <div className="container_modal">
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
