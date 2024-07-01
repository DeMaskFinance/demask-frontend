import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { ErrorIcon, URLTransactionIcon } from "@/components/Icons";
import { Button } from "@/components/Buttons";
import { useContext } from "react";
import AccountContext from "@/context/AccountContext";
import { useRouter } from "next/navigation";

interface ModalErrorProps {
  isOpenError: boolean;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  transactionHash: string;
}

const ModalError: React.FunctionComponent<ModalErrorProps> = ({
  isOpenError,
  setIsOpenError,
  type,
  transactionHash,
}) => {
  const { demask } = useContext(AccountContext);
  const router = useRouter();
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenError(false);
  };
  return (
    <Wrapper isOpen={isOpenError} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[260px] md:w-[300px] lg:w-[450px] rounded-lg p-4 relative">
          <div className="flex justify-between">
            <h2 className="title_modal">{type}</h2>
            <button className="" onClick={handleClose}>
              <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
            </button>
          </div>
          <div className="flex flex-col items-center h-[250px] justify-center">
            <ErrorIcon width={80} height={80} />
            <p className="mt-6 mb-2 font-bold text-red">Transaction Failed</p>
            <a
              href={`${demask.urltxHash}tx/${transactionHash}`}
              target="_blank"
              className="flex items-center text-xs cursor-pointer text-shader_600 gap-x-1 hover:text-primary_400 group"
            >
              <p className="text-shader_200">View on {demask.chainName}</p>
              <p>
                <URLTransactionIcon width={16} height={16} />
              </p>
            </a>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ModalError;
