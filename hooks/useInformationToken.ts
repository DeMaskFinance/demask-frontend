import abiErc20 from "@/abi/abiErc20.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getProvider } from "@/libs/connection/getProvider";

const useInformationToken = (
  account: string,
  tokenAddress: string,
  wallet: string,
  routerAddress: string,
  rpc: string,
  nativeAddress: string,
  isOpenTransaction?: boolean
) => {
  const [balanceToken, setBalanceToken] = useState("0");
  const [bigNumberBalance, setBigNumberBalance] = useState("0");
  const [decimals, setDecimals] = useState("18");
  const [nameTokenERC20, setNameTokenERC20] = useState("");
  const [allowanceToken, setAllowanceToken] = useState("");
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  useEffect(() => {
    const getInformationToken = async () => {
      if (tokenAddress && account && nativeAddress) {
        if (tokenAddress === nativeAddress) {
          setDecimals("18");
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
          setNameTokenERC20(name);
          try {
            const bigNumberBalance = await contract.balanceOf(account);
            setBigNumberBalance(bigNumberBalance.toString());
            const decimals = await contract.decimals();
            const decimalsInt = Number(decimals);
            const divisor = ethers.BigNumber.from(10).pow(decimalsInt);
            const balance = bigNumberBalance.div(divisor);
            setBalanceToken(balance.toString());
            setDecimals(decimals);
            const tokenAllowance = await contract.allowance(
              account,
              routerAddress
            );
            const currentAllowance = tokenAllowance.toString();
            setAllowanceToken(currentAllowance);
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        setBalanceToken("0"); // No Account
      }
    };

    getInformationToken();
  }, [tokenAddress, account, wallet, isOpenTransaction]);

  return {
    balanceToken,
    bigNumberBalance,
    decimals,
    nameTokenERC20,
    allowanceToken,
  };
};

export default useInformationToken;
