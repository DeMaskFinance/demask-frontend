import handleApproveToken from "@/libs/utils/handleApproveToken";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { BiLoaderAlt } from "react-icons/bi";
import { ModalTransation } from "../ModalTransation";
import { useEffect } from "react";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon } from "@/components/Icons";

interface ModalLaunchPadProps {
  isOpenTransation: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  inputNFT: number;
  handleBuyNFT: any;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenModal: boolean;
  data: LaunchpadData;
}

const ModalLaunchPad: React.FunctionComponent<ModalLaunchPadProps> = ({
  isOpenTransation,
  setIsOpenTransaction,
  setIsOpenModal,
  isOpenModal,
  inputNFT,
  handleBuyNFT,
  data,
}) => {
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenModal(false);
  };

  useEffect(() => {}, [isOpenTransation]);

  return (
    <Wrapper isOpen={isOpenModal} onClick={handleClose} isTransaction>
      <div className="container_modal">
        <div className="h-fit w-full md:w-[300px] lg:w-[350px] rounded-lg p-4 relative">
          <h3 className="pt-4 pb-8 text-xl text-center">
            Confirm buy launchpad
          </h3>
          <div className="flex flex-col justify-center h-32 p-2 mx-auto text-center border rounded-lg item-center">
            <p>Total buy</p>
            <div className="flex items-center justify-center py-4 text-xl font-semibold">
              <FormatNumber number={inputNFT.toString()} />
              <EtherIcon width={16} height={16} className="mb-1 fill-dark1" />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleBuyNFT}
              className="px-4 py-1 text-white rounded-md bg-green"
            >
              Buy
            </button>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
        </button>
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransation}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </Wrapper>
  );
};

export default ModalLaunchPad;
