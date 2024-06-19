import { Button } from "@/components/Buttons";
import { LightBulbIcon, PoolListIcon } from "@/components/Icons";
import { ModalWallet } from "@/components/Modal/ModalWallet";
import AccountContext from "@/context/AccountContext";
import { liquidityUserERC721 } from "@/libs/service/liquidityService";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import PoolItem from "./PoolItem";
import { useQuery } from "@tanstack/react-query";
import { BiLoaderAlt } from "react-icons/bi";

const Pool = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { account, chainId } = useContext(AccountContext);
  const handleOpen = () => {
    document.body.style.overflowY = "hidden";
    setIsOpen(true);
  };
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";

  const { isLoading, data, isSuccess } = useQuery({
    queryKey: ["poolERC721", collectionAddress, chainId],
    queryFn: async () => {
      const res = await liquidityUserERC721(collectionAddress, chainId);
      return res.data;
    },
  });
  console.log(data);

  return (
    <div className="h-full text-shader_500 ">
      <div className="flex px-4 py-[10px] my-4 text-sm bg-shader_500 text-shader_200 gap-x-2  ">
        <LightBulbIcon
          width={20}
          height={20}
          className="flex-shrink-0 fill-yellow"
        />
        <p>Pools accrue trading fees towards depositors.</p>
      </div>
      {!account ? (
        <Button
          className="absolute bottom-0 flex items-end w-full py-2"
          primary
          onClick={handleOpen}
        >
          Connect Wallet
        </Button>
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

      <ModalWallet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Pool;
