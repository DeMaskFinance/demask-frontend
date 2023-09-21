import React from "react";
import NFTTop from "./NFTTop";
import Link from "next/link";

function Collectibles() {
  return (
    <div>
      <h2 className="pb-8 text-2xl font-semibold lg:text-3xl">Popular
        <Link href='/overview' className="ml-2 text-secondary5">
          Crypto Collectibles
        </Link>
      </h2>
      <NFTTop />
    </div>
  );
}

export default Collectibles;
