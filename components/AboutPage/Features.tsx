import Image from "next/image";
import React from "react";

function Features() {
  return (
    <div className="py-6">
      <h2 className="text-3xl font-medium pb-8">Features of DEMASK?</h2>
      <ul className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 text-dark2">
        <li>
          <Image
            src="/images/about/features.svg"
            width={300}
            height={300}
            alt="features.svg"
            className="w-full"
          />

          <h6 className="text-2xl font-medium py-3 text-dark1">Create</h6>
          <p>
            The Create feature will enable you to own crypto collectibles
            effortlessly, allowing you to hold or sell them through the swap
            function.
          </p>
        </li>

        <li>
          <Image
            src="/images/about/features.svg"
            width={300}
            height={300}
            className="w-full"
            alt="features.svg"
          />

          <h6 className="text-2xl font-medium py-3 text-dark1">Swap</h6>
          <p>
            This feature will enable you to easily buy and sell your favorite
            cryptocurrency collectibles or trade them to make profits using the
            DeMask Protocol.
          </p>
        </li>

        <li>
          <Image
            src="/images/about/features.svg"
            width={300}
            height={300}
            className="w-full"
            alt="features.svg"
          />

          <h6 className="text-2xl font-medium py-3 text-dark1">Launchpad</h6>
          <p>
            The feature enables developers and content creators to distribute
            crypto collectibles to the market through initial distribution
            pricing.
          </p>
        </li>

        <li>
          <Image
            src="/images/about/features.svg"
            width={300}
            height={300}
            className="w-full"
            alt="features.svg"
          />

          <h6 className="text-2xl font-medium py-3 text-dark1">Referral</h6>
          <p>
            The feature will help introducers earn tokens from trading through
            the protocol.
          </p>
        </li>
      </ul>
    </div>
  );
}

export default Features;
