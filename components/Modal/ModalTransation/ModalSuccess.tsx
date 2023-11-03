import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { SuccessIcon, URLTransactionIcon } from "@/components/Icons";
import { Button } from "@/components/Buttons";
import { useContext } from "react";
import AccountContext from "@/context/AccountContext";

interface ModalSuccessProps {
    isOpenSuccess: boolean;
    setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    type: string;
    transactionHash: string;
    isTransaction?: boolean;
}

const ModalSuccess: React.FunctionComponent<ModalSuccessProps> = ({ isOpenSuccess, setIsOpenSuccess, type, transactionHash }) => {
    const { demask } = useContext(AccountContext);
    const handleClose = (e: any) => {
        e.preventDefault();
        document.body.style.overflowY = "auto";
        setIsOpenSuccess(false);
    };
    return (
        <Wrapper isOpen={isOpenSuccess} onClick={handleClose} isTransaction>
            <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                <div className="bg-white h-fit w-[260px] md:w-[300px] lg:w-[350px] rounded-lg p-4 relative">
                    <h2 className="flex items-center mb-4 text-xl font-semibold text-dark1">{type}</h2>
                    <div className="flex flex-col items-center gap-y-2">
                        <SuccessIcon width={120} height={120} />
                        <p className="text-green font-semibold">Transaction Submitted</p>
                        <a href={`${demask.urltxHash}${transactionHash}`} target="_blank" className="flex text-sm items-center gap-x-1 hover:text-secondary5 group cursor-pointer">
                            <p>View on zkSync Era</p>
                            <p>
                                <URLTransactionIcon width={16} height={16} className="group-hover:fill-secondary5"/>
                            </p>
                        </a>
                        <Button primary className='p-2 mt-2'>Close</Button>
                    </div>
                </div>
                <button
                    className="absolute top-0 right-0 p-2 text-lg"
                    onClick={handleClose}
                >
                    <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
                </button>
            </div>
        </Wrapper>
    );
}

export default ModalSuccess;