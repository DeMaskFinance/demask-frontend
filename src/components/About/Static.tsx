"use client";
import { EtherIcon } from "@/components/Icons";
import { staticInfo } from "@/lib/service/staticService";
import { formatNumber, formatToUnit } from "@/lib/util/format";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { BiLoaderAlt } from "react-icons/bi";

const Static = () => {
  const { isLoading, refetch, data, isFetching } = useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const res = await staticInfo();
      return res.data;
    },
  });
  const amountList = [
    {
      title: "COLLECTIONS",
      amount: () => {
        return (
          <div>
            {isLoading ? (
              <BiLoaderAlt className="text-xl text-white animate-spin lg:text-3xl" />
            ) : (
              <span>{data?.collections}+</span>
            )}
          </div>
        );
      },
    },
    {
      title: "ACTIVE USERS",
      amount: () => {
        return (
          <div>
            {isLoading ? (
              <BiLoaderAlt className="text-xl text-white animate-spin lg:text-3xl" />
            ) : (
              <span>{data?.totalUser}+</span>
            )}
          </div>
        );
      },
    },
    {
      title: "TOTAL VALUE LOCKED",
      amount: () => {
        return (
          <div>
            {isLoading ? (
              <BiLoaderAlt className="text-xl text-white animate-spin lg:text-3xl" />
            ) : (
              <span>{formatToUnit(data?.totalTVL)}</span>
            )}
          </div>
        );
      },
      icon: <EtherIcon width={24} height={24} />,
    },
    {
      title: "TOTAL VOLUME",
      amount: () => {
        return (
          <div>
            {isLoading ? (
              <BiLoaderAlt className="text-xl text-white animate-spin lg:text-3xl" />
            ) : (
              <span>{formatToUnit(data?.totalVolume)}</span>
            )}
          </div>
        );
      },
      icon: <EtherIcon width={24} height={24} />,
    },
  ];
  return (
    <article className="grid grid-cols-2 lg:grid-cols-4 gap-y-3 p-6 gap-x-10 w-fit mx-auto text-left">
      {amountList.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:items-center justify-between  w-full"
        >
          <div className="flex items-center gap-x-2 text-white font-bold text-4xl">
            {item.amount()}
            {item.icon}
          </div>
          <p className="font-semibold">{item.title}</p>
        </div>
      ))}
    </article>
  );
};

export default Static;
