import { BackgroundDefault } from "@/components/Backgrounds";
import Pools from "@/components/Liquidity/Pools";
import { NextSeo } from "next-seo";
import { SEO } from "../../next-seo.config";
import { RpcProvider, WalletAccount } from "starknet";
const updateMeta = {
  ...SEO,
  title: "Liquidity",
};
export default function Liquidity() {
  const testBravos = async () => {
    const swo = window.starknet_braavos;
    console.log("swo", swo);
    const myProvider = new RpcProvider({
      nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
    });
    const wa = new WalletAccount(myProvider, swo);
    console.log("wa", wa);
    console.log(await wa.getChainId());
    // const res = await starknetContract.getWalletAccount(wallet);
    // const res1 = await deployContract.deployContractCollection(
    //   account,
    //   wallet,
    //   [{}],
    //   123
    // );
    // console.log({
    //   res,
    //   res1,
    // });
  };
  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      <div className="py-8 max-w-[908px]  mx-auto min-h-[94vh] pb-40 lg:pb-0 px-4 md:px-0">
        <p onClick={testBravos}>TEST BRA</p>
        <Pools />
      </div>
    </BackgroundDefault>
  );
}
