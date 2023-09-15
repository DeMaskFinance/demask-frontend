import Image from 'next/image'
import React, { useContext, useEffect, useState, useRef } from "react";
import { useInView } from 'react-intersection-observer';
interface NFTItemsProps {
    nftItem: any;
    filter: any;
    setShowMore: any;
    showMore: boolean
}
const NFTItem: React.FunctionComponent<NFTItemsProps> = ({ nftItem, filter, setShowMore, showMore }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const { ref, inView } = useInView();
    const handleInViewChange = (isVisible: boolean) => {
        const video: any = videoRef.current;
        const audio: any = audioRef.current;
        if (video) {
            if (isVisible) {
                video.play();
                video.muted = false;
            } else {
                video.pause();
                video.muted = true;
            }
        } else if (audio) {
            if (isVisible) {
                audio.play();
                audio.muted = false;
            } else {
                audio.pause();
                audio.muted = true;
            }
        }
    };

    useEffect(() => {
        if (inView) {
            handleInViewChange(true);
        } else {
            handleInViewChange(false);
        }
    }, [inView]);
    return (
        <div className="relative overflow-hidden flex items-center lg:w-2/4 w-full lg:h-full h-[80vh] lg:px-4 md:px-4">
            <div ref={ref} className='relative lg:ml-20'>
                {nftItem.metadata.image && (
                    <div className="relative ml-auto mr-auto overflow-hidden lg:rounded-2xl">
                        <div
                            style={{
                                backgroundImage: `url(${nftItem.metadata.image})`,
                                backgroundSize: "cover",
                            }}
                            className={`lg:w-[530px] md:w-[1768px] w-[678px] bg-black max-[968px]:!bg-none max-[678px]:!bg-none lg:bg-nft(${nftItem.metadata.image}) lg:blur-[12px] lg:rounded-xl lg:h-[530px] h-[90vh]`}
                        ></div>
                        <div className="absolute w-full  top-[50%] -translate-y-2/4 lg:w-[530px] mx-auto lg:p-4 p-2 rounded-xl lg:h-[530px] ">
                            <Image
                                width={530}
                                height={530}
                                src={nftItem.metadata.image}
                                alt="NFT Image"
                                className="object-contain w-full h-full imageNFT rounded-xl"
                            />
                        </div>
                    </div>
                )}
                {nftItem.metadata.animation_url &&
                    !nftItem.metadata.image && (
                        <>
                            <div className="lg:w-[530px] mx-auto overflow-hidden rounded-xl relative h-full">
                                <div className="w-full bg-dark flex items-center mx-auto z-20 blur-[8px]  rounded-xl h-[80vh] ">
                                    <video
                                        src={nftItem.metadata.animation_url}
                                        muted
                                        className="object-cover h-full rounded-2xl"
                                    />
                                </div>
                                <div className="lg:w-[530px] absolute flex items-center  mx-auto z-20 px-4 top-[50%] -translate-y-2/4 rounded-xl h-[70vh] lg:h-[530px]">
                                    <video
                                        src={nftItem.metadata.animation_url}
                                        muted
                                        autoPlay
                                        ref={videoRef}
                                        loop
                                        controls
                                        className="rounded-2xl lg:w-[530px] w-full h-auto object-contain"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                {nftItem.metadata.image &&
                    nftItem.metadata.animation_url && (
                        <div className="absolute flex justify-center lg:top-[76%] top-[50%] lg:right-[0] w-full right-[90%] mx-auto mt-12 rounded-xl ">
                            <audio
                                autoPlay
                                loop
                                ref={audioRef}
                                muted
                                controls
                                src={nftItem.metadata.animation_url}
                                className="absolute"
                            >
                                Your browser does not support the
                                <code>audio</code> element.
                            </audio>
                        </div>
                    )}
            </div>

            <div className="absolute w-full bottom-0 bg-transparent  z-[21] lg:hidden pr-8 pl-2 text-left">
                <div className="flex justify-start mb-4 text-xl font-medium text-white">
                    <span className="line-clamp-1 w-[85%]  pl-2">
                        {filter?.metadata?.name}
                    </span>
                </div>
                <div className="mb-4 font-light min-h-[72px] max-h-[400px] overflow-auto text-sm pl-2 text-white">
                    <span
                        className={`${showMore ? "line-clamp-3" : ""
                            } transition-all`}
                    >
                        {filter?.metadata?.description}
                    </span>
                    {filter?.metadata?.description?.length > 100 && (
                        <span
                            className="block text-xs text-white"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? "See More" : "Close"}
                        </span>
                    )}
                </div>
            </div>

            <div
                className={`${showMore ? "" : ""
                    } absolute w-full bottom-0 bg-dark opacity-40 py-4 z-[20] lg:hidden pr-8 pl-2 text-left`}
            >
                <div className="flex justify-start mb-4 text-xl font-medium text-transparent">
                    <span className="line-clamp-1 w-[85%]">
                        {filter?.metadata?.name}
                    </span>
                </div>
                <div className="mb-4 font-light min-h-[72px] transition-all max-h-[400px] overflow-auto text-sm pl-2 text-white">
                    <span
                        className={`${showMore ? "line-clamp-3" : ""
                            } transition-all text-transparent`}
                    >
                        {filter?.metadata?.description}
                    </span>
                    {filter?.metadata?.description?.length > 100 && (
                        <span
                            className="block text-xs text-white"
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? "See More" : "Close"}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
export default NFTItem;
