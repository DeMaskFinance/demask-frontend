import React from "react";

const Others = () => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto ">
        <div className=" min-w-full min-h-[500px] flex flex-col justify-between">
          <div className="overflow-hidden ">
            <table className="min-w-full text-left text-surface text-white text-sm font-semibold">
              <thead className="uppercase bg-shader_600 text-shader_200 ">
                <tr>
                  <th scope="col" className="px-6 py-3 ">
                    NFT Staker
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Staked
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Referee points
                  </th>
                  <th scope="col" className="px-6 py-3 text-end">
                    Referal fees
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <tr className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600">
                  <td className="px-6 py-2 whitespace-nowrap">1</td>
                  <td className="px-10 py-4 whitespace-nowrap">Mark</td>
                  <td className="px-6 py-2 whitespace-nowrap">Otto</td>
                  <td className="px-6 py-2 whitespace-nowrap">@mdo</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Others;
