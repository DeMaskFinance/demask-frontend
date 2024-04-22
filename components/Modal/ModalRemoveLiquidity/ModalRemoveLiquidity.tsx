import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import useTotalSupply from "@/hooks/useTotalSupply";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalConfirmRemoveLiquidity from "../ModalConfirmRemoveLiquidity";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import ercContract from "@/libs/utils/erc/erc.contract";
import { collectionListBuy } from "@/libs/service/collectionService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import MediaNFT from "@/components/Common/MediaNFT";
import ModalDocument from "../ModalLength/ModalDocument";
import { useInView } from "react-intersection-observer";
interface ModalRemoveLiquidityProps {
  isOpenRemoveLiquidity: boolean;
  data: DataBase;
  routerAddress: string;
  type: string;
  isERC721: boolean;
  setIsOpenRemoveLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalRemoveLiquidity: React.FunctionComponent<
  ModalRemoveLiquidityProps
> = ({
  isOpenRemoveLiquidity,
  data,
  routerAddress,
  type,
  isERC721,
  setIsOpenRemoveLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const [inputLiquidity, setInputLiquidity] = useState<any>("");
  const [activeChoice, setActiveChoice] = useState<string>("0%");
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
  const { ref, inView } = useInView();
  const collectionAddress =
    useRouter().query.collection ||
    ("0x58d8D129a641A60976d5a4d81Fa3C8F1F3f44DEd" as string);
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenRemoveLiquidity(false);
  };
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
  const fetchDataNFTs = async (
    collectionAddress: string | string[],
    pageParam = 1,
    chain: string | string[]
  ) => {
    const data = await collectionListBuy(
      collectionAddress,
      chain,
      pageParam,
      10
    );
    return data.data;
  };

  const {
    data: data721,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["collectionNFTBUY", chainId, collectionAddress],
    ({ pageParam = 1 }) => fetchDataNFTs(collectionAddress, pageParam, chainId),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  const hanldeChoiceNFT = (item: any) => {
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
    <Wrapper isOpen={isOpenRemoveLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-4 relative">
          <p className="title_modal">
            Remove
            {data && (
              <div className="flex items-center leading-[16px] ml-1">
                <span> {data?.metadata?.symbol}</span>
                <span className="overflow-hidden">/</span>
                <span>ETH</span>
              </div>
            )}
          </p>
          {type === "erc721" && isSuccess && (
            <div className="grid grid-cols-3 pb-[34px] gap-3 mt-4 overflow-y-scroll md:grid-cols-3 text-dark2 max-h-[200px] lg:max-h-[340px]">
              {data721?.pages.map((page: any, pageIndex: number) => (
                <Fragment key={pageIndex}>
                  {page?.data?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="relative"
                      onClick={() => hanldeChoiceNFT(item)}
                    >
                      <div
                        className={`relative items-center p-1 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:shadow-home dark:border-dark2 ${
                          idNFT.includes(Number(item.nftID))
                            ? "border-secondary5"
                            : ""
                        }`}
                      >
                        <div className="relative h-[78px] lg:h-[100px]">
                          <MediaNFT data={item} isControls={false} hover />
                        </div>
                        <div className="w-full">
                          <div className="flex w-full mt-2">
                            <div className="w-full">
                              <h6
                                title={item.metadata.name}
                                className="flex items-start gap-2 font-semibold uppercase"
                              >
                                <span className="flex-wrap max-w-full text-sm line-clamp-1">
                                  {item.metadata.name ? (
                                    <ModalDocument data={item.metadata.name} />
                                  ) : (
                                    <p>--</p>
                                  )}
                                </span>
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
              <div ref={ref} style={{ height: "1px" }}></div>
            </div>
          )}
          <div>
            <div className="relative">
              <div className="flex justify-between mb-4 text-dark2">
                <p className="font-semibold">Liquidity</p>
                <div className="flex">
                  Balance: <FormatNumber number={balanceOfDML} />
                </div>
              </div>
              <input
                className="input_item"
                inputMode="decimal"
                type="number"
                placeholder="Input amount Liquidity"
                value={inputLiquidity}
                onChange={handleGetLiquidity}
              />
              {isSufficientLiquidity && (
                <p className="mb-2 ml-1 -mt-1 text-xs text-red" key="liquidity">
                  Insufficient Liquidity balance
                </p>
              )}
              {showRequiredMessage && (
                <p
                  className="mx-auto ml-3 -mt-3 text-xs text-red"
                  key="emptyNFT"
                >
                  Required
                </p>
              )}
              <div className="mt-3">
                <TabGroups
                  choices={["25%", "50%", "75%", "100%"]}
                  activeChoice={activeChoice}
                  onChoiceChange={handleChoiceChange}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between my-4 text-dark2">
                <p className="font-semibold">You will recieve</p>
              </div>
              <div className="mb-4 input_item">
                <div className="flex justify-between">
                  {data.reserveTokenDecimals ? (
                    <p>{amountNFTMin}</p>
                  ) : (
                    <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                  )}
                  <p className="text-dark3">NFT</p>
                </div>
              </div>
              <div className="input_item">
                <div className="flex justify-between">
                  <FormatNumber number={amountTokenDec} />
                  <p className="text-dark3">{data.tokenSymbol}</p>
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
                    APPROVE NFT
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
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
        </button>
      </div>
      <ModalConfirmRemoveLiquidity
        isOpenConfirmRemoveLiquidity={isOpenConfirmRemoveLiquidity}
        routerAddress={routerAddress}
        isOpenTransaction={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        data={data}
        idNFT={idNFT}
        inputLiquidity={inputLiquidity}
        setIsOpenConfirmRemoveLiquidity={setIsOpenConfirmRemoveLiquidity}
        totalSupply={totalSupply}
        setInputLiquidity={setInputLiquidity}
        setIsOpenRemoveLiquidity={setIsOpenRemoveLiquidity}
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
    </Wrapper>
  );
};

export default ModalRemoveLiquidity;
