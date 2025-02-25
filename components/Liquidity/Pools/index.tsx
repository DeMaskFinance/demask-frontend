import { Button } from "@/components/Buttons";
import VersionTrade from "@/components/Common/VersionTrade";
import { PoolIcon, UserIcon } from "@/components/Icons";
import PoolUser from "@/components/Liquidity/StaticUser";
import AccountContext from "@/context/AccountContext";
import { queryClient } from "@/libs/constants";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import TotalPools from "./TotalPools";
import UserPools from "./UserPools";

const Pools = () => {
  const [index, setIndex] = useState<number>(0);
  const { account } = useContext(AccountContext);

  return (
    <div>
      <div className="flex flex-wrap justify-between w-full gap-y-2">
        <div>
          <div>
            <h2 className="text-lg font-bold text-primary_300 mb-2">
              Liquidity Pools
            </h2>
            <VersionTrade />
          </div>
          <p className="mt-2 text-shader_200">Add liquidity and earn rewards</p>
        </div>
      </div>
      {account && <PoolUser />}
      <div className="flex gap-x-2">
        <Button
          primary={index === 0}
          active={index === 1}
          className="px-6 h-10 my-4 flex gap-x-2"
          onClick={() => setIndex(0)}
        >
          <PoolIcon width={16} height={16} />
          All Pools
        </Button>
        <Button
          primary={index === 1}
          active={index === 0}
          className="px-6 h-10 my-4 flex gap-x-2"
          onClick={() => setIndex(1)}
        >
          <UserIcon width={16} height={16} />
          My Positions
        </Button>
      </div>

      {index === 0 ? <TotalPools /> : <UserPools />}
    </div>
  );
};

export default Pools;
