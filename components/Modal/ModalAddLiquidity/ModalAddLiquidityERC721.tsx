import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import NFTGrid from "@/components/Collection/TransactionCollection/NFTsGrids";
import { EtherIcon } from "@/components/Icons";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import { fetchDataSellNFTs } from "@/libs/service/collectionService";
import { erc721TradingAdd } from "@/libs/service/tradeService";
import { replaceDot } from "@/libs/utils/formatComon";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { ModalConfirmAddLiquidityERC721 } from "../ModalConfirmAddLiquidity";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import { queryClient } from "@/libs/constants";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import useInformationToken from "@/hooks/useInformationToken";
import { ModalTransation } from "../ModalTransation";
interface ModalAddLiquidityERC721Props {
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenAddLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalAddLiquidityERC721: React.FunctionComponent<
  ModalAddLiquidityERC721Props
> = ({ setHash, setIsOpenSuccess, setIsOpenError, setIsOpenAddLiquidity }) => {
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const { account, wallet, slippage, chainId } = useContext(AccountContext);
  const { balanceToken, bigNumberBalance } = useInformationToken(
    account,
    wallet,
    chainId
  );
  const router = useRouter();
  const collectionAddress = (router.query.erc as string) || "";
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);


  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [
      "collectionNFTSell",
      chainId,
      collectionAddress,
      account,
      version,
    ],
    queryFn: async () => {
      const res = await fetchDataSellNFTs(
        collectionAddress,
        chainId,
        account,
        version
      );
      return res;
    },
  });
  const { data: dataTradingAdd, isFetching: isFetchingAdd } = useQuery<DataAdd>(
    {
      queryKey: [
        "721TradingAdd",
        slippage,
        collectionAddress,
        chainId,
        idNFT,
        version,
      ],
      queryFn: async () => {
        const res = await erc721TradingAdd(
          collectionAddress,
          chainId,
          idNFT.length,
          slippage,
          version
        );
        return res.data;
      },
      refetchInterval: 20000,
    }
  );

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
    if (data?.dmlAddress !== null && dataTradingAdd && idNFT) {
      amountErcDesired = dataTradingAdd?.amountETHDecimals;
    } else {
      amountErcDesired = handleBignumber(Number(inputToken), 18);
    }
    if (idNFT.length === 0) {
      setAmountErcDesired("");
    }
    setAmountErcDesired(amountErcDesired);
    if (amountErcDesired) {
      if (Number(amountErcDesired) > Number(bigNumberBalance)) {
        setIsSufficientToken(true);
      } else {
        setIsSufficientToken(false);
      }
    }
  }, [idNFT, inputToken, dataTradingAdd, bigNumberBalance, data]);

  const isApprovedNFT = useCheckApproveNFT(
    account,
    wallet,
    collectionAddress,
    contracts?.ERC721_ROUTER_ADDRESS || "",
    isOpenTransaction
  );


  return (
    <Fragment>
      <div className="h-fit w-[360px] md:w-[400px] lg:w-[480px] rounded-lg relative">
        <div className="title_modal">Add Liquidity</div>
        {isLoading ? (
          <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
            <SkeletonItemTransaction />
          </div>
        ) : (
          <NFTGrid
            data={data}
            setIdNFT={setIdNFT}
            idNFT={idNFT}
            isSearch={false}
          />
        )}
        <div>
          <div>
            <div className="my-4">
              {data?.dmlAddress === null ? (
                <div className="relative">
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

                  <div className="absolute top-3 right-3">
                    <EtherIcon width={16} height={16} />
                  </div>

                </div>
              ) : (
                <div>
                  {data ? (
                    <div className="relative flex items-center justify-between w-full pl-2 mb-4 text-base font-semibold rounded-lg h-11 bg-primary_500 bg-opacity-10 text-primary_100">
                      <div className="">Total Liquidity</div>
                      <div className="flex items-center px-2 py-1 text-white gap-x-1">
                        <FormatNumber number={dataTradingAdd?.amountETH || 0} />{" "}
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
            {idNFT.length > 0 && (
              <>
                {isApprovedNFT ? (
                  <Dialog
                    open={isOpenConfirmAddLiquidity}
                    onOpenChange={setIsOpenConfirmAddLiquidity}
                  >
                    {data?.dmlAddress === null ? (
                      <DialogTrigger asChild>
                        {dataTradingAdd && (
                          <Button
                            className="w-[126px] py-2 mx-auto whitespace-nowrap"
                            primary={idNFT.length > 0 && !isSufficientToken}
                            active={
                              idNFT.length === 0 ||
                              Math.floor(amountErcDesired) === 0 ||
                              dataTradingAdd?.amountETHDecimals === 0 ||
                              isSufficientToken
                            }
                            disabled={
                              idNFT.length === 0 ||
                              Math.floor(amountErcDesired) === 0 ||
                              dataTradingAdd?.amountETHDecimals === 0 ||
                              isSufficientToken
                            }
                          >
                            Create pool
                          </Button>
                        )}
                      </DialogTrigger>
                    ) : (
                      <DialogTrigger asChild>
                        {dataTradingAdd && (
                          <Button
                            className="w-[126px] py-2 mx-auto whitespace-nowrap"
                            primary={idNFT.length > 0 && !isSufficientToken}
                            active={
                              idNFT.length === 0 ||
                              dataTradingAdd?.amountETHDecimals === 0 ||
                              isSufficientToken
                            }
                            disabled={
                              idNFT.length === 0 ||
                              dataTradingAdd?.amountETHDecimals === 0 ||
                              isSufficientToken
                            }
                          >
                            Add Liquidity
                          </Button>
                        )}
                      </DialogTrigger>
                    )}
                    <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
                      {data && dataTradingAdd && (
                        <ModalConfirmAddLiquidityERC721
                          data={data}
                          isOpenTransaction={isOpenTransaction}
                          setIsOpenTransaction={setIsOpenTransaction}
                          setIsOpenAddLiquidity={setIsOpenAddLiquidity}
                          setIsOpenConfirmAddLiquidity={
                            setIsOpenConfirmAddLiquidity
                          }
                          inputToken={inputToken}
                          inputNFT={idNFT}
                          dataTradingAdd={dataTradingAdd}
                          isFetching={isFetchingAdd}
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
                        contracts?.ERC721_ROUTER_ADDRESS || "",
                        'erc721',
                      )
                    }
                  >
                    Approve NFT
                  </Button>
                )}
              </>
            )}
          </div>

          <ModalTransation
            isOpenTransation={isOpenTransaction}
            setIsOpenTransaction={setIsOpenTransaction}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default ModalAddLiquidityERC721;
