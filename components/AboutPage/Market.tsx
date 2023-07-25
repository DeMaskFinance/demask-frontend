import Image from "next/image";
import React from "react";

function Market() {
  return (
    <div className="py-6 border-b-2">
      <div>
        <h4 className="font-semibold text-2xl">Old market</h4>
        <p className="py-4 text-dark2">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <Image
          src={"/images/about/market.svg"}
          width={410}
          height={106}
          alt="about"
        ></Image>
      </div>

      <div className="mt-4">
        <h4 className="text-secondary3 font-semibold text-2xl pt-4">DEMASK</h4>
        <p className="py-4 text-secondary3">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <Image
          src={"/images/about/marketPool.svg"}
          width={874}
          height={106}
          alt="about"
        ></Image>
      </div>
    </div>
  );
}

export default Market;
