import {
  useConnect,
  useAccount,
  useBalance,
  useDisconnect,
  useContractRead,
  useContract,
  useContractWrite,
  useSignTypedData,
} from "@starknet-react/core";
import React, { useMemo } from "react";
import abiCreate721Stacknet from "@/abi/stacknet/abiCreate721Stacknet.json";
import abiContract from "@/abi/stacknet/contract_erc721_NFT.contract_class.json";
import { exampleData } from "@/libs/utils/exampleData";
const TestPage = () => {
  const { connect, connectors } = useConnect();
  const { account, address, status } = useAccount();
  const { disconnect } = useDisconnect();

  const { isLoading, isError, error, data } = useBalance({
    address:
      "0x7bdfe5ccdae97ec118aa02953570c16243e972cef09557698e15278a34b1c87",
    watch: true,
  });

  const testAddress =
    "0x07091a681ff4de9bd830573448c8605ff777999666aaf329fcb294717baeafb9";

  const { contract } = useContract({
    abi: abiCreate721Stacknet,
    address: testAddress,
  });

  const calls = useMemo(() => {
    if (!address || !contract) return [];
    return contract.populateTransaction["safeMint"]!(address, 5);
  }, [contract, address]);

  const {
    writeAsync,
    data: dataWrite,
    isPending,
  } = useContractWrite({
    calls,
  });
  const { data: dataRead } = useContractRead({
    functionName: "balance_of",
    args: [],
    abi: abiCreate721Stacknet,
    address: testAddress,
    watch: true,
  });
  const { data: dataBalance } = useBalance({
    address,
    watch: true,
  });
  const {
    data: dataSign,
    isPending: isPendingSign,
    signTypedData,
  } = useSignTypedData(exampleData);
  console.log(dataBalance);

  if (isLoading) return <div>Loading ...</div>;
  if (isError || !data) return <div>{error?.message}</div>;
  console.log(dataRead);

  return (
    <div className="text-white">
      {status === "connected" ? (
        <div>
          <p>{address}</p>
          <button onClick={() => writeAsync()}>Transfer</button>
          <p>status: {isPending && <div>Submitting...</div>}</p>
          <p>hash: {dataWrite?.transaction_hash}</p>
          <p className="w-full " onClick={() => signTypedData()}>
            {/* {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <PenLine className="h-4 w-4 mr-2" />
            )} */}
            Sign Message
          </p>
          <p onClick={() => disconnect()}>Disconnect</p>
        </div>
      ) : (
        <ul>
          {connectors.map((connector) => (
            <li key={connector.id}>
              <button onClick={() => connect({ connector })}>
                {connector.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TestPage;
