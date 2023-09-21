import Link from "next/link";
import { ProfileIcon, SearchIcon } from "../Icons";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { useState, useEffect, useContext } from "react";
import Tippy from "@tippyjs/react";
import { MdLogout } from "react-icons/md";
import Icons from "@/public/icons/icon";
import { AiOutlineClose } from "react-icons/ai";
import { useRouter } from "next/router";
import { LogoDeMask } from "../Logo/Logo";
import AccountContext from "@/context/AccountContext";
interface MenuMobileProps {
  account: string;
  handleOpen: any;
  style: any;
  disconnectWallet: any;
  openMenu: boolean;
  setOpenMenu: any;
}
const MenuMobile: React.FC<MenuMobileProps> = ({
  account,
  handleOpen,
  style,
  disconnectWallet,
  openMenu,
  setOpenMenu,
}) => {
  const [activeTrade, setActiveTrade] = useState(true);
  const [activeCat, setActiveCat] = useState(true);
  const { demask } = useContext(AccountContext);
  const buttonConnect = (
    <div>
      {account ? (
        <Tippy
          interactive
          render={(attrs) => (
            <div
              className="w-[200px] h-[100px] border rounded-lg shadow-xl box bg-white border-dark4 pb-1 pt-1"
              tabIndex={-1}
              {...attrs}
            >
              <ul>
                <li className={`${style.itemSub}`}>Proflie</li>
                <li
                  className={`${style.itemSub} justify-between`}
                  onClick={disconnectWallet}
                >
                  <div>Disconnect</div>
                  <MdLogout />
                </li>
              </ul>
            </div>
          )}
        >
          <button className={style.btnWallet}>
            {`${account.slice(0, 2)}...${account.slice(-4)}`}
            <ProfileIcon
              width={24}
              height={24}
              className="group-hover:fill-white"
            />
          </button>
        </Tippy>
      ) : (
        <button className={style.btnWallet} onClick={handleOpen}>
          <p>
            CONNECT{" "}
            <span className="hidden lg:inline-block md:inline-block">
              WALLET
            </span>
          </p>
          <Image
            className="group-hover:hidden"
            src={Icons.wallet}
            alt="wallet connect"
          />
          <Image
            className="hidden group-hover:block"
            src={Icons.walletHover}
            alt="wallet connect hover"
          />
        </button>
      )}
    </div>
  );

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setOpenMenu(false);
    };

    if (window.innerWidth <= 768) {
      router.events.on("routeChangeStart", handleRouteChange);
    }

    return () => {
      if (window.innerWidth <= 768) {
        router.events.off("routeChangeStart", handleRouteChange);
      }
    };
  }, [router, setOpenMenu]);

  return (
    <div
      className={`${openMenu
          ? "translate-x-0 transition-all"
          : "-translate-x-[100%] transition-all"
        } bg-white lg:hidden md:flex flex flex-col fixed justify-between h-full top-0 right-0 z-[100] left-0 p-4 bottom-0 w-full`}
    >
      <div>
        <div className="flex items-center flex-shrink-0 gap-2">
          <div
            onClick={() => {
              setOpenMenu(false);
            }}
            className="pr-3 text-xl text-dark1"
          >
            <AiOutlineClose />
          </div>

          <div className="flex items-center justify-between w-full text-center">
            <div className="gap-2">
              <Link href="/">
                <LogoDeMask width={94} height={24} />
                {/* <Image
                  src={"/logoHeader.svg"}
                  alt=""
                  width={94}
                  height={24}
                ></Image> */}
              </Link>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-4">
                <SearchIcon
                  width={32}
                  height={32}
                  className="cursor-pointer active:fill-secondary3"
                />
              </div>
              {buttonConnect}
            </div>
          </div>
        </div>

        <div>
          <ul className="flex flex-col gap-4 pt-16 text-xl">
            <div>
              <li className="flex items-center justify-between mb-4">
                <Link href="/overview" className="flex items-center gap-2">
                  <Image
                    src={"/images/mobiles/overview.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Overview
                </Link>
              </li>
            </div>

            <div>
              <li
                onClick={() => {
                  setActiveTrade(!activeTrade);
                }}
                className="flex items-center justify-between mb-4"
              >
                <span className="flex items-center gap-2">
                  <Image
                    src={"/images/mobiles/trade.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Trade
                </span>
                <IoIosArrowForward
                  className={`${activeTrade ? "rotate-0" : "rotate-90"
                    } transition-all`}
                />
              </li>

              <ul
                className={`submenu ${activeTrade ? "max-h-0" : "visible"
                  } flex flex-col gap-4`}
              >
                <div className="flex flex-col gap-4 p-2 pl-8 border rounded-md">
                  <li>
                    <Link
                      href={
                        `/swap/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${process.env.NEXT_PUBLIC_IDNFT}`
                      }
                    >
                      Swap
                    </Link>
                  </li>
                  <li className="pb-2">
                    <Link href={"/liquidity"}>Liquidity</Link>
                  </li>
                </div>
              </ul>
            </div>

            <div>
              <li className="flex items-center justify-between mb-4">
                <Link href="/launchpad" className="flex items-center gap-2">
                  <Image
                    src={"/images/mobiles/laudpad.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Launchpad
                </Link>
              </li>
            </div>

            <div>
              <li
                onClick={() => {
                  setActiveCat(!activeCat);
                }}
                className="flex items-center justify-between mb-4"
              >
                <Link href="/category" className="flex items-center gap-2">
                  <Image
                    src={"/images/mobiles/category.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Category
                </Link>
                <IoIosArrowForward
                  className={`${activeCat ? "rotate-0" : "rotate-90"
                    } transition-all`}
                />
              </li>

              <ul
                className={`submenu ${activeCat ? "max-h-0" : "visible"
                  } flex flex-col gap-4`}
              >
                <div className="flex flex-col gap-4 p-2 pl-8 border rounded-md">
                  <li>
                    <Link href={"/category/art"}>Art</Link>
                  </li>
                  <li>
                    <Link href={"/category/gaming"}>Gaming</Link>
                  </li>
                  <li>
                    <Link href={"/category/memberships"}>Memberships</Link>
                  </li>
                  <li>
                    <Link href={"/category/music"}>Music</Link>
                  </li>
                  <li>
                    <Link href={"/category/others"}>Others</Link>
                  </li>
                </div>
              </ul>
            </div>
            <div>
              <li className="flex items-center justify-between mb-4">
                <Link href="/create" className="flex items-center gap-2">
                  <Image
                    src={"/images/mobiles/creator.svg"}
                    width={24}
                    height={24}
                    alt=""
                  />
                  Create
                </Link>
              </li>
            </div>
          </ul>
        </div>
      </div>

      <div className="flex flex-row-reverse justify-between">
        <div className="flex items-end gap-4 text-xl">
          <div>
            <li className="flex items-center justify-between mb-4">
              <Link
                href="https://docs.demask.finance/"
                className="flex items-center gap-2"
              >
                Docs
              </Link>
            </li>
          </div>
          <div>
            <li className="flex items-center justify-between mb-4">
              <Link href="/about" className="flex items-center gap-2">
                About
              </Link>
            </li>
          </div>
        </div>
        <Link href="/">
          {/* <LogoDemask width={94} height={24} /> */}
          <Image src={"/logoHeader.svg"} alt="" width={94} height={24}></Image>
        </Link>
      </div>
    </div>
  );
};

export default MenuMobile;
