import Back from "@/components/Common/Back";
import TypeErc from "@/components/Common/TypeErc";
import WithAuth from "@/components/Common/WithAuth";
import { MintNFTEVM } from "@/components/Create";
import MintErc721 from "@/components/Create/MintNFTErc721";
import { UploadFileNFT } from "@/components/Create/UploadFile";
import AccountContext from "@/context/AccountContext";
import { collectionListUser } from "@/libs/service/collectionService";
import { uploadFileIPFSMint } from "@/libs/service/IPFSService";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { useContext, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { SEO } from "../../next-seo.config";

const updateMeta = {
  ...SEO,
  title: "Mint NFTs",
};

export default function Creator() {


  const [type] = useQueryParam("typeErc", withDefault(StringParam, "erc721"));

  const [page, setPage] = useState(1);

  const [fileType, setFileType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileIPFS, setFileIPFS] = useState<string>("");
  const { chainId, account } = useContext(AccountContext);
  const { data, isLoading } = useQuery({
    queryKey: ["listCollectionUser", chainId, account, type, page],
    queryFn: async () => {
      const res = await collectionListUser(account, chainId, type, page, 100);
      return res.data;
    },
    enabled: !!account,
  });


  


  return (
    <>
      <NextSeo {...updateMeta} />

      <WithAuth>
        <div className="pb-24 mx-auto container-main lg:pb-8 px-3">
          <Back />

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary_300">
              Create an NFT
            </h2>
            <TypeErc />
          </div>
          <h3 className="mt-2 mb-4 text-sm font-normal text-shader_200">
            Mint additional NFTs to grow your collection.
          </h3>
          <div className="flex flex-col gap-6 text-shader_100 lg:flex-row md:flex-row ">
            {/* UpLoad File */}
            <div className="w-full lg:w-2/4 md:w-2/4 shrink-0">
              <div className="sticky top-16">
                <UploadFileNFT
                  setFileIPFS={setFileIPFS}
                  fileType={fileType}
                  setFileType={setFileType}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  uploadFile={uploadFileIPFSMint}
                />
              </div>
            </div>

            <div className="w-full lg:w-2/4 md:w-2/4">
              {isLoading && <div className="h-[500px] w-full rounded-xl bg-slate-300/20 animate-pulse"></div>}
              {!isLoading && data &&
                <>
                  {
                    type === "erc721" ?
                      <MintErc721
                        data={data}
                        fileIPFS={fileIPFS}
                        setFileIPFS={setFileIPFS}
                        fileType={fileType}
                        setSelectedFile={setSelectedFile}
                      />
                      :
                      <MintNFTEVM
                        data={data}
                        fileIPFS={fileIPFS}
                        setFileIPFS={setFileIPFS}
                        fileType={fileType}
                        setSelectedFile={setSelectedFile}
                      />
                  }
                </>}
            </div>

          </div>
        </div>
      </WithAuth >
    </>
  );
}
