import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import useNFTBalance from "@/hooks/useBalanceNFT";
import useCheckApproveNFT from "@/hooks/useCheckApproveNFT";
import { erc1155TradingAdd } from "@/libs/service/tradeService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { replaceDot } from "@/libs/utils/formatComon";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { ModalConfirmAddLiquidity } from "../ModalConfirmAddLiquidity";
import { ModalTransation } from "../ModalTransation";
import Wrapper from "../Wrapper";
import { queryClient } from "@/libs/constants";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import useInformationToken from "@/hooks/useInformationToken";
import useApproveNFT from "@/libs/utils/handleApproveNFT";
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
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [activeChoiceNFT, setActiveChoiceNFT] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const { account, wallet, slippage, chainId } = useContext(AccountContext);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
  const contracts = queryClient.getQueryData<ContractAddresses>([
    "contracts",
    chainId,
    version,
  ]);

  const { bigNumberBalance } = useInformationToken(account, wallet, chainId);
  const { data: dataTradingAdd, isFetching: isFetchingAdd } = useQuery<DataAdd>(
    {
      queryKey: [
        "1155TradingAdd",
        data.tokenAddress,
        chainId,
        data.nftAddress,
        data.nftID,
        inputNFT,
        slippage,
        version,
      ],
      queryFn: async () => {
        const res = await erc1155TradingAdd(
          data.tokenAddress,
          chainId,
          data.nftAddress,
          data.nftID,
          +inputNFT,
          slippage,
          version
        );
        return res.data;
      },
      refetchInterval: 20000,
    }
  );
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenLiquidity(false);
  };
  const { balanceNFT } = useNFTBalance(
    account,
    data.nftAddress,
    data.nftID,
  );

  const handleChoicePercent = (item: string) => {
    setInputNFT(Math.floor((parseFloat(item) / 100) * +balanceNFT).toString());
    setActiveChoiceNFT(item);
  };
  const handleGetNFT = (values: NumberFormatValues) => {
    const { value } = values;
    setInputNFT(replaceDot(value));
    const numericValue = Number(value.replace(/,/g, ""));
    if (numericValue > Number(balanceNFT)) {
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
    // setActiveChoiceNFT("");
  };
  useEffect(() => {
    if (inputNFT) {
      let amountErcDesired =
        ((Number(inputNFT) * +data.reserveTokenDecimals) / +data.reserveNFT) *
        (1 + slippage / 100);

      setAmountErcDesired(amountErcDesired);

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
    } else {
      setAmountErcDesiredToDec(0);
    }
  }, [inputNFT, data, slippage, bigNumberBalance]);

  const isApprovedNFT = useCheckApproveNFT(
    account,
    data.nftAddress,
    contracts?.ERC1155_ROUTER_ADDRESS || "",
    "erc1155"
  );

  const handleAddLiquidity = () => {
    if (inputNFT && !isSufficientNFT && !isSufficientToken) {
      setIsOpenConfirmAddLiquidity(true);
    } else {
      setIsInputNFT(true);
    }
  };

  const { handleApproveNFT } = useApproveNFT();
  return (
    <Wrapper isOpen={isOpenAddLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[532px] rounded-lg p-4 relative">
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
                      {account ? formatNumber(Number(balanceNFT)) : 0}
                      <NFTIcon width={12} height={12} />
                    </p>
                  </div>
                  <div className="flex gap-x-2">
                    <NumericFormat
                      name="amountNFTAdd"
                      id="amountNFTAdd"
                      autoComplete="off"
                      placeholder="NFT quantity"
                      pattern="^[1-9][0-9]*$"
                      decimalScale={0}
                      decimalSeparator=","
                      thousandSeparator="."
                      className="input_item"
                      value={inputNFT}
                      onValueChange={handleGetNFT}
                    />
                    <TabGroups
                      choices={["25%", "50%", "75%", "100%"]}
                      activeChoice={activeChoiceNFT}
                      onChoiceChange={handleChoicePercent}
                    />
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
                          <FormatNumber number={amountErcDesiredToDec} />
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
                      key="isSuToken"
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
                      data.nftAddress,
                      setIsOpenTransaction,
                      contracts?.ERC1155_ROUTER_ADDRESS || ""
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
      {dataTradingAdd && (
        <ModalConfirmAddLiquidity
          isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity}
          isOpenTransaction={isOpenTransaction}
          isFetching={isFetchingAdd}
          setIsOpenTransaction={setIsOpenTransaction}
          data={data}
          amountErcDesired={dataTradingAdd?.amountETHDecimals}
          tokenAddress={data.tokenAddress}
          nftAddress={data.nftAddress}
          idNFT={data.nftID}
          setIsOpenConfirmAddLiquidity={setIsOpenConfirmAddLiquidity}
          inputNFT={inputNFT}
          setInputNFT={setInputNFT}
          setIsOpenLiquidity={setIsOpenLiquidity}
          setInputToken={setInputToken}
          setHash={setHash}
          setIsOpenSuccess={setIsOpenSuccess}
          setIsOpenError={setIsOpenError}
        />
      )}
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </Wrapper>
  );
};

export default ModalAddLiquidity;
