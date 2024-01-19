import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
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
  ];
  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
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
      <li>
        <a href="https://docs.demask.finance/" target="_blank" rel="noopener noreferrer" className="text-base text-dark3">
          <p>Docs</p>
        </a>
      </li>
      <Search isFocused={isFocused} handleFocus={handleFocus} />
    </ul>
  );
};

export default MenuHeader;
