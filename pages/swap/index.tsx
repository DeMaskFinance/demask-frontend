import { useState,useContext } from "react";
import { Button } from "@/components/Buttons";
import { DownIcon, NFTIcon, PoolIcon } from "@/components/Icons";
import { TwoTab } from "@/components/NavChoice";
import images from "@/public/images";
import Head from "next/head";
import Image from "next/image";
import AccountContext from "@/context/AccountContext";
import { ModalSearchNFT } from "@/components/Modal/ModalSearchNFT";
import useMetadata from "@/hooks/useMetadata";
const styles = {
  inputItem: "w-full py-2 pl-2 mb-6 border rounded-lg border-dark3 block",
  btnActive: "rounded-full bg-base2",
};
const Swap: React.FC = () => {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState("");
  const [inputNFT, setInputNFT] = useState<string>("");
  const [inputToken, setInputToken] = useState<string>("");
  const [isOpenSearchNFT, setIsOpenSearchNFT] = useState<boolean>(false);
  const {account} = useContext(AccountContext);
  const {
    nameNFT,
    imageNFT,
    symbolNFT,
    category,
    attributes,
    animationUrl,
    description,
  } = useMetadata(nftAddress, idNFT);
  const handleSearchNFT = () => {
    setIsOpenSearchNFT(true);
    document.body.style.overflowY = "hidden";
  };
  return (
    <div className="py-8 swap">
      <Head>
        <title>Swap | DeMask</title>
      </Head>
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-medium text-dark0">
          Face to Face (FaToCe)
        </h3>
        <p className="text-sm font-medium text-dark1">ToCa.ETH</p>
      </div>
      <div className="flex gap-x-10">
        <div className="w-[50%] flex flex-col items-center">
          <Image src={images.testImg} alt="test" className="" />
          <p className="mt-1 text-sm cursor-pointer text-secondary5 hover:text-secondary3">See detail</p>
        </div>
        <div className="w-[50%]">
          <div className="px-4 py-6 border rounded-lg border-dark3">
            <div className="flex mb-6 text-dark1">
              <div className="basis-1/3">
                <div className="flex gap-x-3">
                  <div
                    className="px-3 py-2 rounded-lg bg-secondary5"
                    onClick={handleSearchNFT}
                  >
                    <div className="flex items-center justify-between text-white cursor-pointer">
                      <div className="flex items-center gap-x-3">
                        {/* <NFTIcon
                          width={24}
                          height={24}
                          className="fill-white"
                        /> */}
                        {/* {nameNFT} */}ABCD
                      </div>
                      <DownIcon width={20} height={20} className="fill-white" />
                    </div>
                  </div>
                  <div
                    className="px-3 py-2 rounded-lg bg-secondary5"
                    onClick={handleSearchNFT}
                  >
                    <div className="flex items-center justify-between text-white cursor-pointer">
                      <div className="flex items-center gap-x-3">
                        {/* <NFTIcon
                          width={24}
                          height={24}
                          className="fill-white"
                        /> */}
                        {/* {nameNFT} */}ABCD
                      </div>
                      <DownIcon width={20} height={20} className="fill-white" />
                    </div>
                  </div>
                </div>
                {account&&(<p className="mt-2">Balance: 10,000</p>)}
              </div>
              <div className="flex justify-center basis-1/3">
                <TwoTab firstChoice="BUY" secondChoice="SELL" />
              </div>
              <div className="flex justify-end font-medium text-dark2 basis-1/3">
                <PoolIcon width={24} height={24} />
                <p>Pool</p>
              </div>
            </div>
            <form action="submit">
              <input
                type="number"
                name="token"
                id="token"
                placeholder="Input amount token"
                className={styles.inputItem}
              />
              <input
                type="number"
                name="amount"
                id="amount"
                placeholder="Input amount NFT"
                className={styles.inputItem}
              />
              <div className="flex justify-center w-full">
                <Button type="submit" className="p-2" primary>
                  BUY NFT
                </Button>
              </div>
            </form>
          </div>
          <div className="px-4 py-6 mt-6 border rounded-lg border-dark3">
            <div className="mb-12">
              <ul>
                <li className="text-dark3">Volume and Price</li>
                <li className="text-dark1">1.2997 ETH</li>
                <li className="text-dark2">Avg.Pice: 0.0762 ETH</li>
                <li className="text-dark3">7:00 Am, may 17, 2023 (UTC)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <ModalSearchNFT
        setIsOpenSearchNFT={setIsOpenSearchNFT}
        isOpenSearchNFT={isOpenSearchNFT}
      />
    </div>
  );
};

export default Swap;
