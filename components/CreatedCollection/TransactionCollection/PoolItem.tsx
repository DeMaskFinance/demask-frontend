import { Button } from "@/components/Buttons";
import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon, NFTIcon, PlusIcon } from "@/components/Icons";
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
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";

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
  console.log(data);

  return (
    <div className="mb-4 text-white font-semibold text-sm">
      <p className="text-primary_400">Liquidity Pool:</p>
      <div className="flex gap-x-2 whitespace-nowrap mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              green_2
              className="w-full py-3 px-3 flex gap-x-2"
              onClick={handleAddLiquidity}
            >
              <PlusIcon className="text-green" />
              Add Liquidity
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
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
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              red_2
              className="w-full py-3 px-3 flex gap-x-2"
              onClick={handleRemoveLiquidity}
            >
              <TrashIcon className="text-red" width={20} height={20} />
              Remove Liquidity
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full p-4 border bg-shader_800 border-shader_500">
            <ModalRemoveLiquidity
              /* 
          // @ts-ignore */
              data={data}
              routerAddress={routerAddress}
              type="erc721"
              isERC721={true}
              setHash={setHash}
              setIsOpenSuccess={setIsOpenSuccessRemove}
              setIsOpenError={setIsOpenErrorRemove}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex gap-x-2 whitespace-nowrap mt-4">
        <div className="p-3 font-semibold text-white rounded-lg bg-primary_500 bg-opacity-10 basis-1/2">
          <p className="font-normal text-primary_200">Reserve NFT</p>
          <FormatNumber number={liquidity?.reserveNFT} />
        </div>
        <div className="p-3 font-semibold text-white rounded-lg bg-primary_500 bg-opacity-10 basis-1/2">
          <p className="font-normal text-primary_200">Reserve Token</p>
          <div className="flex items-center gap-x-1">
            <FormatNumber number={liquidity?.reserveToken} />
            <EtherIcon width={16} height={16} />
          </div>
        </div>
      </div>
      <div className="bg_main p-4 mt-4">
        <p className="text-shader_100 text-base">Your Reward</p>
        <div className="flex gap-x-2 text-xl items-center font-bold">
          <FormatNumber number={reward} />
          <EtherIcon width={18} height={18} />
        </div>
        <Button
          className=" w-full py-2 mt-4"
          gradient
          onClick={handleGetReward}
        >
          Claim Reward
        </Button>
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
