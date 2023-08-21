import Image from "next/image";
import React from "react";

function Introduction() {
  return (
    <>
      <div className="flex flex-col justify-between gap-8 pt-8 pb-6 border-b-2 lg:flex-row border-dark3">
        <div className="flex flex-col justify-between w-full lg:w-3/5 gap-y-6">
          <div>
            <h2 className="pb-2 text-3xl font-semibold">DeMask Protocol</h2>
            <p className="text-dark2">
              Trading crypto collectibles is easier than ever and monetizes the
              liquidity and referral program.
            </p>
          </div>

          <article className="grid grid-cols-1 gap-4 lg:grid-cols-2 md:grid-cols-3">
            <div className="p-2 border rounded-lg">
              <p className="pb-6 text-dark2">CRYPTO COLLECTIBLES</p>
              <span className="text-4xl font-medium">300+</span>
            </div>
            <div className="p-2 border rounded-lg">
              <p className="pb-6 text-dark2">CREATOR</p>
              <span className="text-4xl font-medium">13+</span>
            </div>
            <div className="p-2 border rounded-lg">
              <p className="pb-6 text-dark2">TVL</p>
              <span className="text-4xl font-medium">300+</span>
            </div>
            <div className="p-2 border rounded-lg">
              <p className="pb-6 text-dark2">VOLUME</p>
              <span className="text-4xl font-medium">20k+</span>
            </div>
          </article>
        </div>

        <div className="lg:w-2/5">
          <Image
            src="/images/about/About.png"
            alt="aboutImage"
            width={480}
            height={480}
            className="object-none w-full h-full"
          />
        </div>
      </div>
    </>
  );
}

export default Introduction;
