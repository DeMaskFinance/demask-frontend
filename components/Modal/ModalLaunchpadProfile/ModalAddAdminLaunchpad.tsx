import AccountContext from "@/context/AccountContext";
import isValidEthereumAddress from "@/hooks/useCheckValidAddress";
import handleAddAdmin from "@/libs/utils/handleAddAdmin";
import { useContext, useEffect, useState } from "react";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { CgClose } from "react-icons/cg";
import { HiUser } from "react-icons/hi";
import { ToastContainer } from "react-toastify";
import { ModalTransation } from "../ModalTransation";
import Wrapper from "../Wrapper";
import handleWhiteList from "@/libs/utils/handleAddWhiteListLaunchpad";

interface ModalAddAdminLaunchpadProps {
  isOpenTransation: any;
  setIsOpenTransaction: any;
  setIsOpenModal: any;
  isOpenModal: any;
  tokenLaunchpad: any;
  action: string;
}

const ModalAddAdminLaunchpad: React.FunctionComponent<
  ModalAddAdminLaunchpadProps
> = ({
  isOpenTransation,
  setIsOpenTransaction,
  setIsOpenModal,
  isOpenModal,
  tokenLaunchpad,
  action,
}) => {
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenModal(false);
  };
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);

  const [adminAddresses, setAdminAddresses] = useState<any>([]);
  const [tempAddress, setTempAddress] = useState("");
  const [tempStatus, setTempStatus] = useState(false);
  const [addresses, setAddresses] = useState<any>([]);
  const [statuses, setStatuses] = useState<any>([]);

  const addAddressToList = () => {
    if (isValidEthereumAddress(tempAddress)) {
      setAdminAddresses([
        ...adminAddresses,
        { address: tempAddress, status: tempStatus },
      ]);

      setAddresses([...addresses, tempAddress]);
      setStatuses([...statuses, tempStatus]);

      setTempAddress("");
      setTempStatus(false);
    }
  };

  const handleStatus = () => {
    setTempStatus(!tempStatus);
  };

  const removeAddressFromList = (index: number) => {
    const newData = [...adminAddresses];
    newData.splice(index, 1);
    setAdminAddresses(newData);

    const newAddresses = [...addresses];
    newAddresses.splice(index, 1);
    setAddresses(newAddresses);

    const newStatuses = [...statuses];
    newStatuses.splice(index, 1);
    setStatuses(newStatuses);
  };

  useEffect(() => {}, [isOpenTransation]);

  return (
    <Wrapper isOpen={isOpenModal} onClick={handleClose} isTransaction>
      <div className="relative bg-white z-50 flex flex-col  justify-center rounded-md cursor-default h-fit">
        <div className="bg-white h-fit w-[260px] md:w-[300px] lg:w-[550px] rounded-lg p-4 relative">
          <h3 className="text-xl text-center pt-4 pb-8">Add Admin</h3>
          <div className="mx-auto border text-center p-2 rounded-lg">
            <p>Address wallet User</p>

            <div className="flex gap-2 items-center w-full mx-auto relative justify-center">
              <input
                type="Text"
                className="w-full text-base border py-2  outline-none rounded-md mt-2 text-center block"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
              />
            </div>
            {!isValidEthereumAddress(tempAddress) && (
              <small className="text-red">Invalid wallet address</small>
            )}
            <div className="flex justify-between">
              <div className="flex items-center gap-2 mb-6">
                <label className="relative gap-2 mt-2 inline-flex items-center cursor-pointer">
                  <span
                    onClick={handleStatus}
                    className={"text-base font-semibold text-black24"}
                  >
                    Status
                  </span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer outline-none"
                      checked={tempStatus}
                    />
                    <div
                      onClick={handleStatus}
                      className={`w-11 h-6 rounded-full peer  ${
                        tempStatus ? "bg-secondary5" : "bg-gray-400"
                      } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600`}
                    ></div>
                  </div>
                </label>
              </div>
              <div className="flex justify-end py-2">
                <button
                  className="border px-2 h-fit py-1 bg-secondary4 text-white rounded-md"
                  onClick={addAddressToList}
                >
                  Add Address (+1)
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                {adminAddresses.map((item: any, idx: number) => (
                  <div className="flex gap-2 items-center">
                    <span onClick={() => removeAddressFromList(idx)}>
                      <AiOutlineClose className="mb-0.5 cursor-pointer hover:text-rose-500 text-red" />
                    </span>
                    <span className="flex text-black24 items-center">
                      <HiUser className="mb-0.5" />
                      {idx + 1}:
                    </span>
                    <span className="flex gap-1 items-center">
                      {item.address}

                      {item.status ? (
                        <AiFillCheckCircle className="text-green" />
                      ) : (
                        <AiFillCloseCircle className="text-red" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                action === "addAdmin"
                  ? handleAddAdmin(
                      account,
                      wallet,
                      adminAddresses,
                      statuses,
                      addresses,
                      tokenLaunchpad,
                      setIsOpenModal,
                      setIsOpenTransaction
                    )
                  : handleWhiteList(
                      account,
                      wallet,
                      adminAddresses,
                      statuses,
                      addresses,
                      tokenLaunchpad,
                      setIsOpenModal,
                      setIsOpenTransaction
                    );
              }}
              className="border px-2 py-1 rounded-md text-green border-green"
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
      <ModalTransation
        isOpenTransation={isOpenTransation}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
      <ToastContainer />
    </Wrapper>
  );
};

export default ModalAddAdminLaunchpad;
