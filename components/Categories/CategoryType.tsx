import { categoryAPI } from "@/libs/service/categoriesChartService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Fragment, useContext, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SwiperSlide } from "swiper/react";
import AccountContext from "@/context/AccountContext";
import { SkeletonSubCategory } from "../Skeleton/SkeletonCategory";
import SwiperCustom from "../SwiperCustom";
import NFTCategory from "./NFTCategory";
import SearchNotFound from "../Search/SearchNotFound";
import { useInView } from "react-intersection-observer";
import { collectionTypeCategory } from "@/libs/service/collectionService";

const Category = ({ label }: { label: string }) => {
  const { chainId } = useContext(AccountContext);
  const { ref, inView } = useInView();
  const fetchDetailCollection = async (
    label: string,
    chain: string | string[],
    pageParam: number
  ) => {
    const data = await collectionTypeCategory(label, chain, pageParam, 20);
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
  console.log(data, inView);

  return (
    <section className="mb-10">
      {data && data?.pages[0].totalRecords > 0 && (
        <div className="flex flex-col">
          <h2
            className={`uppercase ${
              label === "Art"
                ? "text-primary_300"
                : label === "Gaming"
                ? "text-green"
                : label === "Film"
                ? "text-yellow"
                : label === "Music"
                ? "text-blue"
                : label === "Membership"
                ? "text-red"
                : "text-white"
            } text-lg font-bold mb-3`}
          >
            {label}
          </h2>
          <div>
            <SwiperCustom slidesPerView={6}>
              <ul>
                {data?.pages.map((page: any, pageIndex: number) => (
                  <Fragment key={pageIndex}>
                    {page?.data?.map((item: any, index: number) => (
                      <Fragment>
                        <SwiperSlide
                          className="text-sm lg:text-base text-dark2"
                          key={index}
                        >
                          <li
                            title={item.metadata?.name}
                            className="items-center transition-all "
                          >
                            <NFTCategory item={item} />
                          </li>
                        </SwiperSlide>
                        <div ref={ref} style={{ height: "1px" }}></div>
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </ul>
            </SwiperCustom>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-6 md:grid-cols-2 text-dark2">
          <SkeletonSubCategory length={6} />
        </div>
      )}
    </section>
  );
};

export default Category;
