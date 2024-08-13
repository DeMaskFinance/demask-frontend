import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Connector, useConnect } from "@starknet-react/core";
import Image from "next/image";
const styles = {
  walletItem:
    "items-center p-2 gap-x-4 text-white hidden lg:flex  hover:bg-shader_600  rounded-lg cursor-pointer text-sm font-semibold",
};
const StacknetWallet = () => {
  const { connect, connectors } = useConnect();
  const handleConnect = async (connector: Connector) => {
    try {
      await connect({ connector });
      document.getElementById("closeDialog")?.click();
      console.log(`Connected to ${connector.name}`);
    } catch (error) {
      console.error(`Failed to connect to ${connector.name}:`, error);
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

export default StacknetWallet;
