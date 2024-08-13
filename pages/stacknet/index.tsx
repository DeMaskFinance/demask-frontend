import abiCreate721Stacknet from "@/abi/stacknet/abiCreate721Stacknet.json";
import { Button } from "@/components/Buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil1Icon } from "@radix-ui/react-icons";
import {
  Connector,
  useAccount,
  useConnect,
  useContract,
  useDisconnect,
  useSignTypedData,
} from "@starknet-react/core";
import Image from "next/image";
import { BiLoader } from "react-icons/bi";
import { constants, Contract, RpcProvider, TypedData } from "starknet";
const TestPage = () => {
  // const { connect, connectors } = useConnect();
  // const { account, address, status } = useAccount();
  // const { disconnect } = useDisconnect();

  // const { isLoading, isError, error, data } = useBalance({
  //   address:
  //     "0x7bdfe5ccdae97ec118aa02953570c16243e972cef09557698e15278a34b1c87",
  //   watch: true,
  // });

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
  const { contract } = useContract({
    abi: abiCreate721Stacknet,
    address: testAddress,
  });

  // const calls = useMemo(() => {
  //   if (!address || !contract) return [];
  //   return contract.populateTransaction["safeMint"]!(address, 5);
  // }, [contract, address]);

  // const {
  //   writeAsync,
  //   data: dataWrite,
  //   isPending,
  // } = useContractWrite({
  //   calls,
  // });
  // const { data: dataRead } = useContractRead({
  //   functionName: "name",
  //   args: [],
  //   abi: abiCreate721Stacknet,
  //   address: testAddress,
  //   watch: true,
  // });
  // const { data: dataBalance } = useBalance({
  //   address,
  //   watch: true,
  // });
  const myTypedData: TypedData = {
    domain: {
      name: "Demask Finance",
      chainId: constants.StarknetChainId.SN_SEPOLIA,
      version: "0.2.0",
    },
    types: {
      StarkNetDomain: [
        { name: "name", type: "string" },
        { name: "chainId", type: "felt" },
        { name: "version", type: "string" },
      ],
      Message: [{ name: "message", type: "felt" }],
    },
    primaryType: "Message",
    message: { message: "1234" },
  };
  const {
    data: dataSign,
    isPending: isPendingSign,
    signTypedData,
  } = useSignTypedData(myTypedData);
  // console.log(dataBalance, dataRead);

  // if (isLoading) return <div>Loading ...</div>;
  // if (isError || !data) return <div>{error?.message}</div>;
  console.log(dataSign);
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  console.log(connectors);

  const { disconnect } = useDisconnect();
  return (
    <div className="text-white">
      <p onClick={testRead}>TEST</p>
      {address ? (
        <>
          <div className="flex flex-col gap-4">
            <Button onClick={() => disconnect()}>Disconnect</Button>
          </div>
          <Button
            className="w-full"
            onClick={() => signTypedData(myTypedData)}
            disabled={!address}
          >
            {isPendingSign ? (
              <BiLoader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Pencil1Icon className="h-4 w-4 mr-2" />
            )}
            Sign Message
          </Button>
        </>
      ) : (
        <div className="w-full flex ">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-10 h-10">Connect Wallet</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Connect Wallet</DialogHeader>
              <div className="flex flex-col gap-4">
                {connectors.map((connector: Connector) => (
                  <Button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    disabled={!connector.available()}
                  >
                    <Image
                      src={connector.icon.dark!}
                      alt="img"
                      width={20}
                      height={20}
                    />
                    Connect {connector.name}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default TestPage;
