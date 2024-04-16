import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon } from "@/components/Icons";
import { ModalAddLiquidityERC721 } from "@/components/Modal/ModalAddLiquidity";
import ModalRemoveLiquidity from "@/components/Modal/ModalRemoveLiquidity/ModalRemoveLiquidity";
import {
  ModalError,
  ModalTransation,
} from "@/components/Modal/ModalTransation";
import { ModalSuccess } from "@/components/Modal/ModalTransation/ModalSuccess";
import AccountContext from "@/context/AccountContext";
import useBananceOfDML from "@/hooks/useBalanceOfDML";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import ercContract from "@/libs/utils/erc/erc.contract";
import getRewardDML from "@/libs/utils/getReward";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const PoolItem = ({ liquidity }: any) => {
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
    useRouter().query.collection ||
    ("0x58d8D129a641A60976d5a4d81Fa3C8F1F3f44DEd" as string);

  const handleAddLiquidity = () => {
    setIsOpenAddLiquidity(true);
  };
  const handleRemoveLiquidity = () => {
    setIsOpenRemoveLiquidity(true);
    document.body.style.overflowY = "hidden";
  };

  const data = {
    reserveNFT: liquidity?.reserveNFT,
    reserveTokenDecimals: "18",
    tokenDecimals: "18",
    dmlAddress: liquidity?.dmlAddress,
    dmlDecimals: "18",
    nftAddress: collectionAddress,
    tokenAddress: nativeAddress,
  };
  const { balanceDML, totalSupply } = useBananceOfDML(
    account,
    liquidity.dmlAddress,
    wallet
  );
  const dmlTokenLiquidity = data.dmlAddress;
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
    <div className="p-4 mb-4 border rounded-lg border-dark3 area_darkBG1">
      <div className="flex flex-wrap justify-between gap-y-2">
        <p className="text-xl font-semibold text-dark0 title">
          {liquidity.metadata.name}
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
            <FormatNumber number={liquidity?.reserveToken} />
            <NFTIcon width={24} height={24} className="fill-dark2 ml-[2px]" />
          </div>
          <FormatNumber number={liquidity?.reserveNFT} />
          <span>
            <EtherIcon
              width={20}
              height={20}
              className="fill-dark2 ml-[-1px]"
            />
          </span>
          <div>
            ({((Number(balanceDML) / Number(totalSupply)) * 100).toFixed(2)}%)
          </div>
        </div>
        <div className="flex items-center justify-between my-2">
          <div className="flex">
            <div className="flex items-center">
              Reward:
              {reward ? (
                <div className="ml-2">
                  <FormatNumber number={reward} />
                </div>
              ) : (
                <p className="w-10 h-4 rounded-full animate-pulse bg-slate-200 dark:bg-slate-700"></p>
              )}
            </div>
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
          <ModalRemoveLiquidity
            /* 
          // @ts-ignore */
            data={data}
            routerAddress={routerAddress}
            type="erc721"
            isOpenRemoveLiquidity={isOpenRemoveLiquidity}
            isERC721={true}
            setIsOpenRemoveLiquidity={setIsOpenRemoveLiquidity}
            setHash={setHash}
            setIsOpenSuccess={setIsOpenSuccessRemove}
            setIsOpenError={setIsOpenErrorRemove}
          />
          <ModalSuccess
            isOpenSuccess={isOpenSuccessRemove}
            transactionHash={hash}
            type="Remove Liquidity Successed"
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
