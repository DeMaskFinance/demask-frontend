import { useState } from "react";
import CardLaunchpad from "./CardLaunchpad";
import LaunchpadReleased from "./LaunchpadReleased";
export default function UserLaunchpad({
  data,
  listLaunchpad,
  refetch,
  isRefetching,
  isLoading,
}: any) {
  const [tab, setTab] = useState<any>(0);

  const listTab = [
    {
      name: "All",
      index: 0,
      component: (
        <CardLaunchpad
          tab={listLaunchpad}
          data={data}
          refetch={refetch}
          isRefetching={isRefetching}
          isLoading={isLoading}
        />
      ),
    },
    {
      name: "Released",
      index: 1,
      component: <LaunchpadReleased />,
    },
  ];
  return (
    <div>
      <div
        className={`flex items-center mb-2 p-1 gap-2 rounded-lg text-base text-center text-white  bg-dark3 w-max `}
      >
        {listTab.map((item, idx) => (
          <div key={idx}>
            <button
              className={`lg:py-1 py-1 px-3 lg:px-4 ${
                tab === item.index ? "bg-secondary5" : ""
              } rounded-lg text-sm`}
              type="button"
              onClick={() => {
                setTab(idx);
              }}
            >
              {item.name}
            </button>
          </div>
        ))}
      </div>
      {listTab[tab].component}
    </div>
  );
}
