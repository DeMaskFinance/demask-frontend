import AccountContext from "@/context/AccountContext";
import useContractWrite from "@/hooks/useContractWrite";
import useInformationToken from "@/hooks/useInformationToken";
import { starknetContract } from "@/libs/utils/starknet/contract";
import { useContext } from "react";
import { CallData } from "starknet";
import { default as compiledTestSierra } from "@/abi/starknet/contract_erc721_NFT.contract_class.json";
import { deployContract } from "@/libs/utils/starknet/deployContract";
const TestPage = () => {
  const { account, wallet, chainId } = useContext(AccountContext);

  const ETHaddress =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

  const testAddress =
    "0x07091a681ff4de9bd830573448c8605ff777999666aaf329fcb294717baeafb9";
  const testRead = async () => {
    const contract = await starknetContract.getContract(testAddress);
    const bal1 = await contract.symbol();
    console.log(bal1);
  };
  const testClassHash =
    "0x047d48afafa3385a0310e6e52da873cc58cb1a56a8a93754f2a8bfc726e282d3";
  // const { writeAsync, data, isPending } = useContractWrite(
  //   wallet,
  //   testAddress,
  //   "safeMint",
  //   [
  //     account,
  //     "0x07bdFE5cCdaE97EC118aa02953570C16243E972CEF09557698E15278A34b1c87",
  //     86,
  //   ]
  // );
  const fetchBalance = async () => {
    try {
      const contract = await starknetContract.getContract(ETHaddress);
      console.log(contract, account);

      const balance = await contract.balanceOf(account);
      console.log(balance);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  // const deployContract = async () => {
  //   try {
  //     const contractConstructor = CallData.compile({
  //       owner: account,
  //     });
  //     const contractWallet = await starknetContract.getWalletAccount(wallet);
  //     const deployResponse = await contractWallet.deployContract({
  //       classHash: testClassHash,
  //       constructorCalldata: contractConstructor,
  //     });
  //     const data = await contractWallet.waitForTransaction(
  //       deployResponse.transaction_hash
  //     );
  //     console.log(deployResponse, data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  console.log(compiledTestSierra);
  const deployContractCollection = async () => {
    const ClassHash =
      "0x00e3b07bc6475e6e5f5d8b2214305549fc839c68b4d86a50a05768e20e045d52";

    try {
      const contractCallData = new CallData(compiledTestSierra.abi);
      const contractConstructor = contractCallData.compile("constructor", {
        owner: account,
        name: "ABC Collection",
        symbol: "ABC",
        id: 23243,
      });
      console.log(contractConstructor);
      const contractWallet = await starknetContract.getWalletAccount(wallet);
      const deployResponse = await contractWallet.deployContract({
        classHash: ClassHash,
        constructorCalldata: contractConstructor,
      });
      const data = await contractWallet.waitForTransaction(
        deployResponse.transaction_hash
      );
      console.log(deployResponse, data);
    } catch (error) {
      console.log(error);
    }
  };
  const { isLoadingBalance, balanceToken, bigNumberBalance } =
    useInformationToken(account, wallet, chainId);
  console.log({
    account,
    wallet,
    chainId,
    isLoadingBalance,
    balanceToken,
    bigNumberBalance,
  });

  return (
    <div className="text-white">
      <p onClick={testRead}>TEST</p>
      {/* <p onClick={getTransaction}>Write</p> */}
      {/* <p onClick={writeAsync}>Write hook</p> */}
      <p onClick={fetchBalance}>Balance</p>
      {/* <p
        onClick={async () => {
          await deployContract.deployContractCollection(account, wallet, 60);
        }}
      >
        deployContract
      </p> */}
      <p onClick={deployContractCollection}>deployContractCollection</p>
    </div>
  );
};

export default TestPage;
