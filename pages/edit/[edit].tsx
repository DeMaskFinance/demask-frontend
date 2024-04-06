import EditFormCollection from "@/components/CreatedCollection/EditFormCollection";
import React, { useContext } from "react";
import { SEO } from "../../next-seo.config";
import { NextSeo } from "next-seo";
import { collectionDetail } from "@/libs/service/collectionService";
import { GetServerSideProps } from "next";
import { BiLoaderAlt } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import AccountContext from "@/context/AccountContext";
const updateMeta = {
  ...SEO,
  title: "Edit Collection",
};
const EditCollection = () => {
  const collectionAddress = useRouter().query.edit as string;
  const { chainId } = useContext(AccountContext);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => {
      if (collectionAddress) {
        const res = await collectionDetail(collectionAddress, chainId);
        console.log(res);
        return res.data;
      }
    },
  });
  console.log(data);

  return (
    <div className="py-6 min-h-[75vh] max-w-[1440px] mx-auto mb-[100px] lg:mb-0 lg:px-primary md:px-14 px-4">
      <NextSeo {...updateMeta} />
      {data ? (
        <EditFormCollection data={data} refetch={refetch} />
      ) : (
        <BiLoaderAlt className="text-2xl animate-spin text-secondary5" />
      )}
    </div>
  );
};

export default EditCollection;
