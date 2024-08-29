import Back from "@/components/Common/Back";
import WithAuth from "@/components/Common/WithAuth";
import { UploadFileNFT } from "@/components/Create/UploadFile";
import { uploadFileIPFSMint } from "@/libs/service/IPFSService";
import { NextSeo } from "next-seo";
import { useContext, useState } from "react";
import { SEO } from "../../next-seo.config";
import AccountContext from "@/context/AccountContext";
import { starknet } from "@/libs/constants";
import { MintNFTEVM } from "@/components/Create";
import MintNFTStarknet from "@/components/Create/MintNFTStarknet";
import { useQuery } from "@tanstack/react-query";
import { collectionListUser } from "@/libs/service/collectionService";

const updateMeta = {
  ...SEO,
  title: "Mint NFTs",
};

export default function Creator() {
  const [fileType, setFileType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileIPFS, setFileIPFS] = useState<string>("");
  const { chainId, account } = useContext(AccountContext);
  const { data, isSuccess } = useQuery({
    queryKey: ["listCollectionUser", chainId, account],
    queryFn: async () => {
      const res = await collectionListUser(account, chainId);
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
          <h2 className="mt-4 text-xl font-bold text-primary_300">
            Create an NFT
          </h2>
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
            {isSuccess && (
              <div className="w-full lg:w-2/4 md:w-2/4">
                {chainId === starknet.StarknetChainId.SN_SEPOLIA ? (
                  <MintNFTStarknet
                    data={data}
                    fileIPFS={fileIPFS}
                    setFileIPFS={setFileIPFS}
                    fileType={fileType}
                    setSelectedFile={setSelectedFile}
                  />
                ) : (
                  <MintNFTEVM
                    data={data}
                    fileIPFS={fileIPFS}
                    setFileIPFS={setFileIPFS}
                    fileType={fileType}
                    setSelectedFile={setSelectedFile}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </WithAuth>
    </>
  );
}
