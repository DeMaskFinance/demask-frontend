import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { starknet } from "@/libs/constants";
import { authenStarknet, getStarknetMessage } from "@/libs/service/userService";
import { login } from "@/store/profileSlice";
import { Connector, useConnect } from "@starknet-react/core";
import Image from "next/image";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { ArraySignatureType, ec } from "starknet";
const styles = {
  walletItem:
    "items-center p-2 gap-x-4 text-white hidden lg:flex  hover:bg-shader_600  rounded-lg cursor-pointer text-sm font-semibold",
};
const StarknetWallet = () => {
  const { connectors } = useConnect();
  const dispatch = useDispatch();
  const { updateAccount, updateWallet } = useContext(AccountContext);
  const handleConnect = async (connector: Connector) => {
    try {
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
      console.log(signature);
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
      updateWallet(connector.id);
    } catch (error) {
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
          disabled={!connector.available()}
          className={`${styles.walletItem} justify-start`}
        >
          <Image src={connector.icon.dark!} alt="img" width={34} height={34} />
          {connector.name}
        </button>
      ))}
    </div>
  );
};

export default StarknetWallet;
