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
export default function Layout({ children }: PropsWithChildren) {
  const { chainId, updateChainId, updateAccount, wallet } = useContext(AccountContext);
  const router = useRouter();
  const { user, accessToken, isLoggedIn, profile } = useSelector(selectProfile);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (router.isReady) {
  //     if (!router.query.chain) {
  //       router.push({
  //         pathname: router.pathname,
  //         query: { ...router.query, chain: router.query.chain },
  //       });
  //     } else {
  //       updateChainId(router.query.chain);
  //     }
  //   }
  // }, [chainId, router.asPath, router.isReady]);
  useEffect(() => {
    if (router.isReady) {
      if (!router.query.chain) {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, chain: chainId },
        });
      } else {
        updateChainId(router.query.chain);
      }
      // const { slug } = router.query;
      // if (slug) {
      //   if (router.query.chain === '280') {
      //     router.replace(`/swap/0x59620b99146C56785b067f84237fa80D89588228/0x20b28b1e4665fff290650586ad76e977eab90c5d/581234443?chain=280`);
      //   } else if (router.query.chain === '5') {
      //     router.replace(`/swap/0x6c216dfafc944c46582a34d9f87532d00080c61a/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6/8910040055?chain=5`);
      //   }
      // }
    }
  }, [router.query.chain, router.isReady, chainId]);
  console.log(chainId);
  useEffect(() => {
    if (user && accessToken && isLoggedIn) {
      userService.profileInfor().then((userInfo) => {
        dispatch(userData({ profile: userInfo?.data }))
      })
    }
  }, [user, accessToken, isLoggedIn])
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
              (PORT === "3000" && (networkId === "280" || networkId === "5")) ||
              (PORT === "1307" &&
                (networkId === "97" || networkId === "80001"))
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
    <div className="box-border w-full overflow-hidden">
      <Header />
      <main className="mt-[64px] lg:px-primary md:px-14 px-4">{children}</main>
      <Footer />
      <NavFooter reels={false} />
    </div>
  );
}
