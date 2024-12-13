import { DownIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import { network } from "@/libs/constants";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { logout, selectProfile } from "@/store/profileSlice";
import Tippy from "@tippyjs/react/headless";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "tippy.js/dist/tippy.css"; // optional
interface MenuNetworkProps {}
interface networkProps {
  name: string;
  logo: React.FC;
  chain: string;
}
const MenuNetwork: React.FunctionComponent<MenuNetworkProps> = () => {
  const [filterNetwork, setFilterNetwork] = useState<networkProps | undefined>(
    network[0]
  );
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const { updateChainId, chainId, wallet, demask, account, updateAccount } =
    useContext(AccountContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn } = useSelector(selectProfile);
  const disconnectWallet = () => {
    localStorage.removeItem("ACCOUNT_DEMASK");
    updateAccount("");
    dispatch(logout());
  };
  const handleChangeNetwork = async (chain: string) => {
    const targetNetwork = network.find((net) => net.chain === chain);
    const currentNetwork = network.find((net) => net.chain === chainId);

    if (!targetNetwork || !currentNetwork) return;

    const isDifferentChainType = targetNetwork.type !== currentNetwork.type;

    if (account && wallet && isLoggedIn) {
      if (isDifferentChainType) {
        disconnectWallet();
        updateChainId(chain);
      }

      if (targetNetwork.type === "EVM" && currentNetwork.type === "EVM") {
        await changeNetwork(
          chain,
          wallet,
          demask,
          setIsWrongNetwork,
          updateChainId
        );
      }

      updateChainId(chain);
      router.replace(`/trade`);
    } else {
      updateChainId(chain);
      router.replace(`/trade`);
    }
  };
  useEffect(() => {
    const foundNetwork = network.find((item) => item.chain === chainId);
    if (foundNetwork) {
      setFilterNetwork(foundNetwork);
    } else {
      updateChainId(network[0].chain);
      setFilterNetwork(network[0]);
    }
  }, [chainId]);

  const LogoComponent: any = filterNetwork?.logo;

  return (
    <Tippy
      className=""
      interactive
      render={(attrs) => (
        <div className="w-[234px] menu " tabIndex={-1} {...attrs}>
          <ul className="flex flex-col gap-y-[6px]">
            {network.map((item, index) => (
              <li
                key={index}
                className={`item_menu gap-x-2 group justify-between  items-center  ${
                  item.disable ? "hover:cursor-no-drop" : ""
                } `}
                onClick={() => !item.disable && handleChangeNetwork(item.chain)}
              >
                <div
                  className={`flex items-center gap-x-2 font-semibold ${
                    item.disable && "opacity-30"
                  }`}
                >
                  <item.logo width={24} height={24} />
                  <p>{item.name}</p>
                </div>
                {item.disable && (
                  <p className="right-0 text-xs text-primary_300">Upcoming</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    >
      <button
        className={`flex items-center px-[10px] md:px-3 h-10 py-2  justify-center text-sm font-semibold text-white transition duration-200 ease-out rounded-lg group  bg-primary_500  gap-x-2 bg-opacity-[15%] hover:bg-opacity-[25%]`}
      >
        <LogoComponent width={20} height={20} className="" />
        <p className="hidden 2xl:block whitespace-nowrap">
          {filterNetwork?.name}
        </p>
        <span className="text-shader_100 2xl:hidden">
          <DownIcon width={20} height={20} />
        </span>
      </button>
    </Tippy>
  );
};

export default MenuNetwork;
