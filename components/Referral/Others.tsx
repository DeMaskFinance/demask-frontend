import React, { Fragment } from "react";

const Others = () => {
  return (
    <Fragment>
      <div className="overflow-x-scroll  flex flex-col justify-between w-full">
        <table className="w-full text-left border-collapse min-h-[550px]">
          <thead className=" bg-shader_600 text-shader_200 whitespace-nowrap">
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
            {/* <tr className="transition duration-300 ease-in-out hover:bg-neutral-100">
                  <td className="px-6 py-2 whitespace-nowrap">1</td>
                  <td className="px-10 py-4 whitespace-nowrap">Mark</td>
                  <td className="px-6 py-2 whitespace-nowrap">Otto</td>
                  <td className="px-6 py-2 whitespace-nowrap">@mdo</td>
                </tr> */}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default Others;
