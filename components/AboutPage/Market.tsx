import Image from "next/image";
import React from "react";

function Market() {
  return (
    <div className="py-6 border-b-2 flex items-center gap-8">
      <div className="w-2/4 flex gap-4 justify-between">
        <div>
          <h4 className="font-semibold text-2xl">Old market</h4>
          <p className="py-4 text-dark2">Comming soon</p>
        </div>
        <Image
          src="/images/about/features.svg"
          width={228}
          height={228}
          className=""
          alt="features.svg"
        />
      </div>

      <div className="w-2/4 flex gap-4">
        <div>
          <h4 className="text-secondary3 font-semibold text-2xl">DEMASK</h4>
          <p className="py-4 text-secondary3 text-base">
            DeMask creates a flexible and highly liquid trading environment,
            where assets can be easily bought or sold at prices close to the
            market value with quick execution time, eliminating the need for
            extensive search for buyers and ensuring low risk exposure.
          </p>
        </div>
        <Image
          src="/images/about/features.svg"
          width={228}
          height={228}
          className=""
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
