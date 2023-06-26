import  abiErc20  from '@/abi/abiErc20.json';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getProvider } from '@/libs/connection/getProvider';

const useBalanceToken = (account:string, tokenAddress:string, wallet:string) => {
  const [balanceToken, setBalanceToken] = useState("0");
  const [bigNumberBalance, setBigNumberBalance] = useState('0');
  const [decimals, setDecimals] = useState(null);

  useEffect(() => {
    const getBalanceToken = async () => {
      if (account && tokenAddress) {
        if (tokenAddress === "MATIC") {
          const provider = new ethers.providers.JsonRpcProvider(
            "https://rpc.ankr.com/polygon_mumbai"
          );
          try {
            const balance = await provider.getBalance(account);
            const balanceInMatic = parseFloat(
              ethers.utils.formatEther(balance)
            ).toFixed(4);
            setBalanceToken(balanceInMatic);
          } catch (error) {
            console.error(error);
          }
        } else {
          const providerChoice = getProvider(wallet);
          const provider = new ethers.providers.Web3Provider(providerChoice);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(tokenAddress, abiErc20, signer);
          try {
            const bigNumberBalance = await contract.balanceOf(account);
            setBigNumberBalance(bigNumberBalance.toString());
            const decimals = await contract.decimals();
            const decimalsInt = Number(decimals);
            const divisor = ethers.BigNumber.from(10).pow(decimalsInt);
            const balance = bigNumberBalance.div(divisor);
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
  }, [account, tokenAddress, wallet]);

  return { balanceToken, bigNumberBalance, decimals };
};

export default useBalanceToken;