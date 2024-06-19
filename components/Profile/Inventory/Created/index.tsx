import FormatNumber from "@/components/Common/FormatNumber";
import { LogoIconCard } from "@/components/Logo/Logo";
import ModalDocument from "@/components/Modal/ModalLength/ModalDocument";
import { SkeletonSubCategory } from "@/components/Skeleton/SkeletonCategory";
import AccountContext from "@/context/AccountContext";
import useDebounce from "@/hooks/useDebounce";
import { collectionListUserService } from "@/libs/service/collectionService";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Classify from "../Classify";
import { formatTypeChain } from "@/libs/utils/formatComon";
import NFTCategory from "@/components/Categories/NFTCategory";
import SearchNotFound from "@/components/Search/SearchNotFound";

const Created = () => {
  const { account, chainId, demask } = useContext(AccountContext);
  const [typeERC, setTypeERC] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [searchCollection, setSearchCollection] = useState<string>("");
  const [isFilter, setIsFilter] = useState<boolean>(false);
  let debouncedSearch = useDebounce(searchCollection);

  const { ref, inView } = useInView();
  const fetchDataNFTs = async (
    account: string,
    chain: string | string[],
    type: string,
    category: string,
    search: string,
    pageParam = 1
  ) => {
    const data = await collectionListUserService(
      account,
      chain,
      type,
      category,
      search,
      pageParam,
      10
    );
    return data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["UserCollection", chainId, account, typeERC, category, debouncedSearch],
    ({ pageParam = 1 }) =>
      fetchDataNFTs(
        account,
        chainId,
        typeERC,
        category,
        debouncedSearch,
        pageParam
      ),
    {
      getNextPageParam: (page) => {
        return page.data?.currentPage === page.data?.totalPages
          ? undefined
          : page.data?.currentPage + 1;
      },
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <Fragment>
      <Classify
        setIsFilter={setIsFilter}
        isFilter={isFilter}
        setSearchCollection={setSearchCollection}
      />
      <div className="mt-4">
        <div>
          {isLoading ? (
            <div className="grid grid-cols-autoFill gap-4  text-white">
              <SkeletonSubCategory length={4} />
            </div>
          ) : isSuccess && data?.pages[0]?.data.data.length > 0 ? (
            <div className="grid grid-cols-autoFill gap-4  text-white">
              {data.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  {page?.data?.data?.map((item: any, itemIndex: number) => (
                    <div key={itemIndex}>
                      <Link
                        href={`/collection/${item.contractAddress}?typeERC=${item.type}`}
                      >
                        <NFTCategory item={item} />
                      </Link>
                      <div ref={ref} style={{ height: "1px" }}></div>
                    </div>
                  ))}
                </Fragment>
              ))}
              {isFetching && <SkeletonSubCategory length={4} />}
              <div ref={ref} style={{ height: "1px" }}></div>
            </div>
          ) : (
            <div className="w-full h-[300px]">
              <SearchNotFound />
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Created;
