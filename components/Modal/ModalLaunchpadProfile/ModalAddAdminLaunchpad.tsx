import AccountContext from "@/context/AccountContext";
import isValidEthereumAddress from "@/hooks/useCheckValidAddress";
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
      <div className="relative z-50 flex flex-col justify-center bg-white rounded-md cursor-default h-fit">
        <div className="bg-white h-fit w-[260px] md:w-[300px] lg:w-[550px] rounded-lg p-4 relative">
          <h3 className="pt-4 pb-8 text-xl text-center">Add Admin</h3>
          <div className="p-2 mx-auto text-center border rounded-lg">
            <p>Address wallet User</p>

            <div className="relative flex items-center justify-center w-full gap-2 mx-auto">
              <input
                type="Text"
                className="block w-full py-2 mt-2 text-base text-center border rounded-md outline-none"
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
              />
            </div>
            {!isValidEthereumAddress(tempAddress) && (
              <small className="text-red">Invalid wallet address</small>
            )}
            <div className="flex justify-between">
              <div className="flex items-center gap-2 mb-6">
                <label className="relative inline-flex items-center gap-2 mt-2 cursor-pointer">
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
                      className="outline-none sr-only peer"
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
                  className="px-2 py-1 text-white border rounded-md h-fit bg-secondary4"
                  onClick={addAddressToList}
                >
                  Add Address (+1)
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex flex-col">
                {adminAddresses.map((item: any, idx: number) => (
                  <div className="flex items-center gap-2">
                    <span onClick={() => removeAddressFromList(idx)}>
                      <AiOutlineClose className="mb-0.5 cursor-pointer hover:text-rose-500 text-red" />
                    </span>
                    <span className="flex items-center text-black24">
                      <HiUser className="mb-0.5" />
                      {idx + 1}:
                    </span>
                    <span className="flex items-center gap-1">
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

          {/* <div className="flex justify-center mt-4">
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
              className="px-2 py-1 border rounded-md text-green border-green"
            >
              Confirm
            </button>
          </div> */}
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
