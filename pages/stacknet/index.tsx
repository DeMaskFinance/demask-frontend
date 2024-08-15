import abiCreate721Starknet from "@/abi/starknet/abiCreate721Stacknet.json";
import { Button } from "@/components/Buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Connector,
  useAccount,
  useBalance,
  useConnect,
  useContract,
  useContractFactory,
  useContractWrite,
  useDisconnect,
  useSignTypedData,
} from "@starknet-react/core";
import Image from "next/image";
import { useContext, useMemo } from "react";
import { BiLoader } from "react-icons/bi";
import {
  CallData,
  constants,
  Contract,
  ec,
  hash,
  RpcProvider,
  TypedData,
} from "starknet";
const TestPage = () => {
  const { account, wallet } = useContext(AccountContext);

  // const { isLoading, isError, error, data } = useBalance({
  //   address:
  //     "0x052789eCea341395848b554BB14BE7116a4503bE1f8B7a02f8c05DD7902bEc4f",
  //   watch: true,
  // });
  // console.log(data);

  const testAddress =
    "0x07091a681ff4de9bd830573448c8605ff777999666aaf329fcb294717baeafb9";
  const testRead = async () => {
    const provider = new RpcProvider({
      nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
    });
    const { abi: testAbi } = await provider.getClassAt(testAddress);
    console.log(testAbi);

    if (testAbi === undefined) {
      throw new Error("no abi.");
    }
    const myTestContract = new Contract(testAbi, testAddress, provider);
    const bal1 = await myTestContract.name();
    console.log(bal1);
  };

  // const { data: dataBalance } = useBalance({
  //   account,
  //   watch: true,
  // });
  // const msgHash = hash.computeHashOnElements(dataSign);
  // console.log(msgHash);
  // const testClassHash =
  //   "0x047d48afafa3385a0310e6e52da873cc58cb1a56a8a93754f2a8bfc726e282d3";
  // const contractConstructor = CallData.compile({
  //   owner: "0x042b0820435bf27be9bd967e6c71ab5e6b62575c04ac085780907b341c6225a1",
  // });
  // console.log(contractConstructor);
  // const { contractFactory } = useContractFactory({
  //   compiledContract: contractConstructor,
  //   classHash: testClassHash,
  //   abi: contractConstructor.abi,
  // });
  const safe = async () => {
    const providerTest = await getProvider(wallet);
    const provider = new RpcProvider({
      nodeUrl: "https://free-rpc.nethermind.io/sepolia-juno/v0_7",
    });
    console.log(providerTest, provider);

    const { abi: testAbi } = await providerTest.getClassAt(testAddress);
    if (testAbi === undefined) {
      throw new Error("no abi.");
    }
    const myTestContract = new Contract(testAbi, testAddress, provider);
    // myTestContract.connect(account);
    const bal1 = await myTestContract.name();
    console.log(bal1);
  };
  return (
    <div className="text-white">
      <p onClick={testRead}>TEST</p>
      <p onClick={safe}>Test</p>
    </div>
  );
};

export default TestPage;
