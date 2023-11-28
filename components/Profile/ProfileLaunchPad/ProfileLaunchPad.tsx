import { useContext, useState } from "react";
import CategoryProfileLaunchPad from "./CategoryProfileLaunchPad";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import AccountContext from "@/context/AccountContext";
import Image from "next/image";
import CardLaunchpad from "./CardLaunchpad";
import CreatorLaunchpad from "./CreatorLaunchpad";
import { BiLoader } from "react-icons/bi";
import { IoReloadOutline } from "react-icons/io5";
import LaunchpadReleased from "./LaunchpadReleased";
import UserLaunchpad from "./UserLaunchpad";

export default function ProfileLaunchPad() {
  const [listLaunchpad, setListLaunchpad] = useState<any>(0);
  const [tab, setTab] = useState<any>(0);

  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);

  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: ["profileLaunchpad", listLaunchpad],
    queryFn: async () => {
      const res = await categoryAPI(
        `/userLaunchpad?userAddress=${account}&chainId=${chainId}&page=1&limit=10?status=all`
      );
      return res;
    },

    refetchInterval: 60000,
  });
  console.log(data);
  
  return (
    <div className="">
      <UserLaunchpad
          data={data}
          listLaunchpad={listLaunchpad}
          refetch={refetch}
          isRefetching={isRefetching}
          isLoading={isLoading}
        />
    </div>
  );
}
