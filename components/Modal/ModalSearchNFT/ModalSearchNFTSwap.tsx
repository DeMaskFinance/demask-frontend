import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { NFTTopService } from "@/libs/service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { checkIsERC1155Service } from "@/libs/service/checkIsERC1155";
import axios from "axios";
import MediaNFT from "@/components/Common/MediaNFT";
import { searchNFTService } from "@/libs/service/searchService";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import TopNFT from "./TopNFT";
interface ModalAddressNFTProps {
  isOpenSearchNFT: boolean;
  setIsOpenSearchNFT: any;
  setActiveChoiceNFT: any;
}
const styles = {
  inputItem:
    "w-full p-2 mb-4 border rounded-lg border-dark3 placeholder:text-sm block",
};
const ModalAddressNFT: React.FunctionComponent<ModalAddressNFTProps> = ({
  isOpenSearchNFT,
  setIsOpenSearchNFT,
  setActiveChoiceNFT
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  let debouncedSearchNFT = useDebounce(searchTerm);
  const router = useRouter();
  const { chainId, demask } = useContext(AccountContext);

  const { isLoading: searchLoading,
    isSuccess,
    data: searchData,
    isFetching: searchFetching,
    refetch: searchRefetch,
    isPreviousData: isSearchPreviousData } = useQuery({
      queryKey: ["categories", debouncedSearchNFT, chainId],
      queryFn: async () => {
        if (debouncedSearchNFT.includes("/")) {
          const [param1, param2] = debouncedSearchNFT.split(":");
          const id = param1.includes("x") ? param2 : param1;
          const nftAddress = param1.includes("x") ? param1 : param2;
          const res = await categoryAPI(
            `search?chainId=${chainId}&nftAddress=${nftAddress}&id=${id}`
          );
          return res;
        } else {
          const res = await categoryAPI(`search?chainId=${chainId}&search=${debouncedSearchNFT}`);
          return res;
        }
      },
    });

  const handleClose = (e: any) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSearchNFT(false);
  };


  const handleSelectNFT = (item: any) => {
    const { currency } = router.query;
    const { slug } = router.query;
    let newURL = "";
    const currentURL = router.asPath;
    if (currency) {
      newURL = currentURL
        .replace(currency[0], item.nftAddress)
        .replace(currency[2], item.nftID);
      router.push(newURL);
    } else if (slug) {
      newURL = currentURL.replace(slug[0], item.nftAddress).replace(slug[2], item.nftID);
      router.push(newURL);
    } else {
      router.replace(`/swap/${item.nftAddress}/${demask.NATIVE_ADDRESS}/${item.nftID}`)
    }
    document.body.style.overflowY = "auto";
    setActiveChoiceNFT('');
    setIsOpenSearchNFT(false);
  }
  
  return (
    <Wrapper isOpen={isOpenSearchNFT} onClick={handleClose}>
      <div className="z-50 flex flex-col justify-center h-full">
        <div className="bg-white h-fit w-[360px] md:w-[400px] lg:w-[432px] rounded-lg px-4 pb-4 relative">
          <p className="py-2 mb-4 border-b-[1px] border-dark3 text-xl font-medium">
            Select a NFT
          </p>
          <div>
            <div className="relative">
              <input
                className={styles.inputItem}
                placeholder="Search name / liquidity pairs / crypto collectibles : id"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchLoading && (
                <div className="absolute top-[50%] right-2 -translate-y-1/2">
                  <BiLoaderAlt className="animate-spin text-secondary5" />
                </div>
              )}
            </div>
            {
              searchTerm ? (
                isSuccess && searchData.length > 0 ? (
                  <div className="overflow-y-auto max-h-40">
                    {searchData.map((item: any, index: number) => (
                      <div key={index}>
                        <div
                          className="flex items-center rounded-lg cursor-pointer hover:bg-dark4 group gap-x-2"
                          onClick={() => handleSelectNFT(item)}
                        >
                          <div className="w-8 h-8">
                            <MediaNFT data={item} isControls={false} />
                          </div>
                          <div>
                            <h2 className="font-medium group-hover:text-secondary5">
                              {item?.metadata?.symbol}
                            </h2>
                            <p className="text-sm text-dark3">{item?.metadata?.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {searchFetching ? (
                      <div className="bg-slate-200 animate-pulse h-[24px] w-full rounded-lg"></div>
                    ) : (
                      <span className="text-base text-secondary3">No Result</span>
                    )}
                  </>
                )
              ) : (
                <div>
                  <TopNFT handleSelectNFT={handleSelectNFT} />
                </div>
              )
            }

          </div>
          <button
            className="absolute top-0 right-0 p-2 text-lg"
            onClick={handleClose}
          >
            <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
          </button>
        </div>
      </div>
    </Wrapper >
  );
};

export default memo(ModalAddressNFT);
