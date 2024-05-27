import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { BiLoaderAlt } from "react-icons/bi";

interface ModalTransationProps {
  isOpenTransation: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  isTransaction?: boolean;
}

const ModalTransation: React.FunctionComponent<ModalTransationProps> = ({
  isOpenTransation,
  setIsOpenTransaction,
}) => {
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenTransaction(false);
  };
  return (
    <Wrapper isOpen={isOpenTransation} onClick={handleClose} isTransaction>
      <div className="container_modal">
        <div className="h-fit w-[260px] md:w-[300px] lg:w-[350px] rounded-lg p-4 relative">
          <p className="font-semibold text-md">Waiting for transaction</p>
          <div className="mx-auto my-10 w-11 h-11 ">
            <BiLoaderAlt className="mb-6 text-5xl animate-spin text-primary_400" />
          </div>
          <p className="text-sm text-center text-shader_600">
            Your transaction being processed
          </p>
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
};

export default ModalTransation;
