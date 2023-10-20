import AccountContext from "@/context/AccountContext";
import React, { useContext, useState } from "react";
import { ActiveLink } from "../Link";
import Search from "../Search/SearchHeader";
import { useRouter } from "next/router";
interface MenuHeaderProps { }
const MenuHeader: React.FC<MenuHeaderProps> = () => {
  const [isFocused, setIsFocused] = useState(false);
  const { demask } = useContext(AccountContext);
  const router = useRouter();
  const data = [
    { id: 1, name: "Mint", url: "/mint" },
    { id: 2, name: "Launchpad", url: "/launchpad" },
    { id: 3, name: "Swap", url: `/swap/${demask.CREATOR}/${demask.NATIVE_ADDRESS}/${demask.IDNFT}` },
    { id: 4, name: "Pools", url: "/pools" },
    { id: 5, name: "Docs", url: "https://docs.demask.finance/" },
  ];
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  return (
    <ul className="flex items-center text-lg font-medium 3xl:gap-x-8 text-dark2 gap-x-8">
      {data.map((item) => (
        <React.Fragment key={item.id}>
          <li className="relative text-base hover:text-secondary5 active:text-secondary3">
            <ActiveLink href={item?.url as string}>
              <p>{item.name}</p>
            </ActiveLink>
          </li>
        </React.Fragment>
      ))}

      <Search isFocused={isFocused} handleFocus={handleFocus} />
    </ul>
  );
};

export default MenuHeader;
