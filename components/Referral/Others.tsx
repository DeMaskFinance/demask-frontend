import React from "react";

const Others = () => {
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-surface dark:text-white">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-4 ">
                    NFT Staker
                  </th>
                  <th scope="col" className="px-10 py-4">
                    Staked
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Referee points
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Referal fees
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* <tr className="transition duration-300 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-600">
                  <td className="px-6 py-4 whitespace-nowrap">1</td>
                  <td className="px-10 py-4 whitespace-nowrap">Mark</td>
                  <td className="px-6 py-4 whitespace-nowrap">Otto</td>
                  <td className="px-6 py-4 whitespace-nowrap">@mdo</td>
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
