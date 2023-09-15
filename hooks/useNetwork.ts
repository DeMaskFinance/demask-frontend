import { useRouter } from "next/router";

const useNetWork= () => {
  const router = useRouter();
  const chainId = router.query.chain || "80001";
  
  return {
    chainId
  };
};

export default useNetWork;