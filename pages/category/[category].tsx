import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryAPI } from "@/libs/service/categoriesChartService";
import Link from "next/link";
import Image from "next/image";
import SkeletonCategory from "@/components/Skeleton/SkeletonCategory";
import NFTCategory from "@/components/Categories/NFTCategory";

export default function Art() {
  const getDate = (timeStamp: any) => {
    const date = timeStamp * 1000;
    const currentDateMillis = Date.now();
    const timeDifferenceMillis = date - currentDateMillis;
    const daysLeft = Math.ceil(timeDifferenceMillis / (1000 * 60 * 60 * 24));
    return -daysLeft;
  };
  const slug = useRouter().query.category;
  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const { data, isLoading } = useQuery({
    queryKey: [slug, "type"],
    queryFn: async () => {
      const res = await categoryAPI(`/items/${capitalizeFirstLetter(slug)}`);
      return res;
    },
  });
  return (
    <section className="max-w-6xl pt-6 pb-32 mx-auto">
      <Head>
        <title>Category| DeMask</title>
      </Head>
      <div className="">
        <h2 className="px-4 py-1 mx-auto mb-2 text-2xl font-medium uppercase rounded-md bg-dark4 w-max text-dark1">
          {slug}
        </h2>
        <ul className="grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-dark2">
          {data &&
            data?.items?.map((item: any, idx: number) => (
              <>
                <li
                  title={item.metadata.name}
                  className="items-center p-3 overflow-hidden transition-all border rounded-md cursor-pointer hover:-translate-y-1 hover:shadow-home "
                >
                  <NFTCategory item={item}/>
                </li>
              </>
            ))}
        </ul>
      </div>
      {isLoading && <SkeletonCategory />}
    </section>
  );
}
