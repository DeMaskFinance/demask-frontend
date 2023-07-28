import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { useState } from "react";
import { Button } from "@/components/Buttons";
import useBalanceToken from "@/hooks/useInformationToken";
import useNFTBalance from "@/hooks/useBalanceNFT";
import formatNumber from "@/libs/utils/formatNumer";
interface ModalAddLiquidityProps {
  isOpenAddLiquidity: boolean;
  data: any;
  account: string;
  wallet: string;
  setIsOpenLiquidity: React.Dispatch<React.SetStateAction<boolean>>;
}
const styles = {
  title: "block mb-4 text-base font-medium text-black24",
  inputItem: "w-full p-2 mb-4 border rounded-lg border-dark3",
};
const ModalAddLiquidity: React.FunctionComponent<ModalAddLiquidityProps> = ({
  isOpenAddLiquidity,
  data,
  account,
  wallet,
  setIsOpenLiquidity,
}) => {
  const [inputNFT, setInputNFT] = useState<string>("");
  const [isSufficientNFT, setIsSufficientNFT] = useState<boolean>(false);
  const [isSufficientToken, setIsSufficientToken] = useState<boolean>(false);
  const [isInputNFT, setIsInputNFT] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>("");
  console.log(data);

  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenLiquidity(false);
  };
  const handleGetNFT = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputNFT(e.target.value);
    if (Number(e.target.value) > Number(123)) {
      console.log("Insufficient NFT balance");
      setIsSufficientNFT(true);
    } else {
      setIsSufficientNFT(false);
    }
  };
  const handleGetToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputToken(e.target.value);
    if (Number(e.target.value) > Number(123)) {
      console.log("Insufficient Token balance");
      setIsSufficientToken(true);
    } else {
      setIsSufficientToken(false);
    }
  };
  const balanceNFT = useNFTBalance(
    account,
    data.fullInfoMetadata.nft,
    data.fullInfoMetadata.tokenId,
    wallet
  );
  const { balanceToken, decimals, bigNumberBalance,symbolToken } = useBalanceToken(
    account,
    data.fullInfoMetadata.tokenAddress,
    wallet
  );
  console.log(balanceToken);
  
  return (
    <Wrapper isOpen={isOpenAddLiquidity} onClick={handleClose}>
      <div className="z-50 flex flex-col justify-center h-fit">
        <div className="bg-white h-fit w-[432px] rounded-lg p-4 relative">
          <p className="flex items-center mb-4 text-xl font-semibold text-dark1">
            Add
            {data && (
              <div className="flex items-center leading-[16px] ml-1">
                <span> {data.fullInfoMetadata.metadata.symbol}</span>
                <span className="overflow-hidden">/</span>
                <span>{data.tokenName}</span>
              </div>
            )}
          </p>
          <div>
            <div className="relative">
              <div>
                <div>
                  <div className="flex justify-between mb-4 text-dark2">
                    <p className="font-semibold">NFT</p>
                    <p>Balance: {formatNumber(balanceNFT)}</p>
                  </div>
                  <input
                    className={styles.inputItem}
                    type="number"
                    placeholder="Input amount NFT"
                    value={inputNFT}
                    onChange={handleGetNFT}
                  />
                  {isSufficientNFT && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="totalSale"
                    >
                      Insufficient NFT balance
                    </p>
                  )}
                  {isInputNFT && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="inputNFT"
                    >
                      Required
                    </p>
                  )}
                </div>
                <div>
                  <div className="flex justify-between mb-4 text-dark2">
                    <p className="font-semibold">Token</p>
                    <p>Balance: {formatNumber(balanceToken)}</p>
                  </div>
                  {/* {tokenAddress === "MATIC" ? (
                    <input
                      className={styles.inputItem}
                      type="number"
                      placeholder="Input amount Token"
                      value={inputToken}
                      onChange={handleGetToken}
                    />
                  ) : (
                    <div className={styles.inputItem}>
                      {amountErcDesiredToDec}
                    </div>
                  )}
                  {isSufficientToken && (
                    <p
                      className="mb-2 ml-3 -mt-1 text-xs text-red"
                      key="inputNFT"
                    >
                      Insufficient Token balance
                    </p>
                  )} */}
                </div>
                <Button primary className="block px-6 py-2 mx-auto ">
                  Add Liquidity
                </Button>
              </div>
            </div>
            <button
              className="absolute top-0 right-0 p-2 text-lg"
              onClick={handleClose}
            >
              <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
            </button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ModalAddLiquidity;
