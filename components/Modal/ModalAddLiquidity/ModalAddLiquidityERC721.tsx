import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/MediaNFT";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import useInformation from "@/hooks/useInformationToken";
import {
  collectionListBuy,
  collectionListSell,
  fetchDataSellNFTs,
} from "@/libs/service/collectionService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import formatNumber from "@/libs/utils/formatNumer";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import "react-toastify/dist/ReactToastify.css";
import ModalDocument from "../ModalLength/ModalDocument";
import { ModalTransation } from "../ModalTransation";
import { ModalWallet } from "../ModalWallet";
import Wrapper from "../Wrapper";
import { ModalConfirmAddLiquidityERC721 } from "../ModalConfirmAddLiquidity";
import { useInView } from "react-intersection-observer";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import NFTGrid from "@/components/CreatedCollection/TransactionCollection/NFTsGrids";
interface ModalAddLiquidityERC721Props {
  isOpenAddLiquidity: boolean;
  setIsOpenLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenError: React.Dispatch<React.SetStateAction<boolean>>;
  setHash: React.Dispatch<React.SetStateAction<string>>;
}

const ModalAddLiquidityERC721: React.FunctionComponent<
  ModalAddLiquidityERC721Props
> = ({
  isOpenAddLiquidity,
  setIsOpenLiquidity,
  setHash,
  setIsOpenSuccess,
  setIsOpenError,
}) => {
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const { demask, account, wallet, slippage, chainId } =
    useContext(AccountContext);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
    FACTORY: factoryAddress,
  } = demask;
  const { ref, inView } = useInView();
  const collectionAddress = useRouter().query.collection as string;
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
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenLiquidity(false);
  };

  const { balanceToken, bigNumberBalance, allowanceToken } = useInformation(
    account,
    nativeAddress,
    wallet,
    routerAddress,
    rpc,
    nativeAddress,
    isOpenTransaction
  );

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    hasNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["collectionNFTSell", chainId, collectionAddress, account],
    ({ pageParam = 1 }) =>
      fetchDataSellNFTs(collectionAddress, pageParam, chainId, account),
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
  const handleGetToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(e.target.value);
    if (Number(e.target.value) > Number(balanceToken)) {
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };
  console.log(inputToken, dmlToken);

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
    <Wrapper isOpen={isOpenAddLiquidity} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-4 relative">
          <div className="title_modal">Add Liquidity</div>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
              <SkeletonItemTransaction />
            </div>
          ) : (
            <NFTGrid
              data={data}
              isFetching={isFetching}
              hasNextPage={hasNextPage}
              ref={ref}
              handleChoiceNFT={handleChoiceNFT}
              idNFT={idNFT}
            />
          )}
          <div>
            <div className="relative">
              <div>
                <div>
                  <div className="flex justify-between mb-4 text-shader_600">
                    <p className="font-semibold">Token</p>
                    <p>Balance: {formatNumber(balanceToken)}</p>
                  </div>
                  <div className="mb-4">
                    {dmlToken ===
                    "0x0000000000000000000000000000000000000000" ? (
                      <input
                        className="input_item"
                        type="number"
                        placeholder="Input amount Token"
                        value={inputToken}
                        onChange={handleGetToken}
                      />
                    ) : (
                      <div>
                        {data ? (
                          <div className="input_item">
                            {amountErcDesiredToDec}
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
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="inputToken"
                    >
                      Insufficient Token balance
                    </p>
                  )}
                  {Math.floor(amountErcDesired) === 0 && idNFT.length > 0 && (
                    <p className="mt-2 ml-2 text-xs text-red" key="inputNFT">
                      Can't add liquidity
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {isApprovedNFT ? (
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
                  ADD LIQUIDITY
                </Button>
              ) : (
                <Button
                  className="w-[126px] py-2 mx-auto"
                  primary
                  onClick={() =>
                    handleApproveNFT(
                      account,
                      wallet,
                      collectionAddress,
                      setIsOpen,
                      setIsOpenTransaction,
                      routerAddress
                    )
                  }
                >
                  APPROVE NFT
                </Button>
              )}
            </div>
          </div>
        </div>
        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red text-white cursor-pointer" />
        </button>
      </div>
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalConfirmAddLiquidityERC721
        isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity}
        isOpenTransaction={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        tokenAddress={demask.NATIVE_ADDRESS}
        nftAddress={collectionAddress}
        idNFT={""}
        inputNFT={idNFT}
        inputToken={inputToken}
        setIdNFT={setIdNFT}
        setInputToken={setInputToken}
        setIsOpenConfirmAddLiquidity={setIsOpenConfirmAddLiquidity}
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

export default ModalAddLiquidityERC721;
