import MediaNFT from "@/components/Common/MediaNFT";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { checkIsERC1155Service } from "@/libs/service/checkIsERC1155";
import { searchNFTService } from "@/libs/service/searchService";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import TopNFT from "./TopNFT";
interface ModalAddressNFTProps {
  isOpenSearchNFT: boolean;
  setIsOpenSearchNFT: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddressNFT: React.FunctionComponent<ModalAddressNFTProps> = ({
  isOpenSearchNFT,
  setIsOpenSearchNFT,
}) => {
  const [nftAddress, setNftAddress] = useState<string>("");
  const [idNFT, setIdNFT] = useState("");
  let debouncedNFT = useDebounce(nftAddress);
  const router = useRouter();
  const { chainId, demask } = useContext(AccountContext);

  const { isLoading, data, isFetching, isSuccess } = useQuery({
    queryKey: ["checkNFT", debouncedNFT, chainId],
    queryFn: async () => {
      const res = await checkIsERC1155Service(
        debouncedNFT.toLowerCase(),
        chainId
      );
      return res;
    },
  });
  const {
    isLoading: isLoadingNFT,
    data: dataNFT,
    isFetching: isFetchingNFT,
    isSuccess: isSuccessNFT,
  } = useQuery({
    queryKey: ["searchNFT", debouncedNFT, chainId, idNFT],
    queryFn: async () => {
      const res = await searchNFTService(
        chainId,
        debouncedNFT.toLowerCase(),
        idNFT
      );
      return res;
    },
  });
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
  };
  const { currency } = router.query;
  const { slug } = router.query;
  let newURL = "";
  const handleChangeRouteNFT = () => {
    if (currency) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(currency[0], debouncedNFT)
        .replace(currency[2], idNFT);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(slug[0], debouncedNFT)
        .replace(slug[2], idNFT);
      router.push(newURL);
    }
    setNftAddress("");
    setIdNFT("");
    router.push(newURL);
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
  };
  const handleSelectNFT = (item: any) => {
    if (currency) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(currency[0], item.nftAddress)
        .replace(currency[2], item.nftID);
    } else if (slug) {
      const currentURL = router.asPath;
      newURL = currentURL
        .replace(slug[0], item.debouncedNFT)
        .replace(slug[2], item.nftID);
    }
    router.push(newURL);
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
  };

  return (
    <Wrapper isOpen={isOpenSearchNFT} onClick={handleClose}>
      <div className="container_modal">
        <div className="h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg px-4 pb-4 relative">
          <p className="py-2 mb-4 text-xl font-medium">Select a NFT</p>
          <div>
            <div className="relative">
              <input
                className="input_item"
                placeholder="Search address or paste address"
                value={nftAddress}
                onChange={(e) => setNftAddress(e.target.value)}
              />
              {isLoading && (
                <div className="absolute top-[50%] right-2 -translate-y-1/2">
                  <BiLoaderAlt className="animate-spin text-secondary5" />
                </div>
              )}
            </div>
            <ul className={`${debouncedNFT ? "hidden" : "block"}`}>
              <li
                className="flex items-center cursor-pointer gap-x-2 hover:text-secondary5 group active:text-secondary3"
                onClick={() => setNftAddress(demask.CREATOR)}
              >
                <span>
                  <Image
                    src="/logo.png"
                    alt="logo"
                    width={24}
                    height={24}
                    className="object-cover w-6 h-auto"
                  />
                </span>
                <span>DEMASK CREATOR</span>
              </li>
            </ul>
            <div className={`${debouncedNFT ? "hidden" : "block"}`}>
              <div>
                <TopNFT handleSelectNFT={handleSelectNFT} />
              </div>
            </div>
            {data?.status === true && debouncedNFT && (
              <input
                className="input_item"
                placeholder="Address id or paste id"
                value={idNFT}
                onChange={(e) => setIdNFT(e.target.value)}
              />
            )}
            {data?.status === false && debouncedNFT && (
              <p
                className="mb-2 ml-3 -mt-1 text-xs text-red"
                key="totalPayment"
              >
                Your NFT address must be an ERC1155
              </p>
            )}
          </div>
          {isSuccessNFT && dataNFT[0]?.metadata && (
            <div
              className="flex items-center rounded-lg cursor-pointer hover:bg-dark4 group gap-x-2"
              onClick={handleChangeRouteNFT}
            >
              <div className="w-8 h-8">
                <MediaNFT data={dataNFT[0]} isControls={false} />
              </div>
              <div>
                <h2 className="font-medium group-hover:text-secondary5">
                  {dataNFT[0]?.metadata?.symbol}
                </h2>
                <p className="text-sm text-dark3">
                  {dataNFT[0]?.metadata?.name}
                </p>
              </div>
            </div>
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

export default memo(ModalAddressNFT);
