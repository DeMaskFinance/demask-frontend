import React from "react";
import WithAuth from "../Common/WithAuth";
import { CreateIcon, DeployIcon, MagicIcon } from "../Icons";
import Link from "next/link";
import { BackgroundDefault } from "../Backgrounds";

const Creator = () => {
  return (
    <WithAuth>
      <BackgroundDefault>
        <div className="container">
          <div className="flex flex-col justify-center w-full">
            <h2 className="flex items-center">
              <MagicIcon width={24} height={24} />
              <p className="text-xl font-semibold text_gradient">Choose Type</p>
            </h2>
            <p className="mt-3 font-normal text-dark3">
              Choose “NFTs” for one of a kind or “Collection” if you want to
              sell one collectible multiple times
            </p>
            <div className="flex w-full mt-6 gap-x-6">
              <Link href="/" className="basis-1/2">
                <div className="flex flex-col items-center justify-center px-8 py-6 cursor-pointer rounded-2xl bg-dark5 group hover:shadow-swiper hover:translate-y-1">
                  <DeployIcon
                    width={100}
                    height={100}
                    className="fill-secondary5"
                  />
                  <p className="font-semibold text-dark1">Create Collection</p>
                  <p className="text-sm text-dark3">
                    Deploy your own collection contract
                  </p>
                </div>
              </Link>
              <Link href="/" className="basis-1/2">
                <div className="flex flex-col items-center justify-center px-8 py-6 cursor-pointer rounded-2xl bg-dark5 group hover:shadow-swiper hover:translate-y-1">
                  <CreateIcon
                    width={100}
                    height={100}
                    className="group-hover:fill-secondary5"
                  />
                  <p className="font-semibold text-dark1">Create Collection</p>
                  <p className="text-sm text-dark3">
                    Deploy your own collection contract
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </BackgroundDefault>
    </WithAuth>
  );
};

export default Creator;
