import React, { useContext } from "react";
import WithAuth from "../Common/WithAuth";
import { CreateIcon, DeployIcon, MagicIcon } from "../Icons";
import Link from "next/link";
import AccountContext from "@/context/AccountContext";
import { ActiveLink } from "../Link";

const Creator = () => {
  const { chainId } = useContext(AccountContext);
  return (
    <WithAuth>
      <div className="container px-4 lg:px-0">
        <div className="w-full text-center">
          <h1 className="text-2xl font-bold text-primary_100">CREATE CENTER</h1>
          <p className="font-normal text-shader_200">
            Choose “NFTs” for one of a kind or “Collection” if you want to sell
          </p>
          <p className="font-normal text-shader_200">
            one collectible multiple times
          </p>
          <div className="w-full mt-6 lg:flex gap-x-6">
            <div className="block w-full mb-6 lg:w-1/2">
              <ActiveLink href={`/create/deploy-contract?chain=${chainId}`}>
                <div className="flex flex-col items-center justify-center px-8 py-6 cursor-pointer rounded-2xl bg-shader_600 group hover:shadow-swiper hover:-translate-y-1 ">
                  <DeployIcon
                    width={100}
                    height={100}
                    className="fill-primary_400"
                  />
                  <p className="mt-6 mb-2 font-semibold text-shader_700 title">
                    Create Collection
                  </p>
                  <p className="text-sm text-shader_500">
                    Deploy your own collection contract
                  </p>
                </div>
              </ActiveLink>
            </div>
            <div className="block w-full mb-6 lg:w-1/2">
              <ActiveLink href={`/create/mint?chain=${chainId}`}>
                <div className="flex flex-col items-center justify-center px-8 py-6 cursor-pointer rounded-2xl bg-shader_600 group hover:shadow-swiper hover:-translate-y-1 ">
                  <CreateIcon
                    width={100}
                    height={100}
                    className="group-hover:fill-primary_400"
                  />
                  <p className="mt-6 mb-2 font-semibold text-shader_700 title">
                    Create NFTs
                  </p>
                  <p className="text-sm text-shader_500">
                    Mint new NFTs for your collection
                  </p>
                </div>
              </ActiveLink>
            </div>
          </div>
        </div>
      </div>
    </WithAuth>
  );
};

export default Creator;
