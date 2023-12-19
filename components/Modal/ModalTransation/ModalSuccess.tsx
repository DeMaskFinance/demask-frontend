import { CgClose } from "react-icons/cg";
import Wrapper from "../Wrapper";
import { SuccessIcon, URLTransactionIcon } from "@/components/Icons";
import { Button } from "@/components/Buttons";
import { useContext } from "react";
import AccountContext from "@/context/AccountContext";
import MediaNFT from "@/components/Common/MediaNFT";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { searchNFTService } from "@/libs/service/searchService";
import { BiLoaderAlt } from "react-icons/bi";
import Link from "next/link";
import useMetadata from "@/hooks/useMetadata";

interface ModalSuccessProps {
    isOpenSuccess: boolean;
    setIsOpenSuccess: React.Dispatch<React.SetStateAction<boolean>>;
    type: string;
    transactionHash: string;
    isTransaction?: boolean;
    isMint?: boolean;
    idNFT?: number;
}

const ModalSuccess: React.FunctionComponent<ModalSuccessProps> = ({ isOpenSuccess, setIsOpenSuccess, type, transactionHash, isMint, idNFT }) => {
    const { demask, chainId, wallet } = useContext(AccountContext);
    const { metadata, isLoadingMeta } = useMetadata('0x59620b99146c56785b067f84237fa80d89588228', idNFT, wallet);
    const dataMeta = {
        metadata
    }
    const handleClose = (e: any) => {
        e.preventDefault();
        document.body.style.overflowY = "auto";
        setIsOpenSuccess(false);
    };
    return (
        <Wrapper isOpen={isOpenSuccess} onClick={handleClose} isTransaction>
            <div className="relative z-50 flex flex-col justify-center cursor-default h-fit">
                <div className="bg-white h-fit w-[260px] md:w-[300px] lg:w-[450px] rounded-lg p-4 relative">
                    {isMint ? (
                        <div className="flex flex-col items-center">
                            {isLoadingMeta ? (
                                <div className="flex items-center justify-center w-40 h-40 mx-auto mt-10 mb-6">
                                    <BiLoaderAlt className="mb-6 text-5xl animate-spin text-secondary5" />
                                </div>
                            ) : (metadata) ? (
                                <div className="w-40 h-40 mx-auto mt-10 mb-6">
                                    <MediaNFT data={dataMeta} isControls />
                                </div>
                            ) : (
                                null
                            )}
                            <p className="font-semibold text-green">Your collection has been created</p>
                            <a href={`${demask.urltxHash}${transactionHash}`} target="_blank" className="flex items-center text-xs cursor-pointer text-dark2 gap-x-1 hover:text-secondary5 group">
                                <p>View on zkSync Era</p>
                                <p>
                                    <URLTransactionIcon width={16} height={16} className="group-hover:fill-secondary5" />
                                </p>
                            </a>
                            <div className="flex items-center mt-6 gap-x-4">
                                <Link href='/profile?tab=nfts'>
                                    <Button className='px-6 py-2 font-semibold text-white bg-dark3' >View collection</Button>
                                </Link>
                                <Button primary className='px-6 py-2 ' onClick={handleClose}>Create an NFT</Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="flex items-center mb-4 text-xl font-semibold text-dark1">{type}</h2>
                            <div className="flex flex-col items-center">
                                <SuccessIcon width={120} height={120} />
                                <p className="mt-6 mb-2 font-semibold text-green">Transaction Submitted</p>
                                <a href={`${demask.urltxHash}${transactionHash}`} target="_blank" className="flex items-center text-xs cursor-pointer text-dark2 gap-x-1 hover:text-secondary5 group">
                                    <p>View on zkSync Era</p>
                                    <p>
                                        <URLTransactionIcon width={16} height={16} className="group-hover:fill-secondary5" />
                                    </p>
                                </a>
                                <Button primary className='p-2 mt-6' onClick={handleClose}>Close</Button>
                            </div>
                        </div>
                    )}
                </div>
                <button
                    className="absolute top-0 right-0 p-2 text-lg"
                    onClick={handleClose}
                >
                    <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
                </button>
            </div>
        </Wrapper>
    );
}

export default ModalSuccess;