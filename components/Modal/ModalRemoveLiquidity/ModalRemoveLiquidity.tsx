import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import NFTGrid from "@/components/CreatedCollection/TransactionCollection/NFTsGrids";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useTotalSupply from "@/hooks/useTotalSupply";
import { fetchDataBuyNFTs } from "@/libs/service/collectionService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirmRemoveLiquidity from "../ModalConfirmRemoveLiquidity";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
interface ModalRemoveLiquidityProps {
  data: DataBase;
  routerAddress: string;
  type: string;
  isERC721: boolean;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
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
}) => {
  const [inputLiquidity, setInputLiquidity] = useState<any>("");
  const [activeChoice, setActiveChoice] = useState<string>("");
  const [isSufficientLiquidity, setIsSufficientLiquidity] =
    useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [showRequiredMessage, setShowRequiredMessage] = useState(false);
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [amountTokenMin, setAmountTokenMin] = useState("");
  const [amountTokenDec, setAmountTokenDec] = useState("");
  const [amountNFTMin, setAmountNFTMin] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenConfirmRemoveLiquidity, setIsOpenConfirmRemoveLiquidity] =
    useState<boolean>(false);
  const { account, wallet, slippage, chainId } = useContext(AccountContext);
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";
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
  const handleGetLiquidity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLiquidity(e.target.value);
    setShowRequiredMessage(false);
    setActiveChoice("");
    if (Number(e.target.value) > Number(balanceOfDML)) {
      setIsSufficientLiquidity(true);
    } else {
      setIsSufficientLiquidity(false);
    }
  };

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
    isRefetching,
    isSuccess,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["collectionNFTBUY", chainId, collectionAddress],
    queryFn: async () => {
      const res = await fetchDataBuyNFTs(collectionAddress, chainId);
      return res;
    },
  });
  const handleChoiceNFT = (item: any) => {
    const isExist = idNFT.includes(Number(item.nftID));
    if (isExist) {
      const arr = idNFT.filter((itemArr) => {
        return itemArr !== Number(item.nftID);
      });
      setIdNFT(arr);
    } else if (+amountNFTMin > idNFT.length) {
      setIdNFT([...idNFT, Number(item.nftID)]);
    }
  };

  return (
    <Fragment>
      <div className="h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg relative">
        <p className="title_modal">Remove Liquidity</p>
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
        {type === "erc721" && isSuccess && (
          <NFTGrid
            data={data721}
            isFetching={isFetching}
            handleChoiceNFT={handleChoiceNFT}
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
              <input
                className="input_item"
                inputMode="decimal"
                type="number"
                placeholder="Enter amount"
                value={inputLiquidity}
                onChange={handleGetLiquidity}
              />
              <TabGroups
                choices={["25%", "50%", "75%", "100%"]}
                activeChoice={activeChoice}
                onChoiceChange={handleChoiceChange}
              />
            </div>
            {isSufficientLiquidity && (
              <p className="mb-2 ml-1 -mt-1 text-xs text-red" key="liquidity">
                Insufficient Liquidity balance
              </p>
            )}
            {showRequiredMessage && (
              <p className="mx-auto ml-3 -mt-3 text-xs text-red" key="emptyNFT">
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
                  Approve NFT
                </Button>
              )}
              {isApprovedNFT && (
                <div>
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalConfirmRemoveLiquidity
        routerAddress={routerAddress}
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
      />
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
    </Fragment>
  );
};

export default ModalRemoveLiquidity;
