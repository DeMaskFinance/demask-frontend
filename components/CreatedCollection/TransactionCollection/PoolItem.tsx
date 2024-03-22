import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { ModalAddLiquidityERC721 } from "@/components/Modal/ModalAddLiquidity";
import ModalRemmoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
import {
  ModalError,
  ModalSuccess,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import AccountContext from "@/context/AccountContext";
import { collectionListBuy, collectionListSell } from "@/libs/service/collectionService";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import getRewardDML from "@/libs/utils/getReward";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const PoolItem = () => {
  const { account, wallet, chainId, demask, slippage } =
    useContext(AccountContext);
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
  const [isOpenAddLiquidity, setIsOpenAddLiquidity] = useState<boolean>(false);
  const { ROUTER_721: routerAddress, NATIVE_ADDRESS: nativeAddress } = demask;
  const collectionAddress =
    useRouter().query.created ||
    ("0x58d8D129a641A60976d5a4d81Fa3C8F1F3f44DEd" as string);
  const handleAddLiquidity = () => {
    setIsOpenAddLiquidity(true);
  };
  const handleRemoveLiquidity = () => {
    setIsOpenRemoveLiquidity(true);
    document.body.style.overflowY = "hidden";
  };
  const { data:dataRemove } = useQuery({
    queryKey: ["list-nft-buy", chainId,account],
    queryFn: async () => {
      const res = await await collectionListBuy(
        collectionAddress,
        chainId,
        1,
        10
      );
      return res.data;
    },
  });
  
  const data = {
    reserveNFT: dataRemove?.totalRecords,
    reserveTokenDecimals: "18",
    tokenDecimals: "18",
    dmlAddress: dataRemove?.dmlAddress,
    dmlDecimals: "18",
    nftAddress: collectionAddress,
    tokenAddress: nativeAddress,
  };
  const dmlTokenLiquidity = data.dmlAddress;
  useEffect(() => {
    const fetchDataReward = async () => {
      if (account && dmlTokenLiquidity && data) {
        const result = await ercContract.viewReward(
          dmlTokenLiquidity,
          account,
          wallet
        );
        console.log(result);

        const rewardDec = divideByDecimal(result.toString(), data.dmlDecimals);
        setReward(rewardDec);
      } else {
        setReward("0");
      }
    };
    fetchDataReward();
  }, [dmlTokenLiquidity, account, data]);
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
      <div className="flex flex-wrap justify-between gap-y-2">
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
      <div className="flex flex-col justify-center mt-4 lg:mt-0">
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
        isOpenSuccess={isOpenSuccessCollect}
        transactionHash={hash}
        type="Collect Reward Success"
        setIsOpenSuccess={setIsOpenSuccessCollect}
      />
      <ModalError
        isOpenError={isOpenErrorCollect}
        transactionHash={hash}
        type="Collect Reward Failed"
        setIsOpenError={setIsOpenErrorCollect}
      />
      {data && account && (
        <>
          <ModalRemmoveLiquidity
            /* 
          // @ts-ignore */
            data={data}
            routerAddress={routerAddress}
            type='erc721'
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
      {data && account && (
        <>
          <ModalAddLiquidityERC721
            /* 
          // @ts-ignore */
            data={data}
            isOpenAddLiquidity={isOpenAddLiquidity}
            setIsOpenLiquidity={setIsOpenAddLiquidity}
            setHash={setHash}
            setIsOpenSuccess={setIsOpenSuccess}
            setIsOpenError={setIsOpenError}
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
        </>
      )}
    </div>
  );
};

export default PoolItem;
