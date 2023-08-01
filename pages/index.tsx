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
import { TabGroups } from "@/components/NavChoice";
import Image from "next/image";
import Link from "next/link";
import SocialBar from "@/components/Home/SocialBar";

const Home = () => {
  const [modeInitial, setModeInitial] = useState<string>("");
  const [mode, setMode] = useState<string>(modeInitial);
  const handleChoiceChange = (choice: string) => {
    setActiveChoice(choice);
  };
  const [activeChoice, setActiveChoice] = useState<string>("Trending");
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
    <div className="py-8 mx-auto container-main">
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
          {/* <NFTTop /> */}
          <div className="flex flex-col items-center lg:mt-8">
            {data?.pages[0] ? (
              <div className="flex flex-col items-center mx-auto">
                <h1 className="px-0 text-2xl font-medium text-center lg:text-3xl text-dark1 lg:px-10 md:px-8">
                  Discover{" "}
                  <span className="text-secondary4">
                    {data?.pages[0].totalRecords}
                  </span>{" "}
                  curated crypto collectibles to buy and hold, enriching your
                  creative workflow.
                </h1>
                <h2 className="mt-2 font-medium text-center lg:text-xl text-md text-dark2">
                  Embrace the role of a{" "}
                  <Link href={"/create"} className="text-secondary4">
                    Creator
                  </Link>{" "}
                  now and join a growing community of{" "}
                  <span className="text-secondary4">
                    {data?.pages[0].totalCreators}
                  </span>{" "}
                  designers and makers from around the world.
                </h2>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <p className="w-[65%] h-6 rounded-full animate-pulse bg-slate-200"></p>
                <p className="h-6 mt-4 rounded-full w-60 animate-pulse bg-slate-200"></p>
              </div>
            )}
            <div className="my-6 lg:my-8">
              {/* {Category.map((item, index) => (
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
              ))} */}

              <TabGroups
                choices={["Trending", "Membership", "Lastest"]}
                activeChoice={activeChoice}
                onChoiceChange={handleChoiceChange}
              />
            </div>
          </div>
          <div className="flex flex-col w-full gap-6 mx-auto lg:flex-row md:flex-row">
            <div className="lg:w-[70%] md:w-[70%] w-full">
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

            <SocialBar />
          </div>
        </div>
      )}
    </div>
  );
};
Home.PageLayout = LayoutSecondary;
export default Home;
