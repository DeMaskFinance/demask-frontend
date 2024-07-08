import abiDML from "@/abi/abiDML.json";
import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import NFTGrid from "@/components/CreatedCollection/TransactionCollection/NFTsGrids";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import useAllowanceDML from "@/hooks/useAllowanceDML";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useTotalSupply from "@/hooks/useTotalSupply";
import { getProvider } from "@/libs/connection/getProvider";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import { replaceDot } from "@/libs/utils/formatComon";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirmRemoveLiquidity from "../ModalConfirmRemoveLiquidity";
import { ModalTransation } from "../ModalTransation";
interface ModalRemoveLiquidityProps {
  data: DataBase;
  routerAddress: string;
  type: string;
  isERC721: boolean;
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
  isERC721,
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
  const [amountTokenMin, setAmountTokenMin] = useState("");
  const [amountTokenDec, setAmountTokenDec] = useState("");
  const [amountNFTMin, setAmountNFTMin] = useState("");
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isApprovedLiquidity, setIsApprovedLiquidity] =
    useState<boolean>(false);
  const [isOpenConfirmRemoveLiquidity, setIsOpenConfirmRemoveLiquidity] =
    useState<boolean>(false);
  const { account, wallet, slippage, chainId } = useContext(AccountContext);
  const router = useRouter();
  const collectionAddress = (router.query.erc as string) || "";
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
    setIdNFT([]);
  };

  const { balanceOfDML } = useBananceOfDML(
    account,
    data.dmlAddress,
    wallet,
    isOpenTransaction
  );
  const currentAllowance = useAllowanceDML(
    account,
    data.dmlAddress,
    wallet,
    isOpenTransaction,
    inputLiquidity,
    routerAddress
  );
  const handleGetLiquidity = (values: NumberFormatValues) => {
    const { value } = values;
    const inputValue = replaceDot(value);
    setInputLiquidity(inputValue);
    setShowRequiredMessage(false);
    // setActiveChoice("");
    if (Number(inputValue) > Number(balanceOfDML)) {
      setIsSufficientLiquidity(true);
    } else {
      setIsSufficientLiquidity(false);
    }
  };

  const handleApproveDML = async () => {
    const providerChoice = await getProvider(wallet);
    const provider = new ethers.providers.Web3Provider(providerChoice);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(data.dmlAddress, abiDML, signer);
    const inputLiquidityBN = new BigNumber(inputLiquidity)
      .times(new BigNumber(10).pow(Number(data.dmlDecimals)))
      .toFixed(0);

    try {
      const result = await contract.approve(routerAddress, inputLiquidityBN);
      setIsOpenTransaction(true);
      await provider.waitForTransaction(result.hash);
      setIsOpenTransaction(false);
    } catch (error) {
      setIsOpenTransaction(false);
      console.error(error);
    }
  };
  useEffect(() => {
    const checkApproveToken = async () => {
      if (
        currentAllowance &&
        Number(currentAllowance) <
          Number(
            Number(
              handleBignumber(Number(inputLiquidity), Number(data.dmlDecimals))
            ).toFixed(0)
          )
      ) {
        setIsApprovedLiquidity(false);
      } else {
        setIsApprovedLiquidity(true);
      }
    };
    checkApproveToken();
  }, [account, wallet, inputLiquidity, currentAllowance, isOpenTransaction]);
  useEffect(() => {
    if (balanceOfDML && activeChoice !== "" && activeChoice !== "0%") {
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
        Number(balanceOfDML) * liquidityPercentage
      ).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 18,
      });

      setInputLiquidity(calculatedLiquidity);
      setShowRequiredMessage(false);
      setIsSufficientLiquidity(false);
    }
  }, [balanceOfDML, activeChoice]);
  const totalSupply = useTotalSupply(
    account,
    wallet,
    data.dmlAddress,
    isOpenTransaction
  );

  useEffect(() => {
    if (data && inputLiquidity) {
      const amountLIQUIDITY = handleBignumber(
        Number(inputLiquidity),
        Number(data.dmlDecimals)
      );
      const resAmountNFT =
        (Number(amountLIQUIDITY) * Number(data.reserveNFT)) /
        Number(totalSupply);
      const amountToken =
        (Number(amountLIQUIDITY) * Number(data.reserveTokenDecimals)) /
        Number(totalSupply);
      const resAmountToken =
        (Number(amountLIQUIDITY) * Number(data.reserveTokenDecimals)) /
          Number(totalSupply) +
        (((Number(amountLIQUIDITY) * Number(data.reserveNFT)) %
          Number(totalSupply)) *
          (Number(data.reserveTokenDecimals) -
            Number(amountToken.toFixed(0)))) /
          ((Number(data.reserveNFT) - Math.floor(Number(resAmountNFT))) *
            Number(totalSupply));
      const resAmountTokenMinShow = divideByDecimal(
        resAmountToken.toString(),
        data.dmlDecimals
      );
      const resAmountNFTMin = Math.floor(
        Number(resAmountNFT * (1 - slippage / 100))
      );
      const resAmountTokenMin = Math.floor(
        Number(resAmountToken * (1 - slippage / 100))
      );
      setAmountNFTMin(resAmountNFTMin.toString());
      setAmountTokenMin(Math.floor(resAmountTokenMin).toString());
      setAmountTokenDec(resAmountTokenMinShow);
    }
  }, [inputLiquidity, data]);

  const handleRemoveLiquidity = () => {
    if (inputLiquidity === "") {
      setShowRequiredMessage(true);
    } else if (!isSufficientLiquidity && Number(amountTokenMin) > 0) {
      setIsOpenConfirmRemoveLiquidity(true);
    }
  };

  const {
    isLoading,
    data: data721,
    isSuccess,
    isFetching,
  } = useQuery({
    queryKey: ["collectionNFTBUY", chainId, collectionAddress],
    queryFn: async () => {
      const res = await fetchDataBuyNFTs(collectionAddress, chainId);
      return res;
    },
  });

  return (
    <Fragment>
      <div className="h-fit w-[360px] md:w-[400px] lg:w-[500px] rounded-lg relative">
        <p className="title_modal">Remove Liquidity</p>
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
              <p className="text-sm font-semibold text-primary_300">ABU/ETH</p>
            </div>
          </div>
        )}
        {type === "erc721" && isSuccess && (
          <NFTGrid
            data={data721}
            isFetching={isFetching}
            setIdNFT={setIdNFT}
            idNFT={idNFT}
            isSearch={false}
          />
        )}
        <div>
          <div className="relative">
            <div className="flex justify-between my-4 ">
              <p className="font-semibold text-primary_400">Liquidity</p>
              <div className="flex items-center font-bold text-white gap-x-1">
                <FormatNumber number={balanceOfDML} />
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
              <p className="mb-2 ml-1 mt-1 text-xs text-red" key="liquidity">
                Insufficient Liquidity balance
              </p>
            )}
            {showRequiredMessage && (
              <p className="mx-auto ml-3 mt-2 text-xs text-red" key="emptyNFT">
                Required
              </p>
            )}
          </div>
          <div>
            <div className="flex justify-between my-4 font-semibold input_item bg-primary_500 bg-opacity-10">
              NFT Receive
              <div className="flex items-center justify-between gap-x-1">
                {data.reserveTokenDecimals ? (
                  <p>{amountNFTMin}</p>
                ) : (
                  <BiLoaderAlt className="text-3xl animate-spin text-primary_400" />
                )}
                <NFTIcon width={16} height={16} />
              </div>
            </div>
            <div className="flex justify-between my-4 font-semibold input_item bg-primary_500 bg-opacity-10">
              Total Liquidity
              <div className="flex items-center justify-between gap-x-1">
                <FormatNumber number={amountTokenDec} />
                <EtherIcon width={16} height={16} />
              </div>
            </div>
            {Number(amountTokenMin) < 1 && inputLiquidity && (
              <p className="my-2 ml-3 text-xs text-red" key="inputNFT">
                Can't remove liquidity
              </p>
            )}
            <div className="flex justify-center">
              {!isApprovedLiquidity ? (
                <Button
                  className="w-[126px] py-2 mx-auto"
                  primary
                  onClick={handleApproveDML}
                >
                  Approve
                </Button>
              ) : (
                <>
                  {isERC721 ? (
                    <Button
                      className="p-2 mx-auto"
                      primary={+amountNFTMin === idNFT.length}
                      active={+amountNFTMin !== idNFT.length}
                      disabled={+amountNFTMin !== idNFT.length}
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
      <ModalConfirmRemoveLiquidity
        routerAddress={routerAddress}
        isOpenConfirmRemoveLiquidity={isOpenConfirmRemoveLiquidity}
        setIsOpenConfirmRemoveLiquidity={setIsOpenConfirmRemoveLiquidity}
        isOpenTransaction={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        data={data}
        idNFT={idNFT}
        inputLiquidity={inputLiquidity}
        totalSupply={totalSupply}
        setInputLiquidity={setInputLiquidity}
        setHash={setHash}
        setIsOpenSuccess={setIsOpenSuccess}
        setIsOpenError={setIsOpenError}
        closeModal={closeModal}
      />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
      />
    </Fragment>
  );
};

export default ModalRemoveLiquidity;
