import abiErc20 from "@/abi/abiErc20.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getProvider } from "@/libs/connection/getProvider";

const useInformationToken = (
  account: string,
  tokenAddress: string,
  wallet: string
) => {
  const [balanceToken, setBalanceToken] = useState("0");
  const [bigNumberBalance, setBigNumberBalance] = useState("0");
  const [decimals, setDecimals] = useState("18");
  const [symbolToken, setSymbolToken] = useState("USDT");
  const [nameTokenERC20, setNameTokenERC20] = useState("");
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  );
  console.log(tokenAddress);
  useEffect(() => {
    const getBalanceToken = async () => {
      if (tokenAddress) {
        if (tokenAddress === "MATIC") {
          setDecimals("18");
          setSymbolToken("MATIC");
          try {
            const balance = await provider.getBalance(account);
            const balanceInMatic = parseFloat(
              ethers.utils.formatEther(balance)
            ).toFixed(4);
            setBalanceToken(balanceInMatic);
            setBigNumberBalance(balance.toString());
          } catch (error) {
            console.error(error);
          }
        } else {
          const contract = new ethers.Contract(
            tokenAddress,
            abiErc20,
            provider
          );
          const symbol = await contract.symbol();
          const name = await contract.name();
          setSymbolToken(symbol);
          setNameTokenERC20(name);
          try {
            const bigNumberBalance = await contract.balanceOf(account);
            setBigNumberBalance(bigNumberBalance.toString());
            const decimals = await contract.decimals();
            const decimalsInt = Number(decimals);
            const divisor = ethers.BigNumber.from(10).pow(decimalsInt);
            const balance = bigNumberBalance.div(divisor);
            console.log(symbol);
            setBalanceToken(balance.toString());
            setDecimals(decimals);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        setBalanceToken("0"); // No Account
      }
    };

    getBalanceToken();
    console.log(symbolToken);
    console.log(tokenAddress);
  }, [tokenAddress]);

  return {
    balanceToken,
    bigNumberBalance,
    decimals,
    nameTokenERC20,
    symbolToken,
  };
};

export default useInformationToken;
