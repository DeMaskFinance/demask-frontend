import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import { SkeletonItemTransaction } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationToken from "@/hooks/useInformationToken";
import {
  collectionListSell,
  fetchDataSellNFTs,
} from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import NFTGrid from "./NFTsGrids";
import useFee from "@/hooks/useFee";
const Sell = () => {
  const { account, chainId, demask, wallet, slippage } =
    useContext(AccountContext);
  const [isOpenSellNFT, setIsOpenSellNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [idNFT, setIdNFT] = useState<number[]>([]);
  const [isOpenSuccessSell, setIsOpenSuccessSell] = useState<boolean>(false);
  const [isOpenErrorSell, setIsOpenErrorSell] = useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [amountSellDec, setAmountSellDec] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const collectionAddress = useRouter().query.collection as string;
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
    hasNextPage,
  } = useInfiniteQuery(
    ["collectionNFTSell", chainId, account, collectionAddress],
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

  const dmlToken = useDMLToken(
    account,
    collectionAddress,
    nativeAddress,
    wallet,
    demask.FACTORY_721,
    "",
    isOpenTransaction
  );

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
  const { amountTokenSell } = useAmountOutMin(
    "",
    dmlToken,
    nativeAddress,
    collectionAddress,
    idNFT,
    wallet,
    account,
    rpc,
    routerAddress,
    true
  );
  const { totalFee } = useFee(
    amountTokenSell,
    dmlToken,
    wallet,
    account,
    rpc,
    demask.FEE_MANAGER,
    true
  );
  useEffect(() => {
    if (data && amountTokenSell) {
      setAmountSellDec((amountTokenSell - totalFee) * (1 - slippage / 100));
    } else {
      setAmountSellDec(0);
    }
  }, [data, slippage, amountTokenSell]);
  console.log(totalFee, amountSellDec, amountTokenSell);

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
  const handleSell = () => {
    setIsOpenSellNFT(true);
    document.body.style.overflowY = "hidden";
  };
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const dataFake = {
    dmlAddress: dmlToken,
    tokenDecimals: "18",
  };
  return (
    <Fragment>
      {account ? (
        <Fragment>
          {isLoading ? (
            <div className="grid grid-cols-3 gap-6 mt-4 lg:grid-cols-4">
              <SkeletonItemTransaction />
            </div>
          ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
            <div className="flex flex-col ">
              <NFTGrid
                data={data}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                ref={ref}
                handleChoiceNFT={handleChoiceNFT}
                idNFT={idNFT}
              />
              <div className="absolute bottom-0 w-full">
                {idNFT.length > 0 && (
                  <ul className="flex flex-wrap px-4 py-2 text-sm bg-shader_600 text-shader_600 gap-x-4 bg-shader_700 border-shader_700 dark:text-white">
                    <li className="flex items-center">
                      Send:
                      <FormatNumber
                        number={(amountSellDec / 1e18).toString()}
                      />{" "}
                      <EtherIcon
                        width={18}
                        height={18}
                        className="fill-shader_600"
                      />
                    </li>
                    <li className="flex items-center">
                      Receive: {idNFT.length} NFTs
                    </li>
                    <li className="flex items-center">
                      Price:
                      <FormatNumber
                        number={(amountTokenSell / 1e18).toString()}
                      />{" "}
                      <EtherIcon
                        width={18}
                        height={18}
                        className="fill-shader_600"
                      />
                    </li>
                  </ul>
                )}
                {!isApprovedNFT ? (
                  <Button
                    className="w-full py-2"
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
                ) : (
                  <Button
                    disabled={
                      idNFT.length === 0 || Math.floor(amountSellDec) === 0
                    }
                    primary={
                      idNFT.length !== 0 && Math.floor(amountSellDec) !== 0
                    }
                    className="w-full py-4"
                    active={
                      idNFT.length === 0 || Math.floor(amountSellDec) === 0
                    }
                    onClick={handleSell}
                  >
                    SELL {idNFT.length} NFTs
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-4">No data available.</p>
          )}
        </Fragment>
      ) : (
        <Button
          className="absolute bottom-0 w-full py-2"
          primary
          onClick={handleOpen}
        >
          Connect Wallet
        </Button>
      )}
      {data && account && (
        <ModalSellNFT
          isOpenSellNFT={isOpenSellNFT}
          isOpenTransaction={isOpenTransaction}
          setIsOpenTransaction={setIsOpenTransaction}
          tokenAddress={nativeAddress}
          nftAddress={collectionAddress}
          idNFT={idNFT}
          routerAddress={routerAddress}
          /* 
          // @ts-ignore */
          data={dataFake}
          setIsOpenSellNFT={setIsOpenSellNFT}
          inputNFT={""}
          setInputNFT={setIdNFT}
          setHash={setHash}
          setIsOpenSuccess={setIsOpenSuccessSell}
          setIsOpenError={setIsOpenErrorSell}
        />
      )}
      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
      <ModalSuccess
        isOpenSuccess={isOpenSuccessSell}
        transactionHash={hash}
        type="Sell NFT Success"
        setIsOpenSuccess={setIsOpenSuccessSell}
      />
      <ModalError
        isOpenError={isOpenErrorSell}
        transactionHash={hash}
        type="Sell NFT Failed"
        setIsOpenError={setIsOpenErrorSell}
      />
    </Fragment>
  );
};

export default Sell;
