import React, { useContext, useEffect } from "react";
import Header from "../Header";
import { PropsWithChildren } from "react";
import { Footer } from "../Footer";
import NavFooter from "../Footer/NavFooter";
import AccountContext from "@/context/AccountContext";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectProfile, userData } from "@/store/profileSlice";
import * as userService from "@/libs/service/userService";
import { getProvider } from "@/libs/connection/getProvider";
import { network } from "@/libs/constants";
import { Toaster } from "@/components/ui/sonner";
export default function Layout({ children }: PropsWithChildren) {
  const { chainId, updateChainId, updateAccount, wallet, isEvent } =
    useContext(AccountContext);
  const { user, accessToken, isLoggedIn, profile } = useSelector(selectProfile);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user && accessToken && isLoggedIn) {
      userService.profileInfor().then((userInfo) => {
        dispatch(userData({ profile: userInfo?.data }));
      });
    }
    if (isLoggedIn === false) {
      localStorage.removeItem("ACCOUNT_DEMASK");
      updateAccount("");
      dispatch(logout());
    }
  }, [user, accessToken, isLoggedIn]);
  const PORT = process.env.NEXT_PUBLIC_APP_PORT;
  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = await getProvider(wallet);

          const handleAccountsChanged = (account: []) => {
            localStorage.removeItem("ACCOUNT_DEMASK");
            localStorage.removeItem("WALLET_DEMASK");
            updateAccount("");
            dispatch(logout());
          };

          const handleChainChanged = (networkId: string) => {
            if (
              (PORT === "3000" &&
                (networkId === "11155111" || networkId === "5")) ||
              (PORT === "1307" && networkId === "168587773")
            ) {
              updateChainId(networkId);
            }
          };

          provider.on("accountsChanged", handleAccountsChanged);
          provider.on("chainChanged", handleChainChanged);

          return () => {
            provider.removeListener("accountsChanged", handleAccountsChanged);
            provider.removeListener("chainChanged", handleChainChanged);
          };
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    initProvider();
  }, [wallet]);
  return (
    <div className="box-border w-full overflow-visible">
      <Header />
      <main className={`lg:mb-0 mb-16 ${isEvent ? "mt-[104px]" : "mt-16"}`}>
        {children}
      </main>
      <Footer />
      <NavFooter />
      <Toaster richColors />
    </div>
  );
}
