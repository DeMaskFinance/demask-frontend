import { Button } from "@/components/Buttons";
import { LightBulbIcon } from "@/components/Icons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { swapAPI } from "@/libs/service";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import PoolItem from "./PoolItem";
import { ModalAddLiquidityERC721 } from "@/components/Modal/ModalAddLiquidityERC721";
import { ModalError, ModalSuccess } from "@/components/Modal/ModalTransation";
import { useRouter } from "next/router";

const Pool = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenSuccessAdd, setIsOpenSuccessAdd] = useState<boolean>(false);
  const [isOpenErrorAdd, setIsOpenErrorAdd] = useState<boolean>(false);
  const [isApprovedNFT, setIsApprovedNFT] = useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  const [inputNFT, setInputNFT] = useState<number>(2);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const [amountErcDesired, setAmountErcDesired] = useState<any>();
  const [amountErcDesiredToDec, setAmountErcDesiredToDec] = useState<any>("0");
  const [amountTokenMin, setAmountTokenMin] = useState<number>(0);
  const [hash, setHash] = useState<string>("");
  const [isOpenAddLiquidity, setIsOpenAddLiquidity] = useState<boolean>(false);
  const { account, wallet, chainId, demask, slippage } =
    useContext(AccountContext);
  const collectionAddress = useRouter().query.created as string;
  const {
    ROUTER_721: routerAddress,
    RPC: rpc,
    NATIVE_ADDRESS: nativeAddress,
    FACTORY: factoryAddress,
  } = demask;
  const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ["liquidity"],
    queryFn: async () => {
      try {
        const res = await swapAPI(
          "0x6c216dfafc944c46582a34d9f87532d00080c61a",
          "5",
          "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
          "9866084186"
        );
        if (res) {
          return res;
        } else {
          throw new Error("Invalid data from API");
        }
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
    keepPreviousData: true,
  });
  const { allowanceToken, bigNumberBalance, balanceToken } =
    useInformationToken(
      account,
      nativeAddress,
      wallet,
      routerAddress,
      rpc,
      nativeAddress,
      isOpenTransaction
    );

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
  }, [account, wallet, isOpenTransaction]);

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

  useEffect(() => {
    let amountErcDesired;
    let amountTokenMin;
    if (dmlToken !== "0x0000000000000000000000000000000000000000" && inputNFT) {
      amountErcDesired = (Number(inputNFT) * +reserveToken) / +reserveNFT;
      amountTokenMin =
        ((Number(inputNFT) * +reserveToken) / +reserveNFT) *
        (1 + slippage / 100);
    } else {
      amountErcDesired = handleBignumber(Number(inputToken), 18);
      amountTokenMin = handleBignumber(Number(inputToken), 18);
    }
    setAmountErcDesired(amountErcDesired);
    setAmountTokenMin(amountTokenMin);
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
  }, [inputToken, reserveToken, reserveNFT, dmlToken, inputNFT]);

  const handleGetToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(e.target.value);
    if (Number(e.target.value) > Number(balanceToken)) {
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };

  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };

  return (
    <div className="h-full text-dark3">
      <div className="flex px-6 py-4 my-4 rounded-lg bg-dark5 ">
        <LightBulbIcon width={24} height={24} className=" fill-yellow" />
        <p>Pools accrue trading fees towards depositors.</p>
      </div>
      {!account ? (
        <Button
          className="flex items-end w-full py-2"
          primary
          onClick={handleOpen}
        >
          CONNECT WALLET
        </Button>
      ) : (
        <PoolItem />
      )}

      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      {data && account && (
        <>
          <ModalAddLiquidityERC721
            data={data}
            isOpenAddLiquidity={isOpenAddLiquidity}
            setIsOpenLiquidity={setIsOpenAddLiquidity}
            setHash={setHash}
            setIsOpenSuccess={setIsOpenSuccessAdd}
            setIsOpenError={setIsOpenErrorAdd}
          />
          <ModalSuccess
            isOpenSuccess={isOpenSuccessAdd}
            transactionHash={hash}
            type="Add Liquidity Success"
            setIsOpenSuccess={setIsOpenSuccessAdd}
          />
          <ModalError
            isOpenError={isOpenErrorAdd}
            transactionHash={hash}
            type="Add Liquidity Failed"
            setIsOpenError={setIsOpenErrorAdd}
          />
        </>
      )}
    </div>
  );
};

export default Pool;
