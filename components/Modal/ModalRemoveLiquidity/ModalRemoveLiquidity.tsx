import { Button } from "@/components/Buttons";
import NFTGrid from "@/components/Collection/TransactionCollection/NFTsGrids";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
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
import ModalConfirmRemoveLiquidity from "../ModalConfirmRemoveLiquidity";
import { ModalTransation } from "../ModalTransation";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
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
    const handleChoiceChange = (choice: string) => {
      setActiveChoice(choice);
      setIdNFT([]);
    };
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
      // setActiveChoice("");
      if (Number(inputValue) > Number(dataTradingRemove?.balanceDml)) {
        setIsSufficientLiquidity(true);
      } else {
        setIsSufficientLiquidity(false);
      }
    };

    const isApprovedLiquidity = useCheckApproveToken(
      currentAllowance,
      inputLiquidity,
      isOpenTransaction
    );


    useEffect(() => {
      if (
        dataTradingRemove?.balanceDml &&
        activeChoice !== "" &&
        activeChoice !== "0%"
      ) {
        let liquidityPercentage = 0;
        if (activeChoice === "25%") {
          liquidityPercentage = 0.25;
        } else if (activeChoice === "50%") {
          liquidityPercentage = 0.5;
        } else if (activeChoice === "75%") {
          liquidityPercentage = 0.75;
        } else if (activeChoice === "100%") {
          liquidityPercentage = 1;
        }
        const calculatedLiquidity = (
          Number(dataTradingRemove.balanceDml) * liquidityPercentage
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 18,
        });

        setInputLiquidity(calculatedLiquidity);
        setShowRequiredMessage(false);
        setIsSufficientLiquidity(false);
      }
    }, [dataTradingRemove, activeChoice]);

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

    const { data: data721, isSuccess } = useQuery({
      queryKey: ["collectionNFTBUY", chainId, collectionAddress, version],
      queryFn: async () => {
        const res = await fetchDataBuyNFTs(collectionAddress, chainId, version);
        return res;
      },
    });

    const { approveDML } = handleApproveDML()

    return (
      <Fragment>
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[500px] rounded-lg relative">
          <p className="title_modal" onClick={(() => refetch())}>Remove Liquidity</p>
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
                {/* <p className="text-sm font-semibold text-primary_300">ABU/MON</p> */}
              </div>
            </div>
          )}
          {type === "erc721" && isSuccess && (
            <NFTGrid
              data={data721}
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
                <TabGroups
                  choices={["25%", "50%", "75%", "100%"]}
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
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
              <div className="flex justify-between my-4 font-semibold input_item bg-primary_500 bg-opacity-10">
                Total Liquidity
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
                        className="p-2 mx-auto"
                        primary={dataTradingRemove?.amountNFT === idNFT.length}
                        active={dataTradingRemove?.amountNFT !== idNFT.length}
                        disabled={dataTradingRemove?.amountNFT !== idNFT.length}
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
