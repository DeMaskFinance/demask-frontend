import { CgClose } from "react-icons/cg";
import { ToastContainer } from "react-toastify";
import Wrapper from "../Wrapper";

interface ModalTransationProps {
    isOpenTransation: boolean;
    setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
    isTransaction?: boolean;
}

const ModalTransation: React.FunctionComponent<ModalTransationProps> = ({ isOpenTransation, setIsOpenTransaction }) => {
    const handleClose = (e: any) => {
        e.preventDefault();
        document.body.style.overflowY = "auto";
        setIsOpenTransaction(false);
    };
    return (
        <Wrapper isOpen={isOpenTransation} onClick={handleClose} isTransaction>
            <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                <div className="bg-white h-fit w-[260px] md:w-[300px] lg:w-[350px] rounded-lg p-4 relative">
                    <p className="font-semibold text-md">Waiting for transaction</p>
                    <div className="mx-auto my-10 w-11 h-11 spinner">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <p className="text-sm text-center text-dark2">Your transaction being processed</p>
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

export default ModalTransation;