import { Toaster } from "@/components/ui/sonner";
import AccountContext from "@/context/AccountContext";
import { getProvider } from "@/libs/connection/getProvider";
import * as userService from "@/libs/service/userService";
import { logout, selectProfile, userData } from "@/store/profileSlice";
import { PropsWithChildren, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer } from "../Footer";
import NavFooter from "../Footer/NavFooter";
import Header from "../Header";
import { useQuery } from "@tanstack/react-query";
import { contractService } from "@/libs/service/contractsService";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
export default function Layout({ children }: PropsWithChildren) {
  const { chainId, updateChainId, updateAccount, wallet, isEvent, account } =
    useContext(AccountContext);
  const { user, accessToken, isLoggedIn } = useSelector(selectProfile);
  const [version] = useQueryParam("version", withDefault(StringParam, "v2"));
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
  console.log(wallet);

  // useEffect(() => {
  //   const initProvider = async () => {
  //     if (window.ethereum) {
  //       try {
  //         const provider = await getProvider(wallet);

  //         const handleAccountsChanged = (account: []) => {
  //           console.log(account);

  //           localStorage.removeItem("WALLET_DEMASK");
  //           updateAccount("");
  //           dispatch(logout());
  //         };

  //         const handleChainChanged = (networkId: string) => {
  //           if (networkId === "11155111" || networkId === "5") {
  //             updateChainId(networkId);
  //           }
  //         };

  //         provider.on("accountsChanged", handleAccountsChanged);
  //         provider.on("chainChanged", handleChainChanged);

  //         return () => {
  //           provider.off("accountsChanged", handleAccountsChanged);
  //           provider.off("chainChanged", handleChainChanged);
  //         };
  //       } catch (error) {
  //         console.error("Error:", error);
  //       }
  //     }
  //   };

  //   initProvider();
  // }, [wallet]);
  const { data } = useQuery<ContractAddresses>({
    queryKey: ["contracts", chainId, version],
    queryFn: async () => {
      const res = await contractService(chainId, version);
      return res.data;
    },
  });

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
