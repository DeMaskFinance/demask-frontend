import { LoadingIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { starknet } from "@/libs/constants";
import { authenStarknet, getStarknetMessage } from "@/libs/service/userService";
import { login } from "@/store/profileSlice";
import utilsConstants from "@/utils/utilts.contants";
import { setCookie } from "@/utils/utilts.cookie";
import { Connector, useConnect } from "@starknet-react/core";
import Image from "next/image";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { ArraySignatureType, constants, ec, RpcProvider, WalletAccount } from "starknet";

const styles = {
  walletItem:
    "items-center p-2 gap-x-4 text-white hidden lg:flex  hover:bg-shader_600  rounded-lg cursor-pointer text-sm font-semibold",
};


const getRPCProvider = () => {
  const RPC_Provider = new RpcProvider({
    nodeUrl: constants.NetworkName.SN_MAIN,
    chainId: starknet.StarknetChainId.SN_SEPOLIA as any,
  });

  return {
    RpcProvider: RPC_Provider,
  };
};

const getWalletAccount = (provider: any) => {
  const { RpcProvider } = getRPCProvider();

  const instance = Object.freeze<any>(provider);

  return new WalletAccount(RpcProvider, instance);
};

const StarknetWallet = () => {
  const { connectors } = useConnect();
  const dispatch = useDispatch();
  const { updateAccount, updateWallet, updateChainId } =
    useContext(AccountContext);




  const [loading, setLoading] = useState<boolean>(false);
  const handleConnect = async (connector: Connector) => {
    try {
      setLoading(true);
      const provider = await getProvider(connector.id);

      console.log(connector, provider)

      const getWallet = getWalletAccount(provider);

      const accounts = await getWallet.requestAccounts();
      console.log(accounts)
      const userAddress = accounts[0];

      const { data } = await getStarknetMessage(userAddress, starknet.StarknetChainId.SN_SEPOLIA);
      const typedMessage = data.typedData;

      const signature = await getWallet.signMessage(typedMessage) as ArraySignatureType;

      if (signature.length < 2) throw new Error("Invalid signature format");
      const [r, s] = [signature.length - 2, signature.length - 1];


      const signatureCurve = new ec.starkCurve.Signature(
        BigInt(signature[r]),
        BigInt(signature[s])
      );

      console.log({
        r, s, signature: signatureCurve.toCompactHex()
      })

      const loginData = await authenStarknet(starknet.StarknetChainId.SN_SEPOLIA, {
        message: typedMessage.message.message,
        userAddress,
        signature: signatureCurve.toCompactHex(),
      });

      dispatch(login({ accessToken: loginData.accessToken, user: userAddress }));
      updateAccount(userAddress);
      updateChainId(starknet.StarknetChainId.SN_SEPOLIA);
      updateWallet(connector.id);
      setCookie({ key: utilsConstants.WALLET_CONNECT, value: connector.name });
    } catch (error) {
      console.error("Error in handleConnect:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="mt-4 font-semibold flex flex-col gap-y-2">
      {connectors.map((connector: Connector) => (
        <button
          key={connector.id}
          type="submit"
          onClick={() => handleConnect(connector)}
          disabled={connector.name === "Braavos"}
          className={`${styles.walletItem} justify-start ${connector.name === "Braavos" || loading
            ? "!hover:bg-none hover:cursor-not-allowed opacity-60"
            : ""
            }`}
        >
          <Image src={connector.icon.dark!} alt="img" width={34} height={34} />
          <div className="flex items-center justify-between w-full">
            <p className="">{connector.name}</p>

            {connector.name !== "Braavos" && (
              <p className="text-xs font-semibold text-slate-300">
                {loading ? (
                  <LoadingIcon
                    width={20}
                    height={20}
                    className="animate-spin"
                  />
                ) : (
                  "Normally"
                )}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default StarknetWallet;
