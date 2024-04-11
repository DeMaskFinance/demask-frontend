import abiErc20 from "@/abi/abiErc20.json";
import abiRouter from "@/abi/abiRouter.json";
import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { exponentialToDecimal } from "@/libs/utils/convertExponential";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleBignumber from "@/libs/utils/handleBignumber";
import { ethers } from "ethers";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalDocument from "../ModalLength/ModalDocument";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import erc1155Contract from "@/libs/utils/erc/erc1155.contract";
import ercContract from "@/libs/utils/erc/erc.contract";
interface ModalConfirmAddLiquidityProps {
  isOpenConfirmAddLiquidity: boolean;
  tokenAddress: string;
  data: DataBase;
  inputNFT: string;
  inputToken: string;
  nftAddress: string;
  idNFT: string;
  isOpenTransaction: boolean;
  setIsOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenConfirmAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setInputNFT: React.Dispatch<React.SetStateAction<string>>;
  setInputToken: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  setIsOpenLiquidity?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmAddLiquidity: React.FunctionComponent<
  ModalConfirmAddLiquidityProps
> = ({
  isOpenConfirmAddLiquidity,
  tokenAddress,
  data,
  inputToken,
  inputNFT,
  nftAddress,
  idNFT,
  isOpenTransaction,
  setIsOpenTransaction,
  setIsOpenConfirmAddLiquidity,
  setInputNFT,
  setInputToken,
  setIsOpenLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const { demask, tokenDefault, account, wallet, slippage, txDeadline } =
    useContext(AccountContext);
  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
    FACTORY: factoryAddress,
  } = demask;
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [preFectch, setPreFetch] = useState<boolean>(false);
  const [updatePrice, setUpdatePrice] = useState<boolean>(false);
  const { allowanceToken, bigNumberBalance } = useInformationToken(
    account,
    tokenAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );
  const dmlToken = useDMLToken(
    account,
    nftAddress,
    tokenAddress,
    wallet,
    factoryAddress,
    idNFT,
    isOpenTransaction,
    isOpenConfirmAddLiquidity
  );

  useEffect(() => {
    const handleCheckApproveToken = async () => {
      if (tokenAddress === nativeAddress) {
        setIsApprovedToken(true);
      } else {
        if (amountErcDesired && allowanceToken) {
          if (Number(allowanceToken) < Number(amountErcDesired.toString())) {
            setIsApprovedToken(false);
          } else {
            setIsApprovedToken(true);
          }
        }
      }
    };
    handleCheckApproveToken();
  }, [
    account,
    wallet,
    tokenAddress,
    inputToken,
    isOpenTransaction,
    amountErcDesired,
    allowanceToken,
  ]);
  useEffect(() => {
    const load = setInterval(() => {
      if (isOpenConfirmAddLiquidity) {
        setPreFetch(true);
      } else {
        setPreFetch(false);
      }
    }, 20000);
    return () => {
      clearInterval(load);
    };
  }, [isOpenConfirmAddLiquidity, preFectch]);
  const { reserveNFT, reserveToken, isLoadingInforDML } = useInformationDML(
    dmlToken,
    wallet,
    account,
    isOpenTransaction,
    false,
    false,
    isOpenConfirmAddLiquidity,
    true,
    updatePrice
  );

  useEffect(() => {
    let amountErcDesired;
    if (
      dmlToken !== "0x0000000000000000000000000000000000000000" &&
      data &&
      inputNFT
    ) {
      amountErcDesired =
        ((Number(inputNFT) * +reserveToken) / +reserveNFT) *
        (1 + slippage / 100);
    } else {
      amountErcDesired = handleBignumber(
        Number(inputToken),
        Number(data?.tokenDecimals)
      );
    }
    setAmountErcDesired(amountErcDesired);
    if (amountErcDesired) {
      const amountErcDesiredToDec = divideByDecimal(
        amountErcDesired?.toString(),
        data?.tokenDecimals
      );
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true);
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [inputNFT, inputToken, reserveToken, reserveNFT, dmlToken]);
  const handleApproveToken = async () => {
    if (account) {
      const contract = await ercContract.erc(wallet, tokenAddress, abiErc20);
      let result;
      try {
        if (dmlToken === "0x0000000000000000000000000000000000000000") {
          result = await contract.approve(
            routerAddress,
            handleBignumber(Number(inputToken), Number(data?.tokenDecimals))
          );
        } else {
          result = await contract.approve(
            routerAddress,
            exponentialToDecimal(amountErcDesired)
          );
        }
        setIsOpenTransaction(true);
        await result.wait();
        setIsOpenTransaction(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsOpen(true);
    }
  };
  const addLiquidity = async () => {
    if (!account) {
      setIsOpen(true);
      return;
    }

    if (!isSufficientToken && Math.floor(amountErcDesired) !== 0) {
      try {
        setIsOpenTransaction(true);
        const valueToSend =
          tokenAddress === nativeAddress
            ? exponentialToDecimal(Math.floor(amountErcDesired))
            : 0;
        const result = await erc1155Contract.addERC20ERC1155(
          wallet,
          nftAddress,
          tokenAddress,
          idNFT,
          routerAddress,
          amountErcDesired,
          inputNFT,
          account,
          txDeadline,
          valueToSend
        );
        const check = await result.wait();
        setHash(result.hash);
        setIsOpenTransaction(false);
        setInputNFT("");
        setInputToken("");
        setAmountErcDesiredToDec("");
        setIsOpenConfirmAddLiquidity(false);
        if (setIsOpenLiquidity) {
          setIsOpenLiquidity(false);
        }
        if (check.status === 1) {
          setIsOpenSuccess(true);
        } else {
          setIsOpenError(true);
        }
      } catch (error) {
        setIsOpenTransaction(false);
        console.error(error);
      }
    }
  };
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenConfirmAddLiquidity(false);
  };

  return (
    <Wrapper isOpen={isOpenConfirmAddLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
          <p className="title_modal">Create Pool</p>
          <div className="content_modal">
            <p>{inputNFT}</p>
            <div className="max-w-[60%]">
              <ModalDocument data={data?.metadata?.symbol} />
            </div>
          </div>
          <div className="flex justify-center mx-auto text-xl font-semibold text-dark2">
            +
          </div>
          <div className="content_modal">
            <FormatNumber number={amountErcDesiredToDec} />
            <p>{data?.tokenSymbol}</p>
          </div>
          {isSufficientToken && (
            <p className="text-xs text-red" key="inputNFT">
              Insufficient Token balance
            </p>
          )}
          {Math.floor(amountErcDesired) === 0 && (
            <p className="mt-2 text-xs text-red" key="inputNFT">
              Can't add liquidity
            </p>
          )}
          {/* {isSufficientNFT && (
                                <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="totalSale">
                                    Insufficient NFT balance
                                </p>
                            )} */}
          {preFectch && (
            <div className="flex items-center justify-between p-4 mt-8 font-semibold text-white rounded-lg bg-secondary5">
              <p className="text-xs">Price Updated</p>
              <Button
                disabled={isLoadingInforDML}
                primary
                className="px-6 py-2 bg-secondary5"
                onClick={() => {
                  setUpdatePrice(!updatePrice);
                  setPreFetch(false);
                }}
              >
                Accept
              </Button>
            </div>
          )}
          <div className="flex justify-between mt-8 text-lg font-semibold text-secondary1">
            <p>Slippage tolerance</p>
            <p>{slippage}%</p>
          </div>
          <p className="mt-2 mb-6 text-sm text-dark2">
            Output is estimated. You will receive at least {inputNFT} NFT or the
            transaction will revert
          </p>
          <div className="flex flex-col items-center mt-6">
            {isApprovedToken && (
              <button
                type="button"
                disabled={isLoadingInforDML || preFectch}
                className={`py-2 flex justify-center items-center gap-x-1 w-[144px] hover:bg-white border hover:text-secondary5 hover:border-secondary5 ${
                  isLoadingInforDML || preFectch ? "bg-dark4" : "bg-secondary5"
                } rounded-lg text-sm text-white mx-auto block`}
                onClick={addLiquidity}
              >
                Create pool
                {isLoadingInforDML && (
                  <BiLoaderAlt className="text-white animate-spin" />
                )}
              </button>
            )}
            {!isApprovedToken && tokenAddress !== nativeAddress && (
              <Button
                className="w-[126px] py-2"
                primary
                onClick={handleApproveToken}
              >
                Approve Token
              </Button>
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
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </Wrapper>
  );
};

export default memo(ModalConfirmAddLiquidity);
