import React, { useContext } from "react";
import WithAuth from "../Common/WithAuth";
import { CreateIcon, DeployIcon, MagicIcon } from "../Icons";
import Link from "next/link";
import { BackgroundDefault } from "../Backgrounds";
import AccountContext from "@/context/AccountContext";

const Creator = () => {
  const { chainId } = useContext(AccountContext);
  return (
    <WithAuth>
      <BackgroundDefault>
        <div className="container px-4 lg:px-0">
          <div className="lg:translate-y-[10%] w-full ">
            <h2 className="flex items-center">
              <MagicIcon width={24} height={24} />
              <p className="text-xl font-semibold text_gradient">Choose Type</p>
            </h2>
            <p className="mt-3 font-normal text-dark3">
              Choose “NFTs” for one of a kind or “Collection” if you want to
              sell one collectible multiple times
            </p>
            <div className="w-full mt-6 lg:flex gap-x-6">
              <Link
                href={`/create/deploy-contract?chain=${chainId}`}
                className="block w-full mb-6 lg:w-1/2"
              >
                <div className="flex flex-col items-center justify-center px-8 py-6 cursor-pointer rounded-2xl bg-dark5 group hover:shadow-swiper hover:translate-y-1">
                  <DeployIcon
                    width={100}
                    height={100}
                    className="fill-secondary5"
                  />
                  <p className="mt-6 mb-2 font-semibold text-dark1">
                    Create Collection
                  </p>
                  <p className="text-sm text-dark3">
                    Deploy your own collection contract
                  </p>
                </div>
              </Link>
              <Link
                href={`/create/mint?chain=${chainId}`}
                className="block w-full lg:w-1/2"
              >
                <div className="flex flex-col items-center justify-center px-8 py-6 cursor-pointer rounded-2xl bg-dark5 group hover:shadow-swiper hover:translate-y-1">
                  <CreateIcon
                    width={100}
                    height={100}
                    className="group-hover:fill-secondary5"
                  />
                  <p className="mt-6 mb-2 font-semibold text-dark1">
                    Create NFTs
                  </p>
                  <p className="text-sm text-dark3">
                    Mint new NFTs for your collection
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
