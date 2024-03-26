import AccountContext from "@/context/AccountContext";
import React, { Fragment, useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import { useRouter } from "next/router";
interface MenuHeaderProps { }
const MenuHeader: React.FC<MenuHeaderProps> = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { demask, chainId } = useContext(AccountContext);
  const data = [
    { id: 1, name: "Mint", url: "/mint" },
    { id: 2, name: "Launchpad", url: "/launchpad" },
    { id: 3, name: "Swap", url: `/swap` },
    { id: 4, name: "Pools", url: "/pools" },
    { id: 5, name: "Leaderboard", url: "/leaderboard" },
  ];
  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <div className="flex gap-x-8">
      <ul className="flex items-center text-lg font-medium 3xl:gap-x-8 text-dark2 gap-x-8">
      {data.map((item) => (
        <React.Fragment key={item.id}>
          <li className="relative text-base hover:text-secondary5 active:text-secondary3">
            <ActiveLink href={`${item?.url}?chain=${chainId}`}>
              <p className="text-dark3">{item.name}</p>
            </ActiveLink>
          </li>
        </React.Fragment>
      ))}
    </ul>
      <Search isFocused={isFocused} handleFocus={handleFocus} />
    </div>

  );
};

export default MenuHeader;
