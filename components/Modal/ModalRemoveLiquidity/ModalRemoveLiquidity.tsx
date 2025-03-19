import { Button } from "@/components/Buttons";
import NFTRemoveLiquidityGrids from "@/components/Collection/TransactionCollection/NFTRemoveLiquidityGrids";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import { Slider } from "@/components/ui/slider";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useCheckApproveToken from "@/hooks/useCheckApproveToken";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import { ercTradingRemove } from "@/libs/service/tradeService";
import { replaceDot } from "@/libs/utils/formatComon";
import handleApproveDML from "@/libs/utils/handleApproveDML";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import ModalConfirmRemoveLiquidity from "../ModalConfirmRemoveLiquidity";
import { ModalTransation } from "../ModalTransation";
import { BsExclamationOctagon } from "react-icons/bs";
interface ModalRemoveLiquidityProps {
  data: DataBase;
  routerAddress: string;
  type: string;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
}

const ModalRemoveLiquidity: React.FunctionComponent<
  ModalRemoveLiquidityProps
> = ({
  data,
  routerAddress,
  type,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
  closeModal,
}) => {
    const [inputLiquidity, setInputLiquidity] = useState<any>("");
    const [activeChoice, setActiveChoice] = useState<string>("");
    const [isSufficientLiquidity, setIsSufficientLiquidity] =
      useState<boolean>(false);
    const [showRequiredMessage, setShowRequiredMessage] = useState(false);
    const [idNFT, setIdNFT] = useState<number[]>([]);
    const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
    const [isOpenConfirmRemoveLiquidity, setIsOpenConfirmRemoveLiquidity] =
      useState<boolean>(false);
    const { account, wallet, chainId } = useContext(AccountContext);
    const router = useRouter();
    const collectionAddress = (router.query.erc as string) || "";
    const [liquidityPercentage, setLiquidityPercentage] = useState(0);

    const [version] = useQueryParam("version", withDefault(StringParam, "v1"));

    const { data: dataTradingRemove, isFetching: isFetchingRemove } =
      useQuery<DataRemove>({
        queryKey: [
          "tradingRemove",
          data.dmlAddress,
          chainId,
          idNFT,
          account,
          inputLiquidity,
        ],
        queryFn: async () => {
          const res = await ercTradingRemove(
            data.dmlAddress,
            chainId,
            inputLiquidity,
            account
          );
          return res.data;
        },
        refetchInterval: 20000,
      });

    const { currentAllowance, refetch } = useAllowanceDML(
      account,
      data.dmlAddress,
      routerAddress,
    );


    const handleGetLiquidity = (values: NumberFormatValues) => {
      const { value } = values;
      const inputValue = replaceDot(value);
      setInputLiquidity(inputValue);
      setShowRequiredMessage(false);
      if (Number(inputValue) > Number(dataTradingRemove?.balanceDml)) {
        setIsSufficientLiquidity(true);
      } else {
        setIsSufficientLiquidity(false);
      }

      if (dataTradingRemove?.balanceDml) {
        const percentage = (Number(inputValue) / Number(dataTradingRemove.balanceDml)) * 100;
        setLiquidityPercentage(Math.min(percentage, 100));
      }
    };

    const handleSliderChange = (value: any) => {
      setLiquidityPercentage(value[0]);
    };

    const handleSliderCommit = (value: any) => {
      if (dataTradingRemove?.balanceDml) {
        const calculatedLiquidity = (
          Number(dataTradingRemove.balanceDml) * (value[0] / 100)
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 18,
        });

        setInputLiquidity(calculatedLiquidity);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = Number(e.target.value);
      if (value > 100) value = 100;
      if (value < 0 || isNaN(value)) value = 0;

      setLiquidityPercentage(value);

      if (dataTradingRemove?.balanceDml) {
        const calculatedLiquidity = (
          Number(dataTradingRemove.balanceDml) * (value / 100)
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 18,
        });

        setInputLiquidity(calculatedLiquidity);
      }
    };


    const isApprovedLiquidity = useCheckApproveToken(
      currentAllowance,
      inputLiquidity,
      isOpenTransaction
    );

    const handleRemoveLiquidity = () => {
      if (inputLiquidity === "") {
        setShowRequiredMessage(true);
      } else if (
        !isSufficientLiquidity &&
        Number(dataTradingRemove?.amountETHDecimals) > 0
      ) {
        setIsOpenConfirmRemoveLiquidity(true);
      }
    };

    const { data: data721, isSuccess, isLoading } = useQuery({
      queryKey: ["collectionNFTs", chainId, collectionAddress, version],
      queryFn: async () => {
        const res = await fetchDataBuyNFTs(collectionAddress, chainId, version, 1, 500);
        return res;
      },
    });



    const dataRemoveBuy = data721?.data || data721?.pages?.[0]?.data

    const { approveDML } = handleApproveDML()

    useEffect(() => {
      if (dataTradingRemove?.amountNFT && dataRemoveBuy?.length > 0) {
        const selectedNFTs = dataRemoveBuy.slice(0, dataTradingRemove?.amountNFT).map((nft: any) => Number(nft.nftID));
        setIdNFT(selectedNFTs);
      } else {
        setIdNFT([]);
      }
    }, [dataTradingRemove, dataRemoveBuy]);

    return (
      <Fragment>
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[500px] rounded-lg relative">
          <p className="title_modal">Remove Liquidity</p>
          {data721 &&
            <div className="flex items-center justify-between w-full py-2">
              <p className="text-xs text-[#F9BE76] flex gap-1 items-center">
                <BsExclamationOctagon className="inline-block" />
                The maximum transaction limit's 500 NFTs.</p>
              <p className="text-white text-sm font-semibold">{dataRemoveBuy?.length}/{data721?.totalRecords}</p>
            </div>
          }

          {type === "erc1155" && (
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
              </div>
            </div>
          )}
          {isLoading && <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
            <SkeletonItemTransaction />
          </div>}
          {type === "erc721" && isSuccess && (
            <NFTRemoveLiquidityGrids
              data={dataRemoveBuy}
              totalRecord={data721?.totalRecords}
              maxNft={dataTradingRemove?.maxNft}
              setIdNFT={setIdNFT}
              idNFT={idNFT}
              isSearch={false}
              isRemove
            />
          )}
          <div>
            <div className="relative">
              <div className="flex justify-between my-4 ">
                <p className="font-semibold text-primary_400">Liquidity</p>
                <div className="flex items-center font-bold text-white gap-x-1">
                  <FormatNumber number={dataTradingRemove?.balanceDml || 0} />
                  <EtherIcon width={16} height={16} />
                </div>
              </div>
              <div className="flex mt-4 gap-x-2">
                <NumericFormat
                  name="amountLiquidityRemove"
                  id="amountLiquidityRemove"
                  autoComplete="off"
                  placeholder="Input amount Token"
                  className="input_item"
                  value={inputLiquidity}
                  inputMode="decimal"
                  onValueChange={handleGetLiquidity}
                  decimalSeparator=","
                  thousandSeparator="."
                  minLength={1}
                  maxLength={30}
                />

                <div className="flex items-center h-10 border w-full rounded-lg border-shader_400">
                  <div className="flex-grow px-4">
                    <Slider
                      max={100}
                      step={1}
                      value={[liquidityPercentage]}
                      onValueChange={handleSliderChange}
                      onValueCommit={handleSliderCommit}
                    />
                  </div>
                  <div className="relative h-full bg-shader_600 overflow-hidden rounded-e-lg">
                    <input
                      type="number"
                      value={liquidityPercentage}
                      onChange={handleInputChange}
                      className="w-14 h-full mr-1 font-semibold text-white text-center rounded-e-lg bg-shader_600 outline-none"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white font-semibold">%</span>
                  </div>

                </div>
              </div>
              {isSufficientLiquidity && (
                <p className="mt-1 mb-2 ml-1 text-xs text-red" key="liquidity">
                  Insufficient Liquidity balance
                </p>
              )}
              {showRequiredMessage && (
                <p className="mx-auto mt-2 ml-3 text-xs text-red" key="emptyNFT">
                  Required
                </p>
              )}
            </div>
            <div>
              <div className="flex justify-between my-4 font-semibold input_item bg-primary_500 bg-opacity-10">
                NFT Receive
                <div className="flex items-center justify-between gap-x-1">
                  <FormatNumber number={dataTradingRemove?.amountNFT || 0} />
                  <NFTIcon width={16} height={16} />
                </div>
              </div>
              {type === "erc721" &&
                Number(dataTradingRemove?.amountNFT) >= 500 &&
                <p className="mb-1 text-right text-xs text-red" key="inputNFT">
                  Maximum 500 NFTs per transaction
                </p>
              }

              <div className="flex justify-between my-4 font-semibold input_item bg-primary_500 bg-opacity-10">
                Total MON
                <div className="flex items-center justify-between gap-x-1">
                  <FormatNumber number={dataTradingRemove?.amountETH || 0} />
                  <EtherIcon width={16} height={16} />
                </div>
              </div>
              {dataTradingRemove?.amountETHDecimals === 0 && inputLiquidity && (
                <p className="my-2 ml-3 text-xs text-red" key="inputNFT">
                  Can't remove liquidity
                </p>
              )}
              <div className="flex justify-center">
                {!isApprovedLiquidity ? (
                  <Button
                    className="w-[126px] py-2 mx-auto"
                    primary
                    onClick={() => {
                      approveDML(
                        account,
                        data.dmlAddress,
                        inputLiquidity,
                        setIsOpenTransaction,
                        routerAddress,
                        refetch
                      );
                    }}
                  >
                    Approve
                  </Button>
                ) : (
                  <>
                    {type === "erc721" ? (
                      <Button
                        className={`p-2 mx-auto ${dataTradingRemove?.amountNFT !== idNFT.length || dataTradingRemove?.amountETHDecimals === 0 || Number(dataTradingRemove?.amountNFT) >= 500 ? "bg-gray-400/10" : ""}`}
                        primary={dataTradingRemove?.amountNFT === idNFT.length}
                        active={dataTradingRemove?.amountNFT !== idNFT.length}
                        disabled={dataTradingRemove?.amountNFT !== idNFT.length || Number(dataTradingRemove?.amountNFT) >= 500 || dataTradingRemove?.amountETHDecimals === 0}
                        onClick={handleRemoveLiquidity}
                      >
                        Remove Liquidity
                      </Button>
                    ) : (
                      <Button
                        className="p-2 mx-auto"
                        primary={inputLiquidity}
                        active={!inputLiquidity}
                        disabled={!inputLiquidity}
                        onClick={handleRemoveLiquidity}
                      >
                        Remove Liquidity
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {dataTradingRemove && (
          <ModalConfirmRemoveLiquidity
            routerAddress={routerAddress}
            isOpenConfirmRemoveLiquidity={isOpenConfirmRemoveLiquidity}
            setIsOpenConfirmRemoveLiquidity={setIsOpenConfirmRemoveLiquidity}
            isOpenTransaction={isOpenTransaction}
            setIsOpenTransaction={setIsOpenTransaction}
            data={data}
            isFetching={isFetchingRemove}
            dataTradingRemove={dataTradingRemove}
            idNFT={idNFT}
            inputLiquidity={inputLiquidity}
            setInputLiquidity={setInputLiquidity}
            setHash={setHash}
            setIsOpenSuccess={setIsOpenSuccess}
            setIsOpenError={setIsOpenError}
            closeModal={closeModal}
          />
        )}
        <ModalTransation
          isOpenTransation={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
        />
      </Fragment>
    );
  };
export default ModalRemoveLiquidity;
