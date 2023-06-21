import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import checkIsERC20 from "@/libs/validation/checkIsERC20";
import { Button } from "@/components/Buttons";
import { tokenDefault } from "@/libs/constants";
import { useRouter } from "next/router";

interface ModalSearchTokenProps {
  setIsOpenSearchToken: any;
  isOpenSearchToken: boolean;
  setSymbolToken: any;
}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem:
    "w-full p-2 mb-4 border rounded-lg border-dark3 placeholder:text-sm block",
  btnActive: "rounded-full bg-base2",
};
const ModalSearchToken: React.FunctionComponent<ModalSearchTokenProps> = ({
  setIsOpenSearchToken,
  isOpenSearchToken,
  setSymbolToken,
}) => {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isERC20, setIsERC20] = useState<boolean>(false);
  const [showError, setShowError] = useState(false);
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const router = useRouter();
  const hanldeAddressToken = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setTokenAddress(e.target.value);
    const { isERC20, name, symbol, decimals } = await checkIsERC20(
      e.target.value
    );
    setIsERC20(isERC20);
    setName(name);
    setSymbol(symbol);
    setShowError(!isERC20);
    setLoading(false);
  };
  const handleChangeRouteToken = () => {
    const { currency } = router.query;
    if (currency) {
      const currentURL = router.asPath;
      const newURL = currentURL.replace(currency[1], tokenAddress);
      router.push(newURL);
      setSymbolToken(symbol);
      document.body.style.overflowY = "auto";
      setIsOpenSearchToken(false);
    }
  };
  const handleChangeRouteDefault = (address:string,symbol:string) =>{
    const { currency } = router.query;
    if (currency) {
      const currentURL = router.asPath;
      const newURL = currentURL.replace(currency[1], address);
      router.push(newURL);
      setSymbolToken(symbol);
      document.body.style.overflowY = "auto";
      setIsOpenSearchToken(false);
    }
  }
  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSearchToken(false);
  };
  return (
    <Wrapper isOpen={isOpenSearchToken} onClick={handleClose}>
      <div className="z-50 flex flex-col justify-center h-full">
        <div className="bg-white h-fit w-[432px] rounded-lg px-4 pb-4 relative">
          <p className="py-2 mb-4 border-b-[1px] border-dark3 text-xl font-medium">
            Select a Token
          </p>
          <div>
            <div className="relative">
              <input
                className={styles.inputItem}
                placeholder="Search Token Address"
                value={tokenAddress}
                onChange={hanldeAddressToken}
              />
              {loading && (
                <div className="absolute top-[50%] right-2 -translate-y-1/2">
                  <BiLoaderAlt className="animate-spin text-secondary5" />
                </div>
              )}
            </div>
            {showError && (
              <p
                className="mb-2 ml-3 -mt-1 text-xs text-red"
                key="token address"
              >
                Your Token address must be an ERC20
              </p>
            )}
          </div>
          {isERC20 && (
            <div
              className="flex items-center pl-2 rounded-lg cursor-pointer hover:bg-dark4"
              onClick={handleChangeRouteToken}
            >
              <div>
                <h2 className="font-medium">{symbol}</h2>
                <p className="text-sm text-dark3">{name}</p>
              </div>
            </div>
          )}
          {!tokenAddress&&(
            <>
            {tokenDefault.map((item, index) => (
              <div key={index} className="flex items-center w-full mb-3 cursor-pointer gap-x-2 hover:text-secondary5 group active:text-secondary3" onClick={()=>handleChangeRouteDefault(item.address,item.symbol)}>
                <div>
                    <item.logo className="transition-all duration-200 ease-linear logo group-hover:fill-secondary5" width={24} height={24} />
                </div>
                <div>
                  <p className="font-medium">{item.symbol}</p>
                  <p className="text-sm text-dark3 group-hover:text-secondary5">{item.name}</p>
                </div>
              </div>
            ))}</>
          )}
          <button
            className="absolute top-0 right-0 p-2 text-lg"
            onClick={handleClose}
          >
            <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default ModalSearchToken;
