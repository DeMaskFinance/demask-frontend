import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { starknet } from "@/libs/constants";
import { authenStarknet, getStarknetMessage } from "@/libs/service/userService";
import { login } from "@/store/profileSlice";
import { setCookie } from "@/utils/utilts.cookie";
import { Connector, useConnect } from "@starknet-react/core";
import Image from "next/image";
import { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { ArraySignatureType, ec } from "starknet";
import utilsConstants from "@/utils/utilts.contants";
import { LoadingIcon } from "@/components/Icons";

const styles = {
  walletItem:
    "items-center p-2 gap-x-4 text-white hidden lg:flex  hover:bg-shader_600  rounded-lg cursor-pointer text-sm font-semibold",
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
      const accounts = await provider.enable({
        starknetVersion: "v5",
      });

      const data = await getStarknetMessage(
        accounts[0],
        starknet.StarknetChainId.SN_SEPOLIA
      );

      // sign message
      const signature = (await provider.account.signMessage(
        data.data.typedData
      )) as ArraySignatureType;
      // convert ArraySignatureType to SignatureType
      const [r, s] = [signature.length - 2, signature.length - 1];

      const signatureCurve = new ec.starkCurve.Signature(
        BigInt(signature[r]),
        BigInt(signature[s])
      );
      const loginData = await authenStarknet(
        starknet.StarknetChainId.SN_SEPOLIA,
        {
          message: data.data.typedData.message.message,
          userAddress: accounts[0],
          signature: signatureCurve.toCompactHex(),
        }
      );
      dispatch(
        login({ accessToken: loginData.accessToken, user: accounts[0] })
      );
      updateAccount(accounts[0]);
      updateChainId(starknet.StarknetChainId.SN_SEPOLIA);
      updateWallet(connector.id);
      setCookie({
        key: utilsConstants.WALLET_CONNECT,
        value: connector.name,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
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
          className={`${styles.walletItem} justify-start ${
            connector.name === "Braavos" || loading
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
