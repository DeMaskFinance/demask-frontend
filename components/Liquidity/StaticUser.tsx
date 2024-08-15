import FormatNumber from "@/components/Common/FormatNumber";
import { EtherIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { poolUserInfor } from "@/libs/service/liquidityService";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

function PoolUser() {
  const { chainId, account } = useContext(AccountContext);
  const [version] = useQueryParam("version", withDefault(StringParam, "v2"));

  const { isLoading, data, isFetching } = useQuery({
    queryKey: ["total-infor-pool", chainId, account, version],
    queryFn: async () => {
      const res = await poolUserInfor(chainId, account, version);
      return res.data;
    },
  });
  console.log(data, version);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4  text-white font-semibold bg_main p-5">
      <div className="">
        <span className="  text-shader_200">TVL Total</span>
        <div className="flex items-center  gap-x-1 font-bold text-xl">
          <div>
            <FormatNumber number={data?.totalTvl || 0} />
          </div>
          <EtherIcon width={16} height={16} />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="  text-shader_200">Pools</span>
        <div className="flex items-center  gap-x-1 font-bold text-xl">
          <FormatNumber number={data?.totalPool || 0} />
          <EtherIcon width={16} height={16} />
        </div>
      </div>
    </div>
  );
}

export default PoolUser;
