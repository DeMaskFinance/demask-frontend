import Image from "next/image";
import React from "react";

function Introduction() {
  return (
    <>
      <div className="flex lg:flex-row flex-col gap-8 pt-8  border-b-2  pb-6 justify-between">
        <div className="lg:w-3/5 w-full flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-medium pb-2">DeMask Protocol</h2>
            <p className="text-dark2">
              Trading crypto collectibles is easier than ever and monetizes the
              liquidity and referral program.
            </p>
          </div>

          <article className="grid lg:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4">
            <div className="border p-2 rounded-lg">
              <p className="pb-6 text-dark2">CRYPTO COLLECTIBLES</p>
              <span className="font-medium text-4xl">300+</span>
            </div>
            <div className="border p-2 rounded-lg">
              <p className="pb-6 text-dark2">CREATOR</p>
              <span className="font-medium text-4xl">13+</span>
            </div>
            <div className="border p-2 rounded-lg">
              <p className="pb-6 text-dark2">TVL</p>
              <span className="font-medium text-4xl">300+</span>
            </div>
            <div className="border p-2 rounded-lg">
              <p className="pb-6 text-dark2">VOLUME</p>
              <span className="font-medium text-4xl">20k+</span>
            </div>
          </article>
        </div>

        <div className="lg:w-2/5">
          <Image
            src="/images/about.svg"
            alt="about.svg"
            width={480}
            height={480}
          />
        </div>
      </div>
    </>
  );
}

export default Introduction;
