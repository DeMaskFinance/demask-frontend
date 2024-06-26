import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
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
import useFee from "@/hooks/useFee";
import { fetchDataSellNFTs } from "@/libs/service/collectionService";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import NFTGrid from "./NFTsGrids";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const Sell = () => {
  const { account, chainId, demask, wallet, slippage } =
    useContext(AccountContext);
  const [isOpenSellNFT, setIsOpenSellNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
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
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";
  const { data, isSuccess, isLoading, isFetching } = useQuery({
    queryKey: ["collectionNFTSell", chainId, collectionAddress, account],
    queryFn: async () => {
      const res = await fetchDataSellNFTs(collectionAddress, chainId, account);
      return res;
    },
  });

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
          ) : isSuccess && data?.data?.length > 0 ? (
            <div className="flex flex-col ">
              <NFTGrid
                data={data}
                isFetching={isFetching}
                handleChoiceNFT={handleChoiceNFT}
                idNFT={idNFT}
                isSearch
              />
              <div className="w-full mt-4">
                {idNFT.length > 0 && (
                  <ul className="text-sm text-shader_200">
                    <li className="flex items-center justify-between mb-1">
                      Receive: NFTs
                      <div className="flex items-center font-bold text-white gap-x-1">
                        {idNFT.length}
                        <NFTIcon width={16} height={16} />
                      </div>
                    </li>
                    <li className="flex items-center justify-between mb-4">
                      Price:
                      <div className="flex items-center font-bold text-white gap-x-1">
                        <FormatNumber
                          number={(amountTokenSell / 1e18).toString()}
                        />{" "}
                        <EtherIcon width={16} height={16} />
                      </div>
                    </li>
                    <li>
                      <div className="relative flex items-center justify-between w-full py-2 pl-2 mb-4 text-base font-semibold rounded-lg bg-primary_500 bg-opacity-10">
                        <div className="">Total Cost</div>
                        <div className="flex items-center px-2 py-1 text-white gap-x-1">
                          <FormatNumber
                            number={(amountTokenSell / 1e18).toString()}
                          />{" "}
                          <EtherIcon width={16} height={16} />
                        </div>
                      </div>
                    </li>
                  </ul>
                )}
                {!isApprovedNFT ? (
                  <Button
                    className="w-full py-4"
                    primary
                    onClick={() =>
                      handleApproveNFT(
                        account,
                        wallet,
                        collectionAddress,
                        setIsOpenTransaction,
                        routerAddress
                      )
                    }
                  >
                    Approve NFT
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="absolute bottom-0 w-full py-2" primary>
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[350px] p-0 border-none">
            <ModalWallet />
          </DialogContent>
        </Dialog>
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
      <ModalTransation
        isOpenTransation={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        isTransaction={true}
      />
      <ModalSuccess
        isOpenSuccess={isOpenSuccessSell}
        transactionHash={hash}
        type="Sell NFT"
        setIsOpenSuccess={setIsOpenSuccessSell}
      />
      <ModalError
        isOpenError={isOpenErrorSell}
        transactionHash={hash}
        type="Sell NFT"
        setIsOpenError={setIsOpenErrorSell}
      />
    </Fragment>
  );
};

export default Sell;
