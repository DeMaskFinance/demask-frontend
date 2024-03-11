import { Button } from "@/components/Buttons";
import ModalConfirmAddLiquidityERC721 from "@/components/Modal/ModalConfirmAddLiquidityERC721";
import {
  ModalError,
  ModalSuccess,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import useDMLToken from "@/hooks/useDMLToken";
import useInformationDML from "@/hooks/useInformationDML";
import useInformationToken from "@/hooks/useInformationToken";
import { getProvider } from "@/libs/connection/getProvider";
import { swapAPI } from "@/libs/service";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import handleApproveNFT from "@/libs/utils/handleApproveNFT";
import handleBignumber from "@/libs/utils/handleBignumber";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import abiDML from "@/abi/abiDML.json";
import ModalRemmoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
};
const Pool = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const [isOpenSuccessRemove, setIsOpenSuccessRemove] =
    useState<boolean>(false);
  const [isOpenErrorRemove, setIsOpenErrorRemove] = useState<boolean>(false);
  const [isOpenRemoveLiquidity, setIsOpenRemoveLiquidity] =
    useState<boolean>(false);
  const { account, wallet, chainId, demask, slippage } =
    useContext(AccountContext);
  const collectionAddress = "0x286e08EEb3169042585B4838378D21d2c23ded55";
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
  console.log(dmlToken);

  useEffect(() => {
    const checkApproveNFT = async () => {
      const result = await ercContract.approveNFT(
        account,
        wallet,
        "0x286e08EEb3169042585B4838378D21d2c23ded55",
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
  const handleAddLiquidity = () => {
    if (!isSufficientToken) {
      setIsOpenConfirmAddLiquidity(true);
    } else {
      console.log({
        isSufficientToken,
      });
    }
  };

  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const dataFake = {
    reserveNFT: "5",
    reserveTokenDecimals: "18",
    dmlAddress: "0x21bCd1e6aEBb64ba33F23A871D0d58Fbd7A95B45",
    dmlDecimals: "18",
    nftAddress: "0x286e08EEb3169042585B4838378D21d2c23ded55",
    nftID: [1, 2],
  };
  const handleRemoveLiquidity = () => {
    setIsOpenRemoveLiquidity(true);
    document.body.style.overflowY = "hidden";
  };
  return (
    <div>
      {!account ? (
        <Button className="w-[144px] py-2" primary onClick={handleOpen}>
          CONNECT WALLET
        </Button>
      ) : !isApprovedNFT ? (
        <Button
          className="w-[126px] py-2"
          primary
          onClick={() =>
            handleApproveNFT(
              account,
              wallet,
              "0x286e08EEb3169042585B4838378D21d2c23ded55",
              setIsOpen,
              setIsOpenTransaction,
              routerAddress
            )
          }
        >
          APPROVE NFT
        </Button>
      ) : (
        <div>
          {dmlToken === "0x0000000000000000000000000000000000000000" ? (
            <input
              className={styles.inputItem}
              type="number"
              placeholder="Input amount Token"
              value={inputToken}
              onChange={handleGetToken}
            />
          ) : (
            <div>
              <div className={styles.inputItem}>{amountErcDesiredToDec}</div>
              {/* {data ? (
                
              ) : (
                <div className={styles.inputItem}>
                  <BiLoaderAlt className="text-3xl animate-spin text-secondary5" />
                </div>
              )} */}
            </div>
          )}
          {isSufficientToken && (
            <p className="mb-2 ml-3 -mt-1 text-xs text-red" key="inputNFT">
              Insufficient Token balance
            </p>
          )}
          <Button
            className="w-[144px] py-2"
            primary
            onClick={handleAddLiquidity}
          >
            Create pool
          </Button>
          <Button
            className="w-[144px] py-2"
            primary
            onClick={handleRemoveLiquidity}
          >
            Remove pool
          </Button>
        </div>
      )}

      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
      <ModalConfirmAddLiquidityERC721
        isOpenConfirmAddLiquidity={isOpenConfirmAddLiquidity}
        isOpenTransaction={isOpenTransaction}
        setIsOpenTransaction={setIsOpenTransaction}
        tokenAddress={demask.NATIVE_ADDRESS}
        nftAddress={collectionAddress}
        idNFT={""}
        inputNFT={inputNFT}
        data={data}
        inputToken={inputToken}
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
      <ModalSuccess
        isOpenSuccess={isOpenSuccess}
        transactionHash={hash}
        type="Add Liquidity Success"
        setIsOpenSuccess={setIsOpenSuccess}
      />
      <ModalError
        isOpenError={isOpenError}
        transactionHash={hash}
        type="Add Liquidity Failed"
        setIsOpenError={setIsOpenError}
      />
      {data && account && (
        <>
          <ModalRemmoveLiquidity
            /* 
          // @ts-ignore */
            data={dataFake}
            routerAddress={routerAddress}
            isOpenRemoveLiquidity={isOpenRemoveLiquidity}
            setIsOpenRemoveLiquidity={setIsOpenRemoveLiquidity}
            setHash={setHash}
            setIsOpenSuccess={setIsOpenSuccessRemove}
            setIsOpenError={setIsOpenErrorRemove}
          />
          <ModalSuccess
            isOpenSuccess={isOpenSuccessRemove}
            transactionHash={hash}
            type="Remove Liquidity Success"
            setIsOpenSuccess={setIsOpenSuccessRemove}
          />
          <ModalError
            isOpenError={isOpenErrorRemove}
            transactionHash={hash}
            type="Remove Liquidity Failed"
            setIsOpenError={setIsOpenErrorRemove}
          />
        </>
      )}
    </div>
  );
};

export default Pool;
