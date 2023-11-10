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

  const listCategories = [
    {
      label: "User",
      onClick: () => {
        setListLaunchpad(0);
      },
      component: (
        <UserLaunchpad
          data={data}
          listLaunchpad={listLaunchpad}
          refetch={refetch}
          isRefetching={isRefetching}
          isLoading={isLoading}
        />
      ),
    },

    {
      label: "Creator",
      onClick: () => {
        setListLaunchpad(1);
      },
      component: <CreatorLaunchpad tab={listLaunchpad} data={data} />,
    },
  ];

  return (
    <div className="flex flex-col gap-2 lg:flex-row md:flex-row">
      <CategoryProfileLaunchPad
        listCategories={listCategories}
        listLaunchpad={listLaunchpad}
      />

      <div className="p-2 border rounded-md lg:w-4/5">
        {listCategories[listLaunchpad].component}
      </div>
    </div>
  );
}
