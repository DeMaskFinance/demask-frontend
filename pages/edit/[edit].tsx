import EditFormCollection from "@/components/CreatedCollection/EditFormCollection";
import React from "react";
import { SEO } from "../../next-seo.config";
import { NextSeo } from "next-seo";
import { collectionDetail } from "@/libs/service/collectionService";
import { GetServerSideProps } from "next";
import { BiLoaderAlt } from "react-icons/bi";
const updateMeta = {
  ...SEO,
  title: "Edit Collection",
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  const collectionAddress = context.query.edit;
  const chainId = context.query.chain as string;
  console.log(collectionAddress, chainId);
  let data = null;

  if (collectionAddress && chainId) {
    const res = await collectionDetail(collectionAddress, chainId);
    data = res.data;
  }

  return {
    props: {
      data,
    },
  };
};
const EditCollection = ({data}:any) => {
  return (
    <div className="py-6 min-h-[75vh] max-w-[1440px] mx-auto mb-[100px] lg:mb-0">
      <NextSeo {...updateMeta} />
      {
        data ? (
          <EditFormCollection data={data}/>
        ):(
          <BiLoaderAlt className="text-2xl animate-spin text-secondary5" />
        )
      }
    </div>
  );
};

export default EditCollection;
