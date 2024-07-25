import { Button } from "@/components/Buttons";
import { PoolListIcon } from "@/components/Icons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { liquidityUserERC721 } from "@/libs/service/liquidityService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import PoolItem from "./PoolItem";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
const Pool = () => {
  const { account, chainId } = useContext(AccountContext);
  const router = useRouter();
  const collectionAddress = (router.query.erc as string) || "";

  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["poolERC721", collectionAddress, chainId],
    queryFn: async () => {
      const res = await liquidityUserERC721(collectionAddress, chainId);
      return res.data;
    },
  });

  return (
    <div className="h-full text-shader_500 ">
      <div className="px-4 py-2 my-4 bg-primary_500 bg-opacity-10 text-white gap-x-2 border border-primary_500 border-opacity-25 rounded-lg">
        💰 Pools accrue trading fees towards depositors
      </div>
      {!account ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="absolute bottom-0 flex items-end w-full py-2"
              gradient
            >
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[350px] p-0 border-none">
            <ModalWallet />
          </DialogContent>
        </Dialog>
      ) : (
        <div>
          {isLoading ? (
            <BiLoaderAlt className="mb-6 text-2xl animate-spin text-primary_400" />
          ) : (
            isSuccess && (
              <>
                {data?.dmlAddress ===
                "0x0000000000000000000000000000000000000000" ? (
                  <div className="pool_empty">
                    <PoolListIcon width={72} height={72} />
                    Your active liquidity positions will appear here.
                  </div>
                ) : (
                  <div className="w-full mx-auto">
                    <PoolItem liquidity={data} />
                  </div>
                )}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Pool;
