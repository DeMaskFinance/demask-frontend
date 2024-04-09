import { Button } from "@/components/Buttons";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { WarningSwapIcon } from "@/components/Icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import AccountContext from "@/context/AccountContext";

interface ModalWarningRemoveProps {
    isOpenWarning: boolean;
}

const ModalWarningRemove: React.FunctionComponent<ModalWarningRemoveProps> = ({ isOpenWarning }) => {
    const router = useRouter();
    const { chainId } = useContext(AccountContext);
    const handleClose = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        document.body.style.overflowY = "auto";
        router.replace('/swap');
    };
    return (
        <Wrapper isOpen={isOpenWarning} onClick={handleClose}>
            <div className="container_modal">
                <div className="h-fit w-[320px] lg:w-[540px] rounded-lg p-8 relative">
                    <h2 className="flex items-center mb-4 text-xl font-semibold text-dark1">Notification</h2>
                    <div className="flex flex-col items-center my-6">
                        <WarningSwapIcon width={120} height={120} />
                        <p className="mt-6 font-normal text-center text-dark2">Due to a violation of out regulations, the NFT set is currently not tradable directly on the DeMask interface.</p>

                    </div>
                    <Link href={`/swap?chain=${chainId}`}>
                        <Button primary className="px-6 py-2 mx-auto">Return to Swap</Button>
                    </Link>
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

export default ModalWarningRemove;