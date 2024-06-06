import { Button } from "@/components/Buttons";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useInformation from "@/hooks/useInformationToken";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import { ModalError, ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import ercContract from "@/libs/utils/erc/erc.contract";
import { ModalConfirmAddLiquidity } from "../ModalConfirmAddLiquidity";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
interface ModalAddLiquidityProps {
  isOpenAddLiquidity: boolean;
  data: DataBase;
  setIsOpenLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalAddLiquidity: React.FunctionComponent<ModalAddLiquidityProps> = ({
  isOpenAddLiquidity,
  data,
  setIsOpenLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const [inputNFT, setInputNFT] = useState<string>("");
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const { demask, tokenDefault, account, wallet, slippage, txDeadline } =
    useContext(AccountContext);
  const {
    ROUTER: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;

  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
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

  const { bigNumberBalance } = useInformation(
    account,
    data.tokenAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );
  const handleChoicePercent = (item: string) => {
    setInputNFT(Math.floor((parseFloat(item) / 100) * +balanceNFT).toString());
    setActiveChoiceNFT(item);
  };
  const handleGetNFT = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNFT(e.target.value);
    if (Number(e.target.value) > Number(balanceNFT)) {
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
    setActiveChoiceNFT("");
  };
  useEffect(() => {
    if (inputNFT) {
      let amountErcDesired;
      if (data?.dmlAddress !== null && data && inputNFT) {
        amountErcDesired =
          ((Number(inputNFT) * +data.reserveTokenDecimals) / +data.reserveNFT) *
          (1 + slippage / 100);
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
          setIsSufficientToken(true);
        } else {
          setIsSufficientToken(false);
        }
      }
    } else {
      setAmountErcDesiredToDec(0);
    }
  }, [inputNFT, inputToken, data]);
  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await ercContract.approveNFT(
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
  };
  return (
    <Wrapper isOpen={isOpenAddLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-4 relative">
          <div className="flex justify-between title_modal">
            <p>Add Liquidity</p>
            <button className="text-lg " onClick={handleClose}>
              <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
            </button>
          </div>
          <div className="flex mt-4 gap-x-3">
            <div className="relative w-10 h-10 ">
              <div className="overflow-hidden rounded-lg">
                <MediaNFT data={data} isControls={false} />
              </div>
              <div className="absolute -right-[6px] -bottom-[6px] border-4 border-shader_800 rounded-full">
                <EtherIcon width={16} height={16} />
              </div>
            </div>
            <div>
              <div className="font-bold text-white truncate">
                {data?.metadata?.name}
              </div>

              <p className="text-sm font-semibold text-primary_300">ABU/ETH</p>
            </div>
          </div>
          <div>
            <div className="relative mt-4">
              <div>
                <div>
                  <div className="flex justify-between mb-1 font-semibold text-primary_300">
                    <p>NFT balance</p>
                    <p className="flex items-center font-bold text-white gap-x-1">
                      {account ? formatNumber(balanceNFT) : 0}
                      <NFTIcon width={12} height={12} />
                    </p>
                  </div>
                  <div className="flex gap-x-2">
                    <input
                      className="input_item w-[60%]"
                      type="number"
                      placeholder="Input amount NFT"
                      value={inputNFT}
                      onChange={handleGetNFT}
                    />
                    <div className="w-[40%]">
                      <TabGroups
                        choices={["25%", "50%", "75%", "100%"]}
                        activeChoice={activeChoiceNFT}
                        onChoiceChange={handleChoicePercent}
                      />
                    </div>
                  </div>
                  {isSufficientNFT && (
                    <p
                      className="mt-1 mb-2 ml-3 text-xs text-red"
                      key="totalSale"
                    >
                      Insufficient NFT balance
                    </p>
                  )}
                  {!inputNFT && isInputNFT && (
                    <p
                      className="mt-1 mb-2 ml-3 text-xs text-red"
                      key="inputNFT"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <div className="flex rounded-lg">
                    {data ? (
                      <div className="flex items-center justify-between font-semibold input_item bg-primary_400 bg-opacity-10">
                        <p>Liquidity</p>
                        <div className="flex items-center font-bold gap-x-1">
                          {amountErcDesiredToDec}
                          <EtherIcon width={16} height={16} />
                        </div>
                      </div>
                    ) : (
                      <div className="input_item">
                        <BiLoaderAlt className="text-3xl animate-spin text-primary_400" />
                      </div>
                    )}
                  </div>
                  {isSufficientToken && (
                    <p
                      className="mt-1 mb-2 ml-3 text-xs text-red"
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
            <div className="flex justify-center mt-4">
              {isApprovedNFT ? (
                <Button
                  className="w-[126px] py-2 mx-auto"
                  primary
                  onClick={handleAddLiquidity}
                >
                  Add Liquidity
                </Button>
              ) : (
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
                  Approve NFT
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalConfirmAddLiquidity
        isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity}
        isOpenTransaction={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        data={data}
        tokenAddress={data.tokenAddress}
        nftAddress={data.nftAddress}
        idNFT={data.nftID}
        inputToken={inputToken}
        setInputToken={setInputToken}
        setIsOpenConfirmAddLiquidity={setIsOpenConfirmAddLiquidity}
        inputNFT={inputNFT}
        setInputNFT={setInputNFT}
        setIsOpenLiquidity={setIsOpenLiquidity}
        setHash={setHash}
        setIsOpenSuccess={setIsOpenSuccess}
        setIsOpenError={setIsOpenError}
      />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </Wrapper>
  );
};

export default ModalAddLiquidity;
