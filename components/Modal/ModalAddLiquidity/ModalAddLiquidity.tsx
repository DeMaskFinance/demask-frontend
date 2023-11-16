import { Button } from "@/components/Buttons";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformation from "@/hooks/useInformationToken";
import approveNFT from "@/libs/utils/approveNFT";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirmAddLiquidity from "../ModalConfirmAddLiquidity";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalAddLiquidityProps {
  isOpenAddLiquidity: boolean;
  data: any;
  tokenSymbol: string;
  setIsOpenLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
};
const ModalAddLiquidity: React.FunctionComponent<ModalAddLiquidityProps> = ({
  isOpenAddLiquidity,
  data,
  tokenSymbol,
  setIsOpenLiquidity,
}) => {
  const [inputNFT, setInputNFT] = useState<string>("");
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>('0');
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isApprovedToken, setIsApprovedToken] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] = useState<boolean>(false);
  const { demask, tokenDefault, account, wallet, slippage, txDeadline } = useContext(AccountContext);
  const { ROUTER: routerAddress, RPC: rpc, NATIVE_ADDRESS: nativeAddress } = demask;

  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenLiquidity(false);
  };
  const balanceNFT = useNFTBalance(
    account,
    data.nftAddress,
    data.nftID,
    wallet,
    isOpenTransaction
  );

  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformation(account, data.tokenAddress, wallet, routerAddress, rpc, nativeAddress, isOpenTransaction);

  const handleGetNFT = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNFT(e.target.value);
    if (Number(e.target.value) > Number(balanceNFT)) {
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
  };
  const handleGetToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(e.target.value);
    if (Number(e.target.value) > Number(balanceToken)) {
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };
  console.log(data);

  useEffect(() => {
    let amountErcDesired;
    if (
      data?.dmlAddress !== null &&
      data &&
      inputNFT
    ) {
      amountErcDesired = Number(inputNFT) * +(data.reserveTokenDecimals) / +(data.reserveNFT) * (1 + (slippage / 100));

    } else {
      amountErcDesired = handleBignumber(
        Number(inputToken),
        Number(data?.dmlDecimals)
      );
    }
    setAmountErcDesired(amountErcDesired);
    if (amountErcDesired) {
      const amountErcDesiredToDec = divideByDecimal(
        amountErcDesired?.toString(),
        data?.dmlDecimals
      );
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true)
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [inputNFT, inputToken, data]);
  // console.log(amountErcDesired.toString());
  // console.log(amountErcDesiredToDec.toString());
  // console.log(balanceToken);
  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await approveNFT(
        account,
        wallet,
        data.nftAddress,
        routerAddress
      );
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, data.nftAddress, wallet, isOpenTransaction]);

  const handleAddLiquidity = () => {
    if (inputNFT && !isSufficientNFT && !isSufficientToken) {
      setIsOpenConfirmAddLiquidity(true);
    } else {
      setIsInputNFT(true);
    }
  }
  return (
    <Wrapper isOpen={isOpenAddLiquidity} onClick={handleClose}>
      <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
        <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-4 relative">
          <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
            Add
            {data && (
              <div className="flex items-center leading-[16px] ml-1">
                <span> {data.metadata.symbol}</span>
                <span className="overflow-hidden">/</span>
                <span>{tokenSymbol}</span>
              </div>
            )}
          </p>
          <div>
            <div className="relative">
              <div>
                <div>
                  <div className="flex justify-between mb-4 text-dark2">
                    <p className="font-semibold">NFT</p>
                    <p>Balance: {formatNumber(balanceNFT)}</p>
                  </div>
                  <input
                    className={styles.inputItem}
                    type="number"
                    placeholder="Input amount NFT"
                    value={inputNFT}
                    onChange={handleGetNFT}
                  />
                  {isSufficientNFT && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="totalSale"
                    >
                      Insufficient NFT balance
                    </p>
                  )}
                  {!inputNFT && isInputNFT && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="inputNFT"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between mb-4 text-dark2">
                    <p className="font-semibold">Token</p>
                    <p>Balance: {formatNumber(balanceToken)}</p>
                  </div>
                  {
                    data.dmlAddress === null ? (
                      <input
                        className={styles.inputItem}
                        type="number"
                        placeholder="Input amount Token"
                        value={inputToken}
                        onChange={handleGetToken}
                      />
                    ) : (
                      <div>
                        {data ? (
                          <div className={styles.inputItem}>
                            {amountErcDesiredToDec}
                          </div>
                        ) : (
                          <div className={styles.inputItem}>
                            <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                          </div>
                        )}
                      </div>
                    )}
                  {isSufficientToken && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="inputNFT"
                    >
                      Insufficient Token balance
                    </p>
                  )}
                  {Math.floor(amountErcDesired) === 0 && inputNFT && (
                    <p className="mt-2 ml-2 text-xs text-red" key="inputNFT">
                      Can't add liquidity
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {!isApprovedNFT && (
                <Button
                  className="w-[126px] py-2 mx-auto"
                  primary
                  onClick={() =>
                    handleApproveNFT(
                      account,
                      wallet,
                      data.nftAddress,
                      setIsOpen,
                      setIsOpenTransaction,
                      routerAddress
                    )
                  }
                >
                  APPROVE NFT
                </Button>
              )}
              {isApprovedNFT && (
                <Button
                  className="w-[126px] py-2 mx-auto"
                  primary
                  onClick={handleAddLiquidity}
                >
                  ADD LIQUIDITY
                </Button>
              )}
            </div>
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
      <ModalConfirmAddLiquidity isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity} isOpenTransaction={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} tokenAddress={data.tokenAddress} nftAddress={data.nftAddress} idNFT={data.nftID} data={data} inputToken={inputToken} setInputToken={setInputToken} setIsOpenConfirmAddLiquidity={setIsOpenConfirmAddLiquidity} inputNFT={inputNFT} symbolToken={tokenSymbol} setInputNFT={setInputNFT} setIsOpenLiquidity={setIsOpenLiquidity} />
      <ModalTransation isOpenTransation={isOpenTransaction} setIsOpenTransaction={setIsOpenTransaction} isTransaction={true} />
    </Wrapper>

  );
};

export default ModalAddLiquidity;
