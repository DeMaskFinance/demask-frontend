import DetailERC721 from "@/components/ERC721/DetailERC721";
import AccountContext from "@/context/AccountContext";
import { collectionDetail } from "@/libs/service/collectionService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const TradeERC721 = () => {
  const router = useRouter();
  const queryErc = (router.query.erc as string) || "";
  const collectionAddress = queryErc.split("&")[0] || "";
  console.log(useRouter());

  const { chainId } = useContext(AccountContext);
  const { data, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => {
      if (collectionAddress) {
        const res = await collectionDetail(collectionAddress, chainId);
        return res.data;
      }
    },
  });
  console.log(data, collectionAddress, chainId);

  return (
    <div>
      <DetailERC721 isLoading={isLoading} isSuccess={isSuccess} data={data} />
    </div>
  );
};

export default TradeERC721;
