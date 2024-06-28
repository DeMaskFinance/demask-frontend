import { Button } from "@/components/Buttons";
import MediaNFT from "@/components/Common/Media/MediaNFT";
import { SuccessIcon, URLTransactionIcon } from "@/components/Icons";
import AccountContext from "@/context/AccountContext";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { formatLinkIPFS } from "@/libs/utils/formatComon";
import Image from "next/image";

interface ModalSuccessProps {
  isOpenSuccess: boolean;
  setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  transactionHash: string;
  isTransaction?: boolean;
  isMint?: boolean;
  metadataLink?: string;
}

const ModalSuccess: React.FunctionComponent<ModalSuccessProps> = ({
  isOpenSuccess,
  setIsOpenSuccess,
  type,
  transactionHash,
}) => {
  const { demask, chainId } = useContext(AccountContext);
  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSuccess(false);
  };
  return (
    <Wrapper isOpen={isOpenSuccess} onClick={handleClose} isTransaction>
      <div className="container_modal">
        <div className="h-fit w-[260px] md:w-[300px] lg:w-[450px] rounded-lg p-4 relative">
          <div>
            <div className="flex justify-between">
              <h2 className="title_modal">{type}</h2>
              <button className="text-lg " onClick={handleClose}>
                <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
              </button>
            </div>
            <div className="flex flex-col items-center h-[250px] justify-center">
              <SuccessIcon width={80} height={80} />
              <p className="mt-6 mb-2 font-bold text-green">
                Transaction Submitted
              </p>
              <a
                href={`${demask.urltxHash}tx/${transactionHash}`}
                target="_blank"
                className="flex items-center text-xs cursor-pointer text-shader_600 gap-x-1 hover:text-primary_400 group"
              >
                <p className="text-shader_200">View on {demask.chainName}</p>
                <p>
                  <URLTransactionIcon width={16} height={16} />
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
const ModalSuccessCreate: React.FunctionComponent<ModalSuccessProps> = ({
  isOpenSuccess,
  setIsOpenSuccess,
  transactionHash,
  isMint,
  metadataLink,
}) => {
  const { demask } = useContext(AccountContext);
  const [metadataRes, setMetadataRes] = useState<any>();
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const metadataIPFS = formatLinkIPFS(metadataLink!);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingMeta(true);
      console.log(metadataIPFS);
      const res = await fetch(metadataIPFS);
      const metadata = await res.json();
      setMetadataRes({
        metadata,
      });
      setIsLoadingMeta(false);
    };
    fetchData();
  }, [metadataLink]);

  const handleClose = (
    e: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.body.style.overflowY = "auto";
    setIsOpenSuccess(false);
  };
  return (
    <Wrapper isOpen={isOpenSuccess} onClick={handleClose} isTransaction>
      <div className="container_modal">
        <div className="h-fit w-[260px] md:w-[300px] lg:w-[450px] rounded-lg p-4 relative">
          {isMint ? (
            <Fragment>
              <div className="flex flex-col items-center">
                {isLoadingMeta ? (
                  <div className="flex items-center justify-center w-40 h-40 mx-auto mt-10 mb-6">
                    <BiLoaderAlt className="mb-6 text-5xl animate-spin text-primary_400" />
                  </div>
                ) : metadataRes ? (
                  <div className="w-40 h-40 mx-auto mt-10 mb-6 overflow-hidden rounded-lg">
                    <MediaNFT data={metadataRes} isControls hideAudio={true} />
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-center text-green">
                  Your NFT has been created
                </p>
                <a
                  href={`${demask.urltxHash}tx/${transactionHash}`}
                  target="_blank"
                  className="flex items-center text-xs text-center cursor-pointer text-shader_600 gap-x-1 hover:text-primary_400 group"
                >
                  <p className="text-shader_200">View on {demask.chainName}</p>
                  <p>
                    <URLTransactionIcon width={16} height={16} />
                  </p>
                </a>
              </div>
              <div className="flex items-center justify-center mt-6 gap-x-4">
                <Link href={`/profile?tab=items`}>
                  <Button className="px-6 py-2 font-semibold " active>
                    View NFTs
                  </Button>
                </Link>
                <Button primary className="px-6 py-2 " onClick={handleClose}>
                  Create an NFT
                </Button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="w-40 h-40 mx-auto mt-10 mb-6">
                <Image
                  src={metadataIPFS}
                  width={160}
                  height={160}
                  alt="Img-Collection"
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="font-semibold text-center text-green">
                  Your collection has been created
                </p>
                <a
                  href={`${demask.urltxHash}tx/${transactionHash}`}
                  target="_blank"
                  className="flex items-center text-xs text-center cursor-pointer text-shader_600 gap-x-1 hover:text-primary_400 group"
                >
                  <p className="text-shader_200">View on {demask.chainName}</p>
                  <p>
                    <URLTransactionIcon width={16} height={16} />
                  </p>
                </a>
              </div>
              <div className="flex items-center justify-center mt-6 gap-x-4">
                <Link href={`/profile?tab=created`}>
                  <Button className="px-6 py-2 font-semibold " active>
                    View collection
                  </Button>
                </Link>
                <Button primary className="px-6 py-2 " onClick={handleClose}>
                  Create an collection
                </Button>
              </div>
            </Fragment>
          )}
        </div>

        <button
          className="absolute top-0 right-0 p-2 text-lg"
          onClick={handleClose}
        >
          <CgClose className="text-xl text-white transition-colors duration-100 ease-linear hover:text-red" />
        </button>
      </div>
    </Wrapper>
  );
};
export { ModalSuccess, ModalSuccessCreate };
