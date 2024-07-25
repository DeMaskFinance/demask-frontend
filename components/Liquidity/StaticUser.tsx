import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

function PoolUser() {
  const { chainId } = useContext(AccountContext);
  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["tvl_volume", chainId],
    queryFn: async () => {
      const res = await categoryAPI(`current-volume-tvl?chainId=${chainId}`);
      return res.data;
    },

    keepPreviousData: true,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4  text-white font-semibold bg_main p-5">
      <div className="">
        <span className="  text-shader_200">TVL Total</span>
        <div className="flex items-center  gap-x-1 font-bold text-xl">
          <div>
            {data && data?.currentDateVolume !== undefined ? (
              <FormatNumber number={data?.currentDateVolume} />
            ) : (
              "0M"
            )}
          </div>
          <EtherIcon width={16} height={16} />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div>
          <span className="  text-shader_200">Claimable Fees</span>
          <div className="flex items-center  gap-x-1 font-bold text-xl">
            <div>
              {data && data.currentDateTVL !== undefined ? (
                <FormatNumber number={data?.currentDateTVL} />
              ) : (
                "0M"
              )}
            </div>
            <EtherIcon width={16} height={16} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="  text-shader_200">Pools</span>
        <div className="flex items-center  gap-x-1 font-bold text-xl">
          <p>20</p>
        </div>
      </div>
    </div>
  );
}

export default PoolUser;
