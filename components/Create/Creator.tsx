import AccountContext from "@/context/AccountContext";
import { useContext } from "react";
import { Button } from "../Buttons";
import WithAuth from "../Common/WithAuth";
import { CreateIcon, DeployIcon, RightIcon } from "../Icons";
import { ActiveLink } from "../Link";
import { BackgroundDefault } from "../Backgrounds";

const Creator = () => {
  const { chainId } = useContext(AccountContext);
  return (
    <WithAuth>
      <BackgroundDefault>
        <div className="container relative max-w-[800px] px-4 lg:px-0">
          <div className="w-full ">
            <div className="text-center mt-[72px]">
              <h1 className="text-2xl font-bold text-primary_100">
                CREATE CENTER
              </h1>
              <p className="font-normal text-shader_200">
                Choose “NFTs” for one of a kind or “Collection” if you want to
                sell
              </p>
              <p className="font-normal text-shader_200">
                one collectible multiple times
              </p>
            </div>
            <div className="w-full mt-20 lg:flex gap-x-3">
              <div className="block w-full mb-6 lg:w-1/2">
                <ActiveLink href={`/create/deploy-contract?chain=${chainId}`}>
                  <div className="p-4 border cursor-pointer rounded-[10px] bg-shader_700 group border-shader_500 hover:-translate-y-2 transition-all duration-150 ease-linear">
                    <div className="p-2 bg-primary_500 bg-opacity-[0.15] w-10 h-10 rounded-lg">
                      <DeployIcon width={24} height={24} />
                    </div>
                    <p className="mt-3 font-bold text-white">
                      Create Collection
                    </p>
                    <p className="text-sm text-shader_200">
                      Deploy your own collection contract
                    </p>
                    <Button active className="mt-8 font-bold">
                      Create now
                      <RightIcon width={16} height={16} className="ml-2" />
                    </Button>
                  </div>
                </ActiveLink>
              </div>
              <div className="block w-full mb-6 lg:w-1/2">
                <ActiveLink href={`/create/mint?chain=${chainId}`}>
                  <div className="p-4 border cursor-pointer rounded-[10px] bg-shader_700 group border-shader_500 hover:-translate-y-2 transition-all duration-150 ease-linear ">
                    <div className="p-2 bg-primary_500 bg-opacity-[0.15] w-10 h-10 rounded-lg">
                      <CreateIcon width={24} height={24} />
                    </div>
                    <p className="mt-3 font-bold text-white">Create NFT</p>
                    <p className="text-sm text-shader_200">
                      Mint new NFTs for your collection
                    </p>
                    <Button active className="mt-8 font-bold">
                      Create now
                      <RightIcon width={16} height={16} className="ml-2" />
                    </Button>
                  </div>
                </ActiveLink>
              </div>
            </div>
          </div>
        </div>
      </BackgroundDefault>
    </WithAuth>
  );
};

export default Creator;
