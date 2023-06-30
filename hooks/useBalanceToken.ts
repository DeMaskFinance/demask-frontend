import abiErc20 from "@/abi/abiErc20.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getProvider } from "@/libs/connection/getProvider";

const useBalanceToken = (
  account: string,
  tokenAddress: string,
  wallet: string
) => {
  const [balanceToken, setBalanceToken] = useState("0");
  const [bigNumberBalance, setBigNumberBalance] = useState("0");
  const [decimals, setDecimals] = useState("18");
  const [symbolToken,setSymbolToken] = useState("");
  const [nameTokenERC20,setNameTokenERC20]  = useState('');
  const provider = new ethers.providers.JsonRpcProvider(
    "https://rpc.ankr.com/polygon_mumbai"
  );
  useEffect(() => {
    const getBalanceToken = async () => {
      if (account && tokenAddress) {
        if (tokenAddress === "MATIC") {
          try {
            const balance = await provider.getBalance(account);
            const balanceInMatic = parseFloat(
              ethers.utils.formatEther(balance)
            ).toFixed(4);
            setBalanceToken(balanceInMatic);
            setBigNumberBalance(balance.toString());
            setDecimals("18");
            setSymbolToken("MATIC")
          } catch (error) {
            console.error(error);
          }
        } else {
          const contract = new ethers.Contract(
            tokenAddress,
            abiErc20,
            provider
          );
          try {
            const bigNumberBalance = await contract.balanceOf(account);
            setBigNumberBalance(bigNumberBalance.toString());
            const decimals = await contract.decimals();
            const decimalsInt = Number(decimals);
            const divisor = ethers.BigNumber.from(10).pow(decimalsInt);
            const balance = bigNumberBalance.div(divisor);
            const symbol = await contract.symbol();
            const name = await contract.name();
            setBalanceToken(balance.toString());
            setDecimals(decimals);
            setSymbolToken(symbol);
            setNameTokenERC20(name);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        setBalanceToken("0"); // No Account
      }
    };

    getBalanceToken();
  }, [account, tokenAddress, wallet]);

  return { balanceToken, bigNumberBalance, decimals ,nameTokenERC20 ,symbolToken};
};

export default useBalanceToken;
