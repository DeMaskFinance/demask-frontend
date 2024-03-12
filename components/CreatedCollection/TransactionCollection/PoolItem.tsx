import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import {
  ModalError,
  ModalSuccess,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import AccountContext from "@/context/AccountContext";
import React, { useContext, useEffect, useState } from "react";
import ModalRemmoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
import ercContract from "@/libs/utils/erc/erc.contract";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import getRewardDML from "@/libs/utils/getReward";

const PoolItem = () => {
  const { account, wallet, chainId, demask, slippage } =
    useContext(AccountContext);
  const [isOpenConfirmAddLiquidity, setIsOpenConfirmAddLiquidity] =
    useState<boolean>(false);
  const [isOpenRemoveLiquidity, setIsOpenRemoveLiquidity] =
    useState<boolean>(false);
  const [isOpenTransaction, setIsOpenTransaction] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isOpenSuccess, setIsOpenSuccess] = useState<boolean>(false);
  const [isOpenError, setIsOpenError] = useState<boolean>(false);
  const [isOpenSuccessRemove, setIsOpenSuccessRemove] =
    useState<boolean>(false);
  const [isOpenErrorRemove, setIsOpenErrorRemove] = useState<boolean>(false);
  const [reward, setReward] = useState("");
  const [isOpenSuccessCollect, setIsOpenSuccessCollect] =
    useState<boolean>(false);
  const [isOpenErrorCollect, setIsOpenErrorCollect] = useState<boolean>(false);
  const { ROUTER_721: routerAddress, NATIVE_ADDRESS: nativeAddress } = demask;
  const handleAddLiquidity = () => {
    setIsOpenConfirmAddLiquidity(true);
  };
  const handleRemoveLiquidity = () => {
    setIsOpenRemoveLiquidity(true);
    document.body.style.overflowY = "hidden";
  };
  const data = {
    reserveNFT: "5",
    reserveTokenDecimals: "18",
    dmlAddress: "0x21bCd1e6aEBb64ba33F23A871D0d58Fbd7A95B45",
    dmlDecimals: "18",
    nftAddress: "0x286e08EEb3169042585B4838378D21d2c23ded55",
    nftID: [1, 2],
  };
  const dmlTokenLiquidity = "0x21bCd1e6aEBb64ba33F23A871D0d58Fbd7A95B45";
  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && dmlTokenLiquidity && data) {
        const result = await ercContract.viewReward(
          dmlTokenLiquidity,
          account,
          wallet
        );
        const rewardDec = divideByDecimal(result.toString(), data.dmlDecimals);
        setReward(rewardDec);
      } else {
        setReward("0");
      }
    };
    fetchDataReward();
  }, [dmlTokenLiquidity, account, data]);
  console.log(reward);
  const handleGetReward = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (account && dmlTokenLiquidity && wallet) {
      getRewardDML({
        wallet,
        dmlTokenLiquidity,
        account,
        data: {
          dmlDecimals: data.dmlDecimals,
          tokenAddress: nativeAddress,
        },
        setReward,
        setIsOpenTransaction,
        setIsOpenSuccessCollect,
        setIsOpenErrorCollect,
        setHash,
      });
    } else {
      console.log("No account and DML");
    }
  };
  return (
    <div className="p-4 border rounded-lg border-dark3">
      <div className="flex justify-between ">
        <p className="text-xl font-semibold text-dark0">
          The Buns - Hefty Hares
        </p>
        <div className="flex gap-x-4">
          <Button className="py-2" active onClick={handleAddLiquidity}>
            Create
          </Button>
          <Button className="py-2" active onClick={handleRemoveLiquidity}>
            Remove
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center text-sm ">
          <div className="flex items-center mr-2">
            <span>LP:</span>
            <FormatNumber number={"76"} />
            <NFTIcon width={24} height={24} className="fill-dark2 ml-[2px]" />
          </div>
          <FormatNumber number={"23"} />
          <span>
            <EtherIcon
              width={20}
              height={20}
              className="fill-dark2 ml-[-1px]"
            />
          </span>
          <div>(20%)</div>
        </div>
        <div className="flex items-center justify-between my-2">
          <div className="flex">
            <span className="flex items-center">
              Reward:
              {reward ? (
                <div className="ml-2">
                  <FormatNumber number={reward} />
                </div>
              ) : (
                <p className="w-10 h-4 rounded-full animate-pulse bg-slate-200"></p>
              )}
            </span>
            {/* {reward ? (
              <div className="ml-2">
                <FormatNumber number={reward} />
              </div>
            ) : (
              <p className="w-10 h-4 rounded-full animate-pulse bg-slate-200"></p>
            )} */}
            <span>
              <EtherIcon
                width={20}
                height={20}
                className="fill-dark2 ml-[-1px]"
              />
            </span>
          </div>
          <Button
            className="px-6 py-2 text-sm font-medium text-white transition-all duration-150 ease-linear border rounded-lg bg-green hover:bg-white hover:text-green boder-white hover:border-green"
            onClick={handleGetReward}
          >
            COLLECT
          </Button>
        </div>
      </div>
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
      <ModalSuccess isOpenSuccess={isOpenSuccessCollect} transactionHash={hash} type="Collect Reward Success" setIsOpenSuccess={setIsOpenSuccessCollect} />
      <ModalError isOpenError={isOpenErrorCollect} transactionHash={hash} type="Collect Reward Failed" setIsOpenError={setIsOpenErrorCollect} />
      {data && account && (
        <>
          <ModalRemmoveLiquidity
            /* 
          // @ts-ignore */
            data={data}
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

export default PoolItem;
