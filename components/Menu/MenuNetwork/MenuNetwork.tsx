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
    "flex items-center p-2 transition-all duration-150 ease-in rounded-lg cursor-pointer border hover:border-secondary5 border-white hover:text-secondary5 active:text-secondary3",
  btnWallet:
    "flex items-center justify-center py-1 pl-2 lg:px-4 pr-2 text-sm font-medium transition duration-150 ease-out border rounded-lg group hover:bg-white bg-secondary2 active:bg-secondary3 text-white hover:text-secondary2 gap-x-2 border-secondary2",
};
interface networkProps {
  name: string;
  logo: any;
  chain: string;
  sign: string;
  disable?: boolean;
}
const MenuNetwork: React.FunctionComponent<MenuNetworkProps> = () => {
  const [filterNetwork, setFilterNetwork] = useState<networkProps | undefined>(
    network[0]
  );
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const { updateChainId, chainId, wallet, demask, account,chainName,updateChainName } =
    useContext(AccountContext);
  const [tab, setTab] = useQueryParam(
    "chain",
    withDefault(StringParam, chainId)
  );
  const router = useRouter();
  const { isLoggedIn } = useSelector(selectProfile);
  // const handleChangeNetwork = async (chain: string) => {
  //   if (account && wallet && isLoggedIn) {
  //     const check = await changeNetwork(
  //       chain,
  //       wallet,
  //       demask,
  //       setIsWrongNetwork,
  //       updateChainId,
  //       setTab
  //     );
  //     if (check) {
  //       router.replace(`/swap?chain=${chain}`);
  //     }
  //   } else {
  //     updateChainId(chain);
  //     setTab(chain);
  //     router.replace(`/swap?chain=${chain}`);
  //   }
  // };
  const handleChangeNetwork = (item: any) => {
    if (item.chain !== "1") {
      updateChainId(item.chain);
      updateChainName(item.sign);
    }
  };
  useEffect(() => {
    if (chainName) {
      const foundNetwork = network.find((item) => item.sign === chainName);
      setFilterNetwork(foundNetwork);
    } else {
      setFilterNetwork(network[1]);
    }
  }, [chainName]);

  const LogoComponent: any = filterNetwork?.logo;
  return (
    <Tippy
    className=""
    interactive
    render={(attrs) => (
      <div
        className="w-[280px] px-2 pt-1 pb-1 bg-white border text-sm rounded-lg shadow-xl box border-dark4 font-medium"
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
              } gap-x-2 group justify-between items-center active:bg-dark4 ${
                item.disable ? "hover:cursor-no-drop" : ""
              } `}
              onClick={() => handleChangeNetwork(item)}
            >
              <div className="flex items-center gap-x-2">
                <item.logo
                  width={24}
                  height={24}
                  className={`fill-dark2  ${
                    filterNetwork?.sign === item.sign && "fill-secondary5"
                  }`}
                />
                <p
                  className={`${
                    filterNetwork?.sign === item.sign &&
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
      <LogoComponent width={24} height={24} className=" fill-white" />
      <p className="hidden 2xl:block">{filterNetwork?.name}</p>
      <span className="2xl:hidden">
        <BsCaretDownFill />
      </span>
    </button>
  </Tippy>
  );
};

export default MenuNetwork;
