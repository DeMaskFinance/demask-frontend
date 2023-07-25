import Image from "next/image";
import React from "react";

function Features() {
  return (
    <div className="py-6">
      <h2 className="text-3xl font-medium pb-8">Features of DEMASK?</h2>
      <ul className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8">
        <li>
          <Image
            src="/images/about/features.svg"
            width={300}
            height={300}
            alt="features.svg"
            className="w-full"
          />

          <h6 className="text-2xl font-medium py-3">Swap</h6>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
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

          <h6 className="text-2xl font-medium py-3">Liquidity</h6>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
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

          <h6 className="text-2xl font-medium py-3">Launchpad</h6>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
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

          <h6 className="text-2xl font-medium py-3">Reels/ Socials</h6>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </li>
      </ul>
    </div>
  );
}

export default Features;
