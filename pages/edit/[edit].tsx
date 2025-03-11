import { BackgroundDefault } from "@/components/Backgrounds";
import EditFormCollection from "@/components/Collection/EditFormCollection";
import AccountContext from "@/context/AccountContext";
import { collectionDetail } from "@/libs/service/collectionService";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useContext } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { SEO } from "../../next-seo.config";
const updateMeta = {
  ...SEO,
  title: "Edit Collection",
};
const EditCollection = () => {
  const collectionAddress = (useRouter().query.edit as string) || "";
  const { chainId } = useContext(AccountContext);

  const { data, isLoading, refetch } = useQuery({
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
