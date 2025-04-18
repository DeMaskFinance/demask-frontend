import { Toaster } from "@/components/ui/sonner";
import AccountContext from "@/context/AccountContext";
import { contractService, getPaymentTokens } from "@/libs/service/contractsService";
import * as userService from "@/libs/service/userService";
import { logout, selectProfile, userData } from "@/store/profileSlice";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { Footer } from "../Footer";
import NavFooter from "../Footer/NavFooter";
import Header from "../Header";
export default function Layout({ children }: PropsWithChildren) {
  const {
    chainId,
    updateChainId,
    updateAccount,
    wallet,
    isEvent,
    getProviders,
  } = useContext(AccountContext);
  const { user, accessToken, isLoggedIn } = useSelector(selectProfile);
  const [version] = useQueryParam("version", withDefault(StringParam, "v1"));
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

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = await getProviders(wallet);

          const handleAccountsChanged = (account: []) => {

            localStorage.removeItem("WALLET_DEMASK");
            updateAccount("");
            dispatch(logout());
          };

          const handleChainChanged = (networkId: string) => {
            if (networkId === "11155111" || networkId === "5") {
              updateChainId(networkId);
            }
          };

          provider.on("accountsChanged", handleAccountsChanged);
          provider.on("chainChanged", handleChainChanged);

          return () => {
            provider.off("accountsChanged", handleAccountsChanged);
            provider.off("chainChanged", handleChainChanged);
          };
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    initProvider();
  }, [wallet]);
  const { data } = useQuery<ContractAddresses>({
    queryKey: ["contracts", chainId, version],
    queryFn: async () => {
      const res = await contractService(chainId, version);
      return res.data;
    },
  });

  const { data: paymentTokens = [] } = useQuery<Token[]>({
    queryKey: ["paymentTokens"],
    queryFn: async () => {
      const res = await getPaymentTokens(chainId);
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
