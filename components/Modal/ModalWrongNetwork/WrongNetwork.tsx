import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { logout, selectProfile } from "@/store/profileSlice";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { WarningIcon } from "../../Icons";
import Wrapper from "../Wrapper";

interface WrongNetworkProps { }
const WrongNetwork: React.FC<WrongNetworkProps> = () => {
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const {
    account,
    wallet,
    chainId,
    demask,
    tokenDefault,
    updateAccount,
    updateChainId,
  } = useContext(AccountContext);
  const { isLoggedIn } = useSelector(selectProfile);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      account &&
      wallet &&
      router.isReady &&
      isLoggedIn &&
      chainId &&
      wallet !== "WalletConnect" &&
      wallet !== "argentX" &&
      wallet !== "braavos"
    ) {
      const checkNetwork = async () => {
        const provider = await getProvider(wallet);
        const networkId = await provider.request({ method: "net_version" });
        if (networkId !== chainId) {
          setIsWrongNetwork(true);
        } else {
          setIsWrongNetwork(false);
          document.body.style.overflowY = "auto";
        }
      };
      checkNetwork();
    } else {
      setIsWrongNetwork(false);
    }
  }, [chainId, account, wallet, router.isReady]);

  const disconnectWallet = () => {
    localStorage.removeItem("ACCOUNT_DEMASK");
    // localStorage.removeItem("WALLET_DEMASK");
    updateAccount("");
    setIsWrongNetwork(false);
    dispatch(logout());
    document.body.style.overflowY = "auto";
  };

  return (
    <Wrapper isOpen={isWrongNetwork}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg p-6 relative">
         
          <h3 className="my-4 font-medium text-shader_100">
            Currently Demask only supported in Monad Testnet
          </h3>



          <h2 className="font-medium text-yellow">Warning</h2>
          <div className="flex my-4 gap-x-3">
            <WarningIcon />
            <p className=" text-yellow">
              Please switch your network to continue
            </p>
          </div>
          <div className="flex justify-between px-0 lg:px-6">
            <a href="https://monad-networks-testnet.vercel.app/" target="_blank"
              className="p-2 text-sm font-medium text-white rounded-lg bg-primary_500"
              // onClick={() =>
              //   changeNetwork(
              //     chainId,
              //     wallet,
              //     demask,
              //     setIsWrongNetwork,
              //     updateChainId
              //   )
              // }
            >
              Switch Network
            </a>
            <button
              className="p-2 text-sm font-medium text-white rounded-lg bg-red"
              onClick={disconnectWallet}
            >
              Disconnect wallet
            </button>
          </div>
          <button
            className="absolute top-0 right-0 p-2 text-lg"
            onClick={disconnectWallet}
          >
            <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default WrongNetwork;
