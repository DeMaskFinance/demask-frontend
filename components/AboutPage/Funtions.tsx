import Image from "next/image";
import React from "react";

function Function() {
  return (
    <div className="py-6">
      <div className="mx-auto">
        <h4 className="text-2xl font-semibold text-center text-secondary3">Demask</h4>
        <p className="py-4 text-base text-secondary5 w-full lg:w-[60%] text-center mx-auto">
          DeMask creates a flexible and highly liquid trading environment,
          where assets can be easily bought or sold at prices close to the
          market value with quick execution time, eliminating the need for
          extensive search for buyers and ensuring low risk exposure.
        </p>
      </div>
      <div className="relative">
        <div className="lg:w-[40%] relative w-full mx-auto z-10 top-4"
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-easing="ease-in-sine">
          <video
            src='https://demask.infura-ipfs.io/ipfs/QmardfCFg1bVMEPeSR67zcyDYoFZVgiojHQrX8DeH51J5A'
            autoPlay
            loop
            muted
            className="w-full h-full rounded-lg "
          />
        </div>
        <div
          className="absolute w-[1200px] bg-gradient-to-r -right-[42%] from-secondary5 to-[#C8BAFF] h-[110%] top-0 rounded-lg"
          data-aos="fade-left"
          data-aos-duration="200"
          data-aos-easing="ease-in-sine">
        </div>
      </div>

    </div>
  );
}

export default Function;
