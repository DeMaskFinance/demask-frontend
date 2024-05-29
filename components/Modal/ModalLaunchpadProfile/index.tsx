import handleApproveToken from "@/libs/utils/handleApproveToken";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { BiLoaderAlt } from "react-icons/bi";
import { ModalTransation } from "../ModalTransation";
import handleLeaveLaunchPad from "@/libs/utils/handleLeaveLaunchpad";
import { useContext, useEffect } from "react";
import AccountContext from "@/context/AccountContext";
import { ToastContainer } from "react-toastify";
import { Button } from "@/components/Buttons";

interface ModalLaunchPadProfileProps {
  isOpenTransation: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  amount: number;
  isOpenModal: boolean;
  setAmount: any;
  setAmountLeave: any;
  amountLeave: number;
  tokenLaunchpad: string;
  refetch: any;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
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
  setIsOpenError,
  setIsOpenSuccess,
  setHash,
}) => {
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenModal(false);
  };
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);

  useEffect(() => {}, [isOpenTransation]);

  return (
    <Wrapper isOpen={isOpenModal} onClick={handleClose} isTransaction>
      <div className="container_modal">
        <div className="h-fit w-[260px] md:w-[300px] lg:w-[350px] p-4 relative rounded-lg">
          <h3 className="title_modal">Confirm refund</h3>
          <div className="h-32 p-2 mx-auto text-center">
            <p className="font-semibold text-shader_600">Amount refund</p>
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
                  amount === Number(amountLeave)
                    ? "text-gray-300"
                    : "text-primary_400"
                }  text-sm absolute right-6 cursor-pointer`}
                onClick={() => {
                  setAmount(amountLeave);
                }}
              >
                Max
              </span>
            </div>

            {amount > amountLeave ||
              (amount.toString() === "" && (
                <small className="text-red">Maximum {amountLeave}</small>
              ))}
            {amount.toString() === "0" && (
              <p className="mt-2 ml-2 text-xs text-red" key="inputAmount">
                Can't Refund
              </p>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <Button
              primary
              className="px-6 py-2"
              disabled={
                amount > amountLeave ||
                amount.toString() === "" ||
                amount.toString() === "0"
              }
              onClick={() => {
                handleLeaveLaunchPad(
                  account,
                  wallet,
                  amount,
                  tokenLaunchpad,
                  setIsOpenModal,
                  setIsOpenTransaction,
                  refetch,
                  setIsOpenError,
                  setIsOpenSuccess,
                  setHash
                );
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red text-white cursor-pointer" />
        </button>
      </div>
      {/* <ModalTransation
        isOpenTransation={isOpenTransation}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      /> */}
    </Wrapper>
  );
};

export default ModalLaunchPadProfile;
