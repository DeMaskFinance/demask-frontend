import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import ActiveLaunchItem from "./TabLaunchPadItem";

interface TabLaunchPadProps {
  query: any;
}
const TabLaunchPad: React.FC<TabLaunchPadProps> = ({ query }) => {
  const { isLoading, refetch, data, isFetching, isPreviousData } = useQuery({
    queryKey: ["launchpadActive", query],
    queryFn: async () => {
      const res = await categoryAPI("v2/launchpad?chainId=80001&page=1");
      return res;
    },
  });

  return (
    <>
      <div className="container">
        <ul className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-dark2">
          {data &&
            data?.launchpadLists?.map((item: any, idx: number) => (
              <>
                {item.status === query && (
                  <>
                    <li
                      title={item?.metadata?.name}
                      className="items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home "
                    >
                      <ActiveLaunchItem item={item} query={query} />
                    </li>
                  </>
                )}
              </>
            ))}
        </ul>
      </div>
      {isLoading && <SkeletonCategory />}
    </>
  );
};

export default TabLaunchPad;
