import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { BiLoaderAlt } from "react-icons/bi";

interface ModalTransationProps {
  isOpenTransation: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
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
    <Wrapper isOpen={isOpenTransation} onClick={handleClose}>
      <div className="container_modal ">
        <div className="h-fit w-[260px] md:w-[300px] lg:w-[450px] rounded-lg p-4 relative">
          <div className="flex justify-between">
            <p className="font-bold text-white">Waiting for transaction</p>
            <button onClick={handleClose}>
              <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
            </button>
          </div>
          <div className="h-[250px] justify-center items-center flex flex-col gap-y-12">
            <div className="flex items-center justify-center">
              <BiLoaderAlt className="text-6xl animate-spin text-primary_400" />
            </div>
            <p className="text-sm text-center text-shader_200">
              Your transaction being processed...
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ModalTransation;
