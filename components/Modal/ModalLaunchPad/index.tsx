import handleApproveToken from "@/libs/utils/handleApproveToken";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { BiLoaderAlt } from "react-icons/bi";
import { ModalTransation } from "../ModalTransation";
import { useEffect } from "react";
import FormatNumber from "@/components/Common/FormatNumber";

interface ModalLaunchPadProps {
  isOpenTransation: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  account: string;
  wallet: string;
  tokenAddress: string;
  inputNFT: number;
  routerAddress: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCheckApproveToken: React.Dispatch<React.SetStateAction<boolean>>;
  checkApproveToken: boolean;
  nativeAddress: string;
  handleBuyNFT: any;
  isLoadingApprove: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenModal: boolean;
  refetch: any;
  data: LaunchpadData;
}

const ModalLaunchPad: React.FunctionComponent<ModalLaunchPadProps> = ({
  isOpenTransation,
  setIsOpenTransaction,
  setIsOpenModal,
  isOpenModal,
  account,
  wallet,
  tokenAddress,
  inputNFT,
  routerAddress,
  setIsOpen,
  checkApproveToken,
  handleBuyNFT,
  isLoadingApprove,
  refetch,
  data
}) => {
  const handleClose = (e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenModal(false);
  };

  useEffect(() => { }, [isOpenTransation]);

  return (
    <Wrapper isOpen={isOpenModal} onClick={handleClose} isTransaction>
      <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
        <div className="bg-white h-fit w-[260px] md:w-[300px] lg:w-[350px] rounded-lg p-4 relative">
          <h3 className="pt-4 pb-8 text-xl text-center">
            Confirm buy launchpad
          </h3>
          <div className="h-32 p-2 mx-auto text-center border rounded-lg">
            <p>Total buy</p>
            <div className="block py-4 text-xl font-semibold">
              <FormatNumber number={inputNFT.toString()} />
            </div>
            <p>Max buy : {data.purchaseLimit}</p>
          </div>

          <div className="flex justify-center mt-4">
            {isLoadingApprove ? (
              <div className="flex flex-col items-center justify-center gap-2 p-2 mb-2 font-light border-b rounded-xl">
                Please wait for a few second
                <BiLoaderAlt className="text-xl animate-spin text-secondary5" />
              </div>
            ) : (
              <>
                {checkApproveToken ? (
                  <button
                    onClick={handleBuyNFT}
                    className="px-4 py-1 text-white rounded-md bg-green"
                  >
                    Buy
                  </button>
                ) : (
                  <div className="flex flex-col">
                    <p className="mb-4 text-red">
                      You need approval before making a transaction
                    </p>
                    <button
                      onClick={() => {
                        handleApproveToken(
                          account,
                          wallet,
                          tokenAddress,
                          inputNFT * 1e18,
                          routerAddress,
                          setIsOpenModal,
                          setIsOpenTransaction
                        );
                      }}
                      className="px-4 py-1 text-white rounded-md bg-green"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </>
            )}
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
