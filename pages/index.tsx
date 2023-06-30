import { Button } from "@/components/Buttons";
import * as homeService from "@/libs/service/homeService";
import Head from "next/head";
import {useState} from 'react'
import Image from "next/image";
import Link from "next/link";
import NFTItems from "@/components/Home/NFTItems";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { useInfiniteQuery } from "react-query";
 
export const getServerSideProps: GetServerSideProps = async () =>{
  const homeData = await homeService.home(undefined);
  return {
    props: {
      homeData
    }
  }
}

export default function Home({homeData}:any) {
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDataPage = async ({ pageParam = 1 }) => {
    const response = await fetch(`http://161.97.172.213:5050/homepage?page=${pageParam}`);
    const data = await response.json();
    
    console.log(data);
    return data;
    
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    "homepage",
    ({ pageParam }) => fetchDataPage({ pageParam }),
    {
      getNextPageParam: (page) => (page.page === page.total_pages ? undefined : page.page + 1)
    }
  );
  console.log(homeData);
  console.log(data);
  console.log(hasNextPage);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
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
  return (
    <div className="py-8">
      <Head>
        <title>Home | DeMask</title>
      </Head>
      <div onClick={()=>fetchDataPage}>Home</div>
      <div className="mb-6">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-medium text-dark1 w-[45%] text-center">6,746 curated NFT resources to buy and hodl creative workflow.</h1>
          <h2 className="text-xl font-medium text-dark2">Join a growing family of 666,687 designers and makers from around the world.</h2>
          <div className="my-6">
            {Category.map((item,index)=>(
              <Button className="p-2 ml-6 text-sm font-medium leading-normal text-dark3" type="button" outline active={selectedCategory.includes(item.value)} onClick={() => setSelectedCategory(item.value)}>
                {item.value}
              </Button>
            ))}
          </div>
        </div>
        <div className="px-[270px]">
          <NFTItems/>
          <NFTItems/>
          <NFTItems/>
        </div>
      </div>
    </div>
  );
}
