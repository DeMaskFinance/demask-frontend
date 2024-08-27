import FormatNumber from "@/components/Common/FormatNumber";
import { MediaCollection, MediaNFT } from "@/components/Common/Media";
import { EtherIcon, LoadingIcon, SearchIcon } from "@/components/Icons";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { TabGroups } from "@/components/NavChoice";
import AccountContext from "@/context/AccountContext";
import { liquidityListAPI } from "@/libs/service/liquidityService";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

const TotalPools = () => {
  const { chainId } = useContext(AccountContext);
  const [activeChoice, setActiveChoice] = useState<string>("ERC-1155");
  const [type, setType] = useState<string>("erc1155");
  const { ref, inView } = useInView();
  const [version] = useQueryParam("version", withDefault(StringParam, "v2"));
  const router = useRouter();
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
    choice === "ERC-1155" ? setType("erc1155") : setType("erc721");
  };
  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["allPool", chainId, type, version],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return liquidityListAPI(pageParam, type, chainId, version);
    },
    getNextPageParam: (page) => {
      return page?.data?.currentPage === page?.data?.totalPages
        ? undefined
        : page?.data?.currentPage + 1;
    },
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  return (
    <div className="rounded-lg bg-shader_800 flex flex-col overflow-hidden mb-8 min-h-[550px] max-h-[650px]">
      <TabGroups
        choices={["ERC-1155", "ERC-721"]}
        activeChoice={activeChoice}
        onChoiceChange={handleChoiceChange}
        isDefault
      />
      <div className="overflow-auto text-sm ">
        <table className="w-full text-left border-collapse ">
          <thead className=" bg-shader_600 text-shader_200 uppercase sticky top-0 z-10">
            <tr className="flex px-4 py-3">
              <th className="flex justify-start lg:w-full md:w-full w-[200px]">
                Name
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px]">
                TVL
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px]  items-center">
                VOLUME(24H)
              </th>
              <th className="flex justify-end lg:w-full md:w-full w-[140px]  items-center">
                FEES(24H)
              </th>
            </tr>
          </thead>

          <tbody className="flex flex-col flex-auto text-base">
            {data?.pages.map((page: any, pageIndex: number) => (
              <Fragment key={pageIndex}>
                {page?.data?.poolList?.length > 0 ? (
                  page.data.poolList.map((item: any, index: number) => (
                    <Fragment>
                      <tr
                        className="flex px-4 py-3 text-white border-b border-shader_500 hover:bg-shader_700 cursor-pointer font-bold"
                        key={index}
                        onClick={() => {
                          router.push(
                            item.type === "erc1155"
                              ? `/details/${item.dmlAddress}`
                              : `/trade/erc721/${item.nftAddress}?tab=pool`
                          );
                        }}
                      >
                        <td className="flex justify-start lg:w-full md:w-full w-[200px] gap-x-3 items-center">
                          <div className="relative w-[52px] ">
                            <EtherIcon width={32} height={32} />

                            <div className="w-8 h-8 object-cover rounded-full absolute top-0 right-0 overflow-hidden">
                              {item.type === "erc721" ? (
                                <MediaCollection
                                  avatar={formatLinkIPFS(item?.avatar)}
                                  zoom
                                />
                              ) : (
                                <MediaNFT data={item} isControls />
                              )}
                            </div>
                          </div>
                          <div className="font-semibold flex">
                            ETH/
                            {item.type === "erc721" ? (
                              item.symbol
                            ) : (
                              <div className="max-w-[48px]">
                                <ModalDocument data={item.metadata.symbol} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="flex justify-end lg:w-full md:w-full w-[140px] items-center gap-x-1">
                          <FormatNumber number={item.tvl} />
                          <EtherIcon width={16} height={16} />
                        </td>
                        <td className="flex justify-end lg:w-full md:w-full w-[140px] items-center gap-x-1">
                          <FormatNumber number={item.totalVolume24h} />
                          <EtherIcon width={16} height={16} />
                        </td>
                        <td className="flex justify-end lg:w-full md:w-full w-[140px] items-center gap-x-1">
                          {/* <FormatNumber number={item.price} /> */}
                          --
                          <EtherIcon width={16} height={16} />
                        </td>
                      </tr>
                      <div ref={ref} style={{ height: "1px" }}></div>
                    </Fragment>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center flex-grow h-full text-sm font-semibold text-shader_200 mt-10">
                    <div className="flex items-center justify-center w-10 h-10 mb-1 border rounded-lg border-primary_500 bg-primary_500 bg-opacity-20">
                      <SearchIcon
                        width={20}
                        height={20}
                        className="text-primary_400"
                      />
                    </div>
                    <p>Your active liquidity positions will appear here. </p>
                    <a
                      href="https://docs.demask.finance/products/dex/how-to-add-remove-lp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary_400"
                    >
                      How to add Liquidity?
                    </a>
                  </div>
                )}
                {isFetching && (
                  <div className="w-full h-full flex-auto justify-center items-center flex">
                    <LoadingIcon
                      width={20}
                      height={20}
                      className="animate-spin"
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalPools;
