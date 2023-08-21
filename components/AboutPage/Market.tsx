import Image from "next/image";
import React from "react";

function Market() {
  return (
    <div className="items-center gap-8 py-6 border-b-2 lg:flex border-dark3">
      <div className="flex flex-col items-center justify-between w-full gap-4 mb-4 lg:mb-0 lg:items-start lg:w-2/4 lg:flex-row hover:text-secondary3">
        <div>
          <h4 className="text-2xl font-semibold">Old market</h4>
        </div>
        <Image
          src="/images/about/OldFinal.gif"
          width={228}
          height={228}
          className="w-full h-full lg:w-[370px] lg:h-[370px] rounded-lg"
          alt="features.svg"
        />
      </div>

      <div className="flex flex-col items-center justify-between w-full gap-4 lg:w-2/4 lg:flex-row hover:text-secondary3">
        <div className="flex flex-col items-center justify-between lg:items-start ">
          <h4 className="text-2xl font-semibold ">DEMASK</h4>
          <p className="py-4 text-base ">
            DeMask creates a flexible and highly liquid trading environment,
            where assets can be easily bought or sold at prices close to the
            market value with quick execution time, eliminating the need for
            extensive search for buyers and ensuring low risk exposure.
          </p>
        </div>
        <Image
          src="/images/about/DemaskFinal.gif"
          width={228}
          height={228}
          className="w-full h-full lg:w-[370px] lg:h-[370px] rounded-lg"
          alt="features.svg"
        />
        {/* <Image
          src={"/images/about/marketPool.svg"}
          width={874}
          height={106}
          alt="about"
        ></Image> */}
      </div>
    </div>
  );
}

export default Market;
