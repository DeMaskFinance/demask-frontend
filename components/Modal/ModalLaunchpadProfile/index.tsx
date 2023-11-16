import handleApproveToken from "@/libs/utils/handleApproveToken";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { BiLoaderAlt } from "react-icons/bi";
import { ModalTransation } from "../ModalTransation";
import handleLeaveLaunchPad from "@/libs/utils/handleLeaveLaunchpad";
import { useContext, useEffect } from "react";
import AccountContext from "@/context/AccountContext";
import { ToastContainer } from "react-toastify";

interface ModalLaunchPadProfileProps {
  isOpenTransation: boolean;
  setIsOpenTransaction: any;
  setIsOpenModal: any;
  amount: number;
  isOpenModal: any;
  setAmount: any;
  setAmountLeave: any;
  amountLeave: any;
  tokenLaunchpad: string;
  refetch: any;
}

const ModalLaunchPadProfile: React.FunctionComponent<
  ModalLaunchPadProfileProps
> = ({
  isOpenTransation,
  setIsOpenTransaction,
  setIsOpenModal,
  isOpenModal,
  amount,
  setAmount,
  setAmountLeave,
  amountLeave,
  tokenLaunchpad,
  refetch,
}) => {
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenModal(false);
  };
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);

  useEffect(() => {}, [isOpenTransation]);

  return (
    <Wrapper isOpen={isOpenModal} onClick={handleClose} isTransaction>
      <div className="relative z-50 flex flex-col justify-center bg-white cursor-default h-fit">
        <div className="bg-white h-fit w-[260px] md:w-[300px] lg:w-[350px] rounded-lg p-4 relative">
          <h3 className="pt-4 pb-8 text-xl text-center">Confirm leave</h3>
          <div className="h-32 p-2 mx-auto text-center border rounded-lg">
            <p>Amount leave</p>
            <div className="relative flex items-center justify-center gap-2 mx-auto w-fit">
              <input
                type="number"
                className="block w-2/4 py-2 mt-2 text-xl font-semibold text-center border rounded-md outline-none"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />

              <span
                className={`${
                  amount === amountLeave ? "text-gray-300" : "text-secondary5"
                }  text-sm absolute right-6 cursor-pointer`}
                onClick={() => {
                  setAmount(amountLeave);
                }}
              >
                Max
              </span>
            </div>
            {amount > parseInt(amountLeave) ||
              (amount.toString() === "" && (
                <small className="text-red">Maximum {amountLeave}</small>
              ))}
          </div>

          <div className="flex justify-center mt-4">
            <button
              disabled={
                amount > parseInt(amountLeave) || amount.toString() === ""
              }
              onClick={() => {
                handleLeaveLaunchPad(
                  account,
                  wallet,
                  amount,
                  tokenLaunchpad,
                  setIsOpenModal,
                  setIsOpenTransaction,
                  refetch
                );
              }}
              className="px-2 py-1 border rounded-md text-green border-green"
            >
              Confirm
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
      {/* <ModalTransation
        isOpenTransation={isOpenTransation}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      /> */}
      <ToastContainer />
    </Wrapper>
  );
};

export default ModalLaunchPadProfile;
