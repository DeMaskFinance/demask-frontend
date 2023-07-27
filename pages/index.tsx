import { Button } from "@/components/Buttons";
import * as homeService from "@/libs/service/homeService";
import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import NFTItems from "@/components/Home/NFTItems";
import type { GetServerSideProps } from "next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { SkeletonNewFeeds, SkeletonReels } from "@/components/Skeleton";
import { NFTTop, Reels } from "@/components/Home";
import { LayoutSecondary } from "@/components/Layouts";

const Home = () => {
  const [modeInitial, setModeInitial] = useState<string>("");
  const [mode, setMode] = useState<string>(modeInitial);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  useEffect(() => {
    setModeInitial(localStorage.getItem("MODE_DEMASK") || "");
  }, [mode]);

  const { ref, inView } = useInView();
  const fetchDataPage = async (pageParam = 1) => {
    const data = await homeService.home(pageParam);
    return data;
  };

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isSuccess,
    isLoading,
    isFetching,
    isError,
  } = useInfiniteQuery(
    ["Homepage"],
    ({ pageParam = 1 }) => fetchDataPage(pageParam),
    {
      getNextPageParam: (page) =>
        page?.currentPage === page?.totalPage
          ? undefined
          : page?.currentPage + 1,
    }
  );
  console.log(isError);

  const Category = [
    {
      id: 1,
      value: "ALL",
    },
    {
      id: 2,
      value: "TRENDING",
    },
    {
      id: 3,
      value: "LASTEST",
    },
  ];

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (localStorage.getItem("MODE_DEMASK") === null) {
        setMode("NEWFEEDS");
      } else {
        setMode(localStorage.getItem("MODE_DEMASK") || "");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="py-8">
      <Head>
        <title>Home | DeMask</title>
      </Head>
      {modeInitial === "REELS" ? (
        <>
          {data?.pages[0] ? (
            <Reels
              data={data}
              isFetching={isFetching}
              isLoading={isLoading}
              isSuccess={isSuccess}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          ) : (
            <SkeletonReels />
          )}
        </>
      ) : (
        <div className="mb-6 leading-7">
          <NFTTop />
          <div className="flex flex-col items-center mt-8">
            {data?.pages[0] ? (
              <div className="flex flex-col items-center mx-auto">
                <h1 className="text-3xl font-medium text-center  text-dark1 lg:w-[65%]">
                  {data?.pages[0].totalRecords} curated NFT resources to buy and
                  hold creative workflow.
                </h1>
                <h2 className="mt-2 text-xl text-center font-medium text-dark2">
                  Join a growing family of {data?.pages[0].totalCreators}{" "}
                  designers and makers from around the world.
                </h2>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <p className="w-[65%] h-6 rounded-full animate-pulse bg-slate-200"></p>
                <p className="h-6 mt-4 rounded-full w-60 animate-pulse bg-slate-200"></p>
              </div>
            )}
            <div className="mt-6 lg:my-6 my-0 bg-red-200">
              {Category.map((item, index) => (
                <Button
                  key={index}
                  className="p-2 ml-6 text-sm font-medium leading-normal text-dark3"
                  type="button"
                  outline
                  active={selectedCategory.includes(item.value)}
                  onClick={() => setSelectedCategory(item.value)}
                >
                  {item.value}
                </Button>
              ))}
            </div>
          </div>
          <div className="lg:w-2/4 md:w-4/5 w-full mx-auto">
            {isSuccess && data?.pages[0] ? (
              data?.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.records.map((nftItem: any, index: number) => (
                    <NFTItems nftItem={nftItem} key={index} />
                  ))}
                </Fragment>
              ))
            ) : (
              <>
                <SkeletonNewFeeds />
                <SkeletonNewFeeds />
                <SkeletonNewFeeds />
              </>
            )}
            <div ref={ref} style={{ height: "1px" }} />
            {(isLoading || isFetchingNextPage || isFetching) && (
              <>
                <SkeletonNewFeeds />
                <SkeletonNewFeeds />
                <SkeletonNewFeeds />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
Home.PageLayout = LayoutSecondary;
export default Home;
