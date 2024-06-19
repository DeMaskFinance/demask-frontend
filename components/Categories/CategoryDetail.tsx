import AccountContext from "@/context/AccountContext";
import { collectionTypeDetail } from "@/libs/service/collectionService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { SkeletonSubCategory } from "../Skeleton/SkeletonCategory";
import NFTCategory from "./NFTCategory";

const CategoryDetail = ({ label }: { label: string }) => {
  const { chainId } = useContext(AccountContext);
  const { ref, inView } = useInView();
  const fetchDetailCollection = async (
    label: string,
    chain: string | string[],
    pageParam: number
  ) => {
    const data = await collectionTypeDetail(label, chain, pageParam, 10);
    return data;
  };
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
    isLoading,
    isFetching,
  } = useInfiniteQuery(
    ["CollectionTypeDetail", chainId, label],
    ({ pageParam = 1 }) => fetchDetailCollection(label, chainId, pageParam),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPages
          ? undefined
          : page?.currentPage + 1,
    }
  );
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);
  console.log(data);

  return (
    <div>
      {isLoading ? (
        <div className="grid gap-4 text-white grid-cols-autoFill">
          <SkeletonSubCategory length={6} />
        </div>
      ) : (
        <>
          <div className="">
            {isSuccess && data?.pages[0]?.data.length > 0 ? (
              data.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  <ul className="grid gap-4 text-white grid-cols-autoFill">
                    {page?.data?.map((item: any, itemIndex: number) => (
                      <li
                        title={item?.metadata?.name}
                        key={itemIndex}
                        className=""
                      >
                        <NFTCategory item={item} />
                      </li>
                    ))}
                  </ul>
                </Fragment>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                No data
              </div>
            )}
          </div>
          <div ref={ref} style={{ height: "1px" }}></div>
        </>
      )}
    </div>
  );
};

export default CategoryDetail;
