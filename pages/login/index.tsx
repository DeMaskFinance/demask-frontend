import { LoginSocials } from "@/components/LoginSocials";
import AccountContext from "@/context/AccountContext";
import { QueryCache, QueryClient, useQueryClient } from "@tanstack/react-query";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useContext } from "react";

const Login: NextPage = () => {
  return (
    <div>
      <LoginSocials />
    </div>
  );
};

// Getting some weird styling (unrelated to Capsule) when using SSR on this page.
export default dynamic(() => Promise.resolve(Login), {
  ssr: false,
});
