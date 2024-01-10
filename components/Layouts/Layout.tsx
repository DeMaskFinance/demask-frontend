import React, { useContext, useEffect } from "react";
import Header from "../Header";
import { PropsWithChildren } from "react";
import { Footer } from "../Footer";
import NavFooter from "../Footer/NavFooter";
import AccountContext from "@/context/AccountContext";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile, userData } from "@/store/profileSlice";
import * as userService from "@/libs/service/userService";
export default function Layout({ children }: PropsWithChildren) {
  const { chainId, updateChainId } = useContext(AccountContext);
  const router = useRouter();
  const { user, accessToken, isLoggedIn, profile } = useSelector(selectProfile);
  const dispatch = useDispatch();
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
    }
  }, [chainId, router.asPath, router.isReady]);
  console.log({
    user,
    accessToken,
    isLoggedIn,
    profile
  });

  useEffect(() => {
    if (user && accessToken && isLoggedIn) {
      userService.profileInfor().then((userInfo) => {
        dispatch(userData({ profile: userInfo.data }))
      })
    }
  }, [user, accessToken, isLoggedIn])
  return (
    <div className="box-border w-full overflow-hidden">
      <Header />
      <main className="mt-[64px] lg:px-primary md:px-14 px-4">{children}</main>
      <Footer />
      <NavFooter reels={false} />
    </div>
  );
}
