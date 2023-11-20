import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { BiLoader } from "react-icons/bi";
import { IoReloadOutline } from "react-icons/io5";
import CardProfileLaunchPad from "./CardProfileLaunchPad";
export default function CreatorLaunchpad({ tab }: any) {
  const { account, wallet, chainId, demask, tokenDefault } =
    useContext(AccountContext);

  
  const { isLoading, data, refetch, isRefetching } = useQuery({
    queryKey: ["creator", account, chainId],
    queryFn: async () => {
      const res = await categoryAPI(
        `/userCreatedLaunchpad?userAddress=${account}&chainId=${chainId}`
      );
      return res;
    },

    refetchInterval: 60000,
  });

  console.log(data?.launchpadLists);
  

  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <h2 className="flex items-baseline">
          Total (
          {!isLoading ? (
            data?.launchpadLists?.length || 0
          ) : (
            <BiLoader className="animate-spin" />
          )}
          )
        </h2>

        <button
          onClick={() => {
            refetch();
          }}
          className="flex items-center gap-2 px-2 py-1 text-white border rounded-lg bg-secondary3 hover:bg-secondary5"
        >
          <IoReloadOutline /> Refetch
        </button>
      </div>

      <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-3 md:grid-cols-2 overflow-hiddene">
        {data?.launchpadLists?.map((item: any) => (
          <CardProfileLaunchPad item={item}/>
        ))}
      </div>

    </>
  );
}
