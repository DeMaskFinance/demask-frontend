import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import NFTGrid from "@/components/CreatedCollection/TransactionCollection/NFTsGrids";
import { EtherIcon } from "@/components/Icons";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import useInformation from "@/hooks/useInformationToken";
import { fetchDataSellNFTs } from "@/libs/service/collectionService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import { ModalConfirmAddLiquidityERC721 } from "../ModalConfirmAddLiquidity";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { replaceDot } from "@/libs/utils/formatComon";
interface ModalAddLiquidityERC721Props {
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalAddLiquidityERC721: React.FunctionComponent<
  ModalAddLiquidityERC721Props
> = ({ setHash, setIsOpenSuccess, setIsOpenError }) => {
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const { demask, account, wallet, slippage, chainId } =
    useContext(AccountContext);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";
  const dmlToken = useDMLToken(
    account,
    collectionAddress,
    nativeAddress,
    wallet,
    demask.FACTORY_721,
    "",
    isOpenTransaction,
    isOpenConfirmAddLiquidity
  );
  const { reserveNFT, reserveToken, isLoadingInforDML } = useInformationDML(
    dmlToken,
    wallet,
    account,
    isOpenTransaction,
    false,
    false,
    isOpenConfirmAddLiquidity,
    true
  );

  const { balanceToken, bigNumberBalance } = useInformation(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    chainId,
    isOpenTransaction
  );

  const { data, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ["collectionNFTSell", chainId, collectionAddress, account],
    queryFn: async () => {
      const res = await fetchDataSellNFTs(collectionAddress, chainId, account);
      return res;
    },
  });
  const handleGetToken = (values: NumberFormatValues) => {
    const { value } = values;
    const inputValue = replaceDot(value);
    setInputToken(inputValue);
    if (Number(inputValue) > Number(balanceToken)) {
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };

  useEffect(() => {
    let amountErcDesired;
    if (
      dmlToken !== "0x0000000000000000000000000000000000000000" &&
      data &&
      idNFT
    ) {
      amountErcDesired =
        ((Number(idNFT.length) * +reserveToken) / +reserveNFT) *
        (1 + slippage / 100);
    } else {
      amountErcDesired = handleBignumber(Number(inputToken), Number(18));
    }
    setAmountErcDesired(amountErcDesired);
    if (amountErcDesired) {
      const amountErcDesiredToDec = divideByDecimal(
        amountErcDesired?.toString(),
        "18"
      );
      setAmountErcDesiredToDec(amountErcDesiredToDec.toString());
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true);
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [idNFT, inputToken, data]);
  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await ercContract.approveNFT(
        account,
        wallet,
        collectionAddress,
        routerAddress
      );
      setIsApprovedNFT(result);
    };
    checkApproveNFT();
  }, [account, collectionAddress, wallet, isOpenTransaction]);

  const handleAddLiquidity = () => {
    if (idNFT.length > 0 && !isSufficientToken) {
      setIsOpenConfirmAddLiquidity(true);
    }
  };

  const handleChoiceNFT = (item: any) => {
    const isExist = idNFT.includes(Number(item.nftID));
    if (isExist) {
      const arr = idNFT.filter((itemArr) => {
        return itemArr !== Number(item.nftID);
      });
      setIdNFT(arr);
    } else {
      setIdNFT([...idNFT, Number(item.nftID)]);
    }
  };

  return (
    <Fragment>
      <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg p-4 relative">
        <div className="title_modal">Add Liquidity</div>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
            <SkeletonItemTransaction />
          </div>
        ) : (
          <NFTGrid
            data={data}
            isFetching={isFetching}
            handleChoiceNFT={handleChoiceNFT}
            idNFT={idNFT}
            isSearch={false}
          />
        )}
        <div>
          <div>
            <div className="my-4">
              {dmlToken === "0x0000000000000000000000000000000000000000" ? (
                <NumericFormat
                  name="amountToken721"
                  id="amountToken721"
                  autoComplete="off"
                  placeholder="Input amount Token"
                  className="input_item"
                  value={inputToken}
                  inputMode="decimal"
                  onValueChange={handleGetToken}
                  decimalSeparator=","
                  thousandSeparator="."
                  minLength={1}
                  maxLength={30}
                />
              ) : (
                <div>
                  {data ? (
                    <div className="relative flex items-center justify-between w-full h-11 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10 text-primary_100">
                      <div className="">Total Liquidity</div>
                      <div className="flex items-center px-2 py-1 text-white gap-x-1">
                        <FormatNumber number={amountErcDesiredToDec} />{" "}
                        <EtherIcon width={16} height={16} />
                      </div>
                    </div>
                  ) : (
                    <div className="input_item">
                      <BiLoaderAlt className="text-3xl animate-spin text-primary_400" />
                    </div>
                  )}
                </div>
              )}
            </div>
            {isSufficientToken && (
              <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="inputToken">
                Insufficient Token balance
              </p>
            )}
            {Math.floor(amountErcDesired) === 0 && idNFT.length > 0 && (
              <p className="mt-2 ml-2 text-xs text-red" key="inputNFT">
                Can't add liquidity
              </p>
            )}
          </div>
          <div className="flex justify-center">
            {isApprovedNFT ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="w-[126px] py-2 mx-auto whitespace-nowrap"
                    primary={
                      idNFT.length > 0 &&
                      amountErcDesiredToDec > 0 &&
                      !isSufficientToken
                    }
                    active={
                      idNFT.length === 0 ||
                      amountErcDesiredToDec === 0 ||
                      isSufficientToken
                    }
                    onClick={handleAddLiquidity}
                  >
                    Add Liquidity
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
                  {data && (
                    <ModalConfirmAddLiquidityERC721
                      data={data}
                      isOpenTransaction={isOpenTransaction}
                      setIsOpenTransaction={setIsOpenTransaction}
                      tokenAddress={demask.NATIVE_ADDRESS}
                      nftAddress={collectionAddress}
                      idNFT={""}
                      inputNFT={idNFT}
                      inputToken={inputToken}
                      setIdNFT={setIdNFT}
                      setInputToken={setInputToken}
                      setHash={setHash}
                      setIsOpenSuccess={setIsOpenSuccess}
                      setIsOpenError={setIsOpenError}
                    />
                  )}
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                className="w-[126px] py-2 mx-auto"
                primary
                onClick={() =>
                  handleApproveNFT(
                    account,
                    wallet,
                    collectionAddress,
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
    </Fragment>
  );
};

export default ModalAddLiquidityERC721;
