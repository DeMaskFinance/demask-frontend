import FormatNumber from "@/components/Common/FormatNumber";
import MediaNFT from "@/components/Common/MediaNFT";
import React from "react";

const Box: React.FC<{ data: LaunchpadData }> = ({ data }) => {
  const remaining = Number(data?.hardcap) - Number(data?.totalSold);
  return (
    <div className="overflow-y-auto">
      <table className="w-full md:text-sm text-left border-collapse text-[10px]">
        <thead className="sticky top-0 z-10 m-1 ">
          <tr className="mx-2 text-[18px] text-dark0">
            <th
              scope="col"
              className="sticky left-0 px-6 py-3 bg-white area_darkBG1 "
            >
              NAME
            </th>
            <th scope="col">
              <div className="flex items-center justify-end pl-8 min-w-max">
                TOTAL SALE
              </div>
            </th>
            <th scope="col">
              <div className="flex items-center justify-end pl-8 min-w-max">
                REMAINING
              </div>
            </th>
          </tr>
        </thead>
        <tbody className=" text-base font-normal  max-md:text-[12px] bg-transparent border-gray-700 cursor-pointer">
          <tr className="text-dark2 text-base max-md:text-[12px] bg-transparent group rounded-lg border-gray-700 bg-white hover:bg-slate-100 cursor-pointer area_darkBG1 dark:hover:bg-darkBG2">
            <td
              scope="row"
              className="sticky left-0 z-10 flex items-center px-1 py-2 font-medium bg-white group-hover:bg-slate-100 md:min-w-max md:px-6 whitespace-nowrap area_darkBG1 dark:group-hover:bg-darkBG2 dark:group-hover:text-white"
              style={{ width: "100%" }}
            >
              <div className="flex items-center justify-start transition-all ">
                <div className="h-7 md:h-8 aspect-square">
                  <MediaNFT data={data} isControls={false} />
                </div>
                <span className="w-24 ml-1 truncate md:ml-4 md:w-full group-hover:text-secondary4 group-hover:font-medium ">
                  <h1 className="font-semibold ">{data.metadata.name}</h1>
                </span>
              </div>
            </td>
            <td className="min-w-max">
              <div className="flex items-center justify-end ">
                <FormatNumber number={data.totalSold} />
              </div>
            </td>
            <td className="">
              <div className="flex items-center justify-end ">
                <FormatNumber number={(remaining / 1e18).toString()} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Box;
