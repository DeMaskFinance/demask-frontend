import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/MediaNFT";
import { EtherIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import ModalSellNFT from "@/components/Modal/ModalSellNFT";
import { ModalError, ModalSuccess } from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useAmountInMax from "@/hooks/useAmountInMax";
import useAmountOutMin from "@/hooks/useAmountOutMin";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationToken from "@/hooks/useInformationToken";
import { collectionListSell } from "@/libs/service/collectionService";
import { nftsUserService } from "@/libs/service/profileService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext, useEffect, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
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
  const [totalProcessSell, setTotalProcessSell] = useState<number>(0);
  const [isSufficientTokenSell, setIsSufficientTokenSell] =
    useState<boolean>(false);
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
  } = demask;
  const collectionAddress = "0x58d8D129a641A60976d5a4d81Fa3C8F1F3f44DEd";
  const [typeERC, setTypeERC] = useQueryParam(
    "typeERC",
    withDefault(StringParam, "")
  );
  const royaltyFee = 0;
  const { balanceToken, bigNumberBalance, allowanceToken } =
    useInformationToken(
      account,
      nativeAddress,
      wallet,
      routerAddress,
      rpc,
      nativeAddress,
      isOpenTransaction
    );
  const fetchDataNFTs = async (
    collectionAddress: string,
    pageParam = 1,
    chain: string | string[],
    account: string
  ) => {
    const data = await collectionListSell(
      account,
      collectionAddress,
      chain,
      pageParam,
      10
    );
    return data.data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["collectionNFTSell", chainId, account, collectionAddress],
    ({ pageParam = 1 }) =>
      fetchDataNFTs(collectionAddress, pageParam, chainId, account),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  console.log(data);

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
  const { amountTokenSell, isLoadingSell, feeTradingSell } = useAmountOutMin(
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
  console.log(amountTokenSell);

  useEffect(() => {
    if (Number(amountSellDec.toFixed()) > Number(bigNumberBalance)) {
      setIsSufficientTokenSell(false);
    } else {
      setIsSufficientTokenSell(true);
    }
  }, [account, amountSellDec, data, isOpenSellNFT]);
  useEffect(() => {
    if (data && amountTokenSell) {
      setAmountSellDec(
        amountTokenSell * (1 + slippage / 100) +
          (amountTokenSell * Number(royaltyFee)) / 100
      );
      setTotalProcessSell(
        Number(amountTokenSell) + (amountTokenSell * Number(royaltyFee)) / 100
      );
    } else {
      setAmountSellDec(0);
      setTotalProcessSell(0);
    }
  }, [data, slippage, amountTokenSell]);

  const hanldeChoiceNFT = (item: any) => {
    const isExist = idNFT.includes(Number(item.nftID));
    if (isExist) {
      const arr = idNFT.filter((itemArr) => {
        return itemArr !== Number(item.nftID);
      });
      console.log(arr);

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
    royaltyFee: royaltyFee,
    tokenDecimals: "18",
  };
  console.log(idNFT);

  return (
    <div>
      {isLoading ? (
        <div className="mt-4">
          <SkeletonCategory />
        </div>
      ) : isSuccess && data?.pages[0]?.data?.length > 0 ? (
        <div className="flex flex-col ">
          <div className="grid grid-cols-3 pb-[34px] gap-6 mt-4 overflow-y-scroll lg:grid-cols-5 md:grid-cols-3 text-dark2 max-h-[400px] lg:max-h-[542px]">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="relative overflow-hidden"
                    onClick={() => hanldeChoiceNFT(item)}
                  >
                    <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home">
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
                                <ModalDocument data={item.metadata.name} />
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
          </div>
          <div className="absolute bottom-0 w-full">
            {idNFT.length > 0 && (
              <ul className="p-2 text-white rounded-lg bg-dark1">
                <li className="flex items-center">
                  Send: 1.23{" "}
                  <EtherIcon width={18} height={18} className="fill-white" />
                </li>
                <li className="flex items-center">
                  Receive: {idNFT.length} NFTs
                </li>
                <li className="flex items-center">
                  Price: 1.23{" "}
                  <EtherIcon width={18} height={18} className="fill-white" />
                </li>
              </ul>
            )}
            {!account ? (
              <Button className="w-full py-2" primary onClick={handleOpen}>
                CONNECT WALLET
              </Button>
            ) : !isApprovedNFT ? (
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
                  idNFT.length === 0 ||
                  !isSufficientTokenSell ||
                  Math.floor(amountSellDec) === 0
                }
                primary={
                  idNFT.length !== 0 ||
                  isSufficientTokenSell ||
                  Math.floor(amountSellDec) !== 0
                }
                className="w-full py-4"
                active
                onClick={handleSell}
              >
                SELL {idNFT.length} NFTs
              </Button>
            )}
            {!isSufficientTokenSell && account && (
              <p className="text-xs text-red" key="Tokenbalance">
                Insufficient Token balance
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-4">No data available.</p>
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
    </div>
  );
};

export default Sell;
