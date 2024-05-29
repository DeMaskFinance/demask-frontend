import AccountContext from "@/context/AccountContext";
import { searchTokenService } from "@/libs/service/searchService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";

interface ModalSearchTokenProps {
  setIsOpenSearchToken: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenSearchToken: boolean;
}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  btnActive: "rounded-full bg-base2",
};
const ModalSearchToken: React.FunctionComponent<ModalSearchTokenProps> = ({
  setIsOpenSearchToken,
  isOpenSearchToken,
}) => {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const router = useRouter();
  const { tokenDefault, chainId } = useContext(AccountContext);
  const handleAddressToken = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
  };
  const { isLoading, data, isFetching, refetch, isPreviousData, isSuccess } =
    useQuery({
      queryKey: ["searchToken", chainId, tokenAddress],
      queryFn: async () => {
        const res = await searchTokenService(tokenAddress, chainId);
        return res;
      },
    });
  const handleChangeRouteToken = () => {
    const { currency } = router.query;
    const { slug } = router.query;
    let newURL = "";
    if (currency) {
      const currentURL = router.asPath;
      newURL = currentURL.replace(currency[1], tokenAddress);
      router.push(newURL);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL.replace(slug[1], tokenAddress);
      router.push(newURL);
    }
    setTokenAddress("");
    document.body.style.overflowY = "auto";
    setIsOpenSearchToken(false);
  };
  const handleChangeRouteDefault = (address: string, symbol: string) => {
    const { currency } = router.query;
    const { slug } = router.query;
    let newURL = "";
    if (currency) {
      const currentURL = router.asPath;
      const newURL = currentURL.replace(currency[1], address);
      router.push(newURL);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL.replace(slug[1], address);
      router.push(newURL);
    }
    document.body.style.overflowY = "auto";
    setIsOpenSearchToken(false);
  };
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSearchToken(false);
  };

  return (
    <Wrapper isOpen={isOpenSearchToken} onClick={handleClose}>
      <div className="container_modal">
        <div className=" h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg px-4 pb-4 relative">
          <p className="py-2 mb-4 text-xl font-medium">Select a Token</p>
          <div>
            <div className="relative">
              <input
                className="mb-4 input_item"
                placeholder="Search Token Address"
                value={tokenAddress}
                onChange={handleAddressToken}
              />
              {isLoading && (
                <div className="absolute top-[50%] right-2 -translate-y-1/2">
                  <BiLoaderAlt className="animate-spin text-primary_400" />
                </div>
              )}
            </div>
            {isSuccess && data.status === false && tokenAddress && (
              <p
                className="mb-2 ml-3 -mt-1 text-xs text-red"
                key="token address"
              >
                Your Token address must be an ERC20
              </p>
            )}
          </div>
          {isSuccess && (
            <div
              className="flex items-center pl-2 rounded-lg cursor-pointer hover:bg-shader_500"
              onClick={handleChangeRouteToken}
            >
              <div>
                <h2 className="font-medium">{data.tokenSymbol}</h2>
                <p className="text-sm text-shader_500">{data.tokenName}</p>
              </div>
            </div>
          )}
          {!tokenAddress && tokenDefault && (
            <>
              {tokenDefault?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center w-full mb-3 cursor-pointer gap-x-2 hover:text-primary_400 group active:text-primary_400"
                  onClick={() =>
                    handleChangeRouteDefault(item.address, item.symbol)
                  }
                >
                  <div>
                    <item.logo
                      className="transition-all duration-200 ease-linear logo group-hover:fill-primary_400"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{item.symbol}</p>
                    <p className="text-sm text-shader_500 group-hover:text-primary_400">
                      {item.name}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
          <button
            className="absolute top-0 right-0 p-2 text-lg"
            onClick={handleClose}
          >
            <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red text-white cursor-pointer" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default memo(ModalSearchToken);
