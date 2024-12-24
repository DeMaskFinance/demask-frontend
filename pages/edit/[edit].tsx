import EditFormCollection from "@/components/Collection/EditFormCollection";
import React, { useContext } from "react";
import { SEO } from "../../next-seo.config";
import { NextSeo } from "next-seo";
import { collectionDetail } from "@/libs/service/collectionService";
import { GetServerSideProps } from "next";
import { BiLoaderAlt } from "react-icons/bi";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import AccountContext from "@/context/AccountContext";
import { BackgroundDefault } from "@/components/Backgrounds";
const updateMeta = {
  ...SEO,
  title: "Edit Collection",
};
const EditCollection = () => {
  const collectionAddress = (useRouter().query.edit as string) || "";
  const { chainId } = useContext(AccountContext);

  const { data, refetch } = useQuery({
    queryKey: ["detailCollection", chainId, collectionAddress],
    queryFn: async () => {
      if (collectionAddress) {
        const res = await collectionDetail(collectionAddress, chainId);
        return res.data;
      }
    },
  });

  return (
    <BackgroundDefault>
      <NextSeo {...updateMeta} />
      {data ? (
        <EditFormCollection data={data} refetch={refetch} />
      ) : (
        <BiLoaderAlt className="text-2xl animate-spin text-primary_400" />
      )}
    </BackgroundDefault>
  );
};

export default EditCollection;
