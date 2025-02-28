import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { CreateIcon, DiamondIcon, SeeMoreIcon, SwapIcon } from "../Icons";
import { LaunchpadIcon, PoolIcon } from "../Icons/Mobile/IconMobile";

const moreNav = [
  { id: 1, name: "Create", url: "/create" },
  { id: 2, name: "Category", url: "/category" },
  { id: 3, name: "Referral", url: "/referral" },
  { id: 4, name: "Trade", url: `/trade` },
  { id: 5, name: "Pools", url: "/pools" },
];
const data = [
  { id: 1, name: "Explorer", url: "/explorer", icon: PoolIcon },
  { id: 2, name: "Create", url: "/create", icon: CreateIcon },
  { id: 3, name: "Launchpad", url: "/launchpad", icon: LaunchpadIcon },
  { id: 4, name: "Leaderboard", url: `/leaderboard`, icon: DiamondIcon },

  {
    id: 5,
    name: "Others",
    icon: SeeMoreIcon,
  },
];
export default function NavFooter() {
  const [active, setActive] = useState<boolean>(false);
  const router = useRouter();
  const footerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      let prevScrollPos = window.scrollY;

      const handleScroll = () => {
        const currentScrollPos = window.scrollY;
        const isScrolledUp = prevScrollPos > currentScrollPos;
        if (footerRef.current) {
          const headerClassList = footerRef.current.classList;
          headerClassList.toggle("translate-y-0", isScrolledUp);
          headerClassList.toggle(
            "translate-y-[100%]",
            !isScrolledUp && currentScrollPos > 120
          );
        }

        prevScrollPos = currentScrollPos;
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);
  return (
    <>
      <div
        onClick={() => {
          setActive(false);
        }}
        className={`bgshader_900 ${active ? "block" : "hidden"
          } opacity-40 fixed overflow-hidden lg:hidden top-0 right-0 left-0 bottom-0 w-full h-full z-20`}
      ></div>
      <footer
        ref={footerRef}
        className="fixed bottom-0 z-20 w-full bg-shader_900 lg:hidden transition-all duration-300"
      >
        <ul className="border-t flex justify-between h-16 text-[10px] items-center border-shader_500 relative">
          {data.map((item, index) => (
            <Fragment key={index}>
              {item.url ? (
                <li className="flex items-center justify-center flex-1 h-full relative">
                  {router.pathname === item.url && (
                    <div
                      className={`absolute transition-transform duration-100 ease-linear border-t-[3px] border-primary_500 h-full top-0 w-full`}
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(144, 117, 254, 0.15) 0%, rgba(144, 117, 254, 0.00) 100%)",
                      }}
                    ></div>
                  )}
                  <Link
                    href={`${item.url}`}
                    className={`flex flex-col items-center gap-2 w-full h-full justify-center`}
                  >
                    {
                      <item.icon
                        width={20}
                        height={20}
                        className="text-white"
                      />
                    }
                    <p className="text-white font-semibold">{item.name}</p>
                  </Link>
                </li>
              ) : (
                <li
                  className="flex items-center flex-col text-white justify-center flex-1 h-full gap-2 relative"
                  onClick={() => {
                    setActive(true);
                  }}
                >
                  {<item.icon width={20} height={20} className="text-white" />}
                  {item.name}
                </li>
              )}
            </Fragment>
          ))}

          {active && (
            <div className="absolute left-0 right-0 bottom-16">
              <div
                className="top-0 bottom-16 left-0 right-0 bg-[rgba(0,0,0,0.65)] -z-10 fixed"
                onClick={() => setActive(false)}
              ></div>
              <div className=" bg-shader_800 text-white h-[50vh] rounded-t-xl z-50">
                <div className="text-sm  items-center font-semibold h-12 flex justify-between px-3">
                  <p>More</p>
                  <button className="text-lg " onClick={() => setActive(false)}>
                    <CgClose className="text-xl text-white transition-colors duration-100 ease-linear cursor-pointer hover:text-red" />
                  </button>
                </div>
                {moreNav.map((moreItem) => (
                  <Link
                    key={moreItem.id}
                    href={`${moreItem.url}`}
                    className="text-sm item_menu h-12 px-3"
                    onClick={() => {
                      setActive(false);
                    }}
                  >
                    {moreItem.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ul>
      </footer>
    </>
  );
}
