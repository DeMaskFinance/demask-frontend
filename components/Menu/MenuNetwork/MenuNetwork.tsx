import AccountContext from "@/context/AccountContext";
import { network } from "@/libs/constants";
import { changeNetwork } from "@/libs/utils/changeNetwork";
import { selectProfile } from "@/store/profileSlice";
import Tippy from "@tippyjs/react/headless";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { BsCaretDownFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import "tippy.js/dist/tippy.css"; // optional
import { StringParam, useQueryParam, withDefault } from "use-query-params";
interface MenuNetworkProps {}
const style = {
  itemSub:
    "flex items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer hover:bg-dark5 text-dark2 font-semibold",
  btnWallet:
    "flex items-center 2xl:w-[184px] hover:border-dark2 dark:hover:bg-dark2 py-2 pl-2 lg:px-4 pr-2 dark:bg-dark1 justify-center text-sm font-medium transition duration-150 ease-out rounded-lg group hover:bg-dark4 bg-dark5 active:bg-dark3 text-dark2 dark:text-white gap-x-2 ",
};
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
  const { updateChainId, chainId, wallet, demask, account } =
    useContext(AccountContext);
  const [tab, setTab] = useQueryParam(
    "chain",
    withDefault(StringParam, chainId)
  );
  const router = useRouter();
  const { isLoggedIn } = useSelector(selectProfile);
  const handleChangeNetwork = async (chain: string) => {
    if (account && wallet && isLoggedIn) {
      const check = await changeNetwork(
        chain,
        wallet,
        demask,
        setIsWrongNetwork,
        updateChainId,
        setTab
      );
      if (check) {
        router.replace(`/swap?chain=${chain}`);
      }
    } else {
      updateChainId(chain);
      setTab(chain);
      router.replace(`/swap?chain=${chain}`);
    }
  };
  useEffect(() => {
    if (router.query.chain) {
      const foundNetwork = network.find(
        (item) => item.chain === router.query.chain
      );
      setFilterNetwork(foundNetwork);
    } else {
      setFilterNetwork(network[0]);
    }
  }, [router.query.chain, router.isReady]);

  const LogoComponent: any = filterNetwork?.logo;
  return (
    <Tippy
      className=""
      interactive
      render={(attrs) => (
        <div
          className="w-[280px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium dark:bg-darkBG0 dark:border-none"
          tabIndex={-1}
          {...attrs}
        >
          <p className="p-2 text-base border-b-[1px] border-dark3">
            Select a network
          </p>
          <ul className="flex flex-col mt-2 font-normal gap-y-3">
            {network.map((item, index) => (
              <li
                key={index}
                className={`${
                  style.itemSub
                } gap-x-2 group justify-between area_input_hover items-center active:bg-dark4 ${
                  item.disable ? "hover:cursor-no-drop" : ""
                } `}
                onClick={() => !item.disable && handleChangeNetwork(item.chain)}
              >
                <div className="flex items-center gap-x-2">
                  <item.logo
                    width={24}
                    height={24}
                    className={`fill-dark2  ${
                      filterNetwork?.chain === item.chain && "fill-secondary5"
                    }`}
                  />
                  <p
                    className={`${
                      filterNetwork?.chain === item.chain &&
                      "text-secondary5 font-medium"
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
                {item.disable && <p className="right-0 text-xs">Upcoming</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    >
      <button className={`${style.btnWallet} flex`}>
        <LogoComponent width={24} height={24} className="dark:fill-white" />
        <p className="hidden 2xl:block">{filterNetwork?.name}</p>
        <span className="2xl:hidden">
          <BsCaretDownFill />
        </span>
      </button>
    </Tippy>
  );
};

export default MenuNetwork;
