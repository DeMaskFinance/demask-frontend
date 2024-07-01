import AccountContext from "@/context/AccountContext";
import useLaunchpadInfor from "@/hooks/useLaunchpadInfor";
import handleReleaseLaunchPad from "@/libs/utils/handleReleaseLaunchPad";
import React, { useContext, useState } from "react";
import { CgClose } from "react-icons/cg";
import Web3 from "web3";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalConfirmClaimProps {
  data: LaunchpadData;
  isOpenConfirmClaim: boolean;
  setIsOpenConfirmClaim: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}
const ModalClaimLaunchpad: React.FunctionComponent<ModalConfirmClaimProps> = ({
  data,
  isOpenConfirmClaim,
  setIsOpenConfirmClaim,
  setIsOpenError,
  setIsOpenSuccess,
  setHash,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const { demask, tokenDefault, account, wallet, slippage, txDeadline } =
    useContext(AccountContext);
  const { release } = useLaunchpadInfor(
    account,
    data.launchpad,
    wallet,
    isOpenTransaction
  );

  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenConfirmClaim(false);
  };

  return (
    <Wrapper isOpen={isOpenConfirmClaim} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <p className="title_modal">Confirm claim</p>
          <div className="flex flex-col items-center">
            <div>
              <p className="font-semibold text-shader_600">Amount</p>
              <p className="text-xl text-center text-shader_500">
                {Number(data.vesting) > 0 ? release.toString() : data.amount}
              </p>
            </div>
            {/* <p>
                                Fee Transaction: {gasFee}
                            </p> */}
            <button
              disabled={release.toString() === "0"}
              className={`border ${
                release.toString() === "0"
                  ? "text-white  bg-shader_500"
                  : "border-green bg-green hover:border-green hover:text-green hover:bg-white text-white"
              } px-6 mx-auto mt-2 py-2 rounded-lg transition-all text-sm font-medium`}
              onClick={() => {
                handleReleaseLaunchPad(
                  account,
                  wallet,
                  data.launchpad,
                  setIsOpenConfirmClaim,
                  setIsOpenTransaction,
                  setIsOpenError,
                  setIsOpenSuccess,
                  setHash
                );
              }}
            >
              Claim
            </button>
          </div>
        </div>

        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red text-white cursor-pointer" />
        </button>
      </div>
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </Wrapper>
  );
};

export default ModalClaimLaunchpad;
