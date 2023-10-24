import AccountContext from '@/context/AccountContext';
import { nftsUserService } from '@/libs/service/profileService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useInView } from "react-intersection-observer";
import SkeletonCategory from '../Skeleton/SkeletonCategory';
import Image from 'next/image';
import images from '@/public/images';
import { mediaType } from '@/libs/constants';
import { AvatarUser } from '../Avatars';
import ModalNumber from '../Modal/ModalLength/ModalNumber';
import Link from 'next/link';
import { Button } from '../Buttons';
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import { CgClose } from 'react-icons/cg';
import { searchNFTService } from '@/libs/service/searchService';
import { ZkSyncIcon } from '../Icons';
const NFTs = () => {
    const { account } = useContext(AccountContext);
    const [chain] = useQueryParam('chain', withDefault(StringParam, 'All'));
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>('Add');
    const { ref, inView } = useInView();
    const fetchDataNFTs = async (pageParam = 1, chain: string | string[], account: string) => {
        const data = await nftsUserService(account, chain, pageParam);
        return data;
    };
    console.log(chain);

    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        isSuccess,
        isLoading,
        isFetching,
    } = useInfiniteQuery(
        ["NFTsUser", chain, account],
        ({ pageParam = 1 }) => fetchDataNFTs(pageParam, chain, account),
        {
            getNextPageParam: (page) =>
                page?.currentPage === page?.totalPage
                    ? undefined
                    : page?.currentPage + 1,
        }
    );

    console.log(data);
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);
    console.log(data);
    const handleChoiceAction = (index: number, action: string) => {
        setSelectedItemIndex(index)
        setSelectedAction(action)
    }
    return (
        <div>
            {(isLoading || isFetchingNextPage || isFetching) ? (
                <SkeletonCategory />
            ) : (
                (isSuccess && data?.pages[0]?.userNFTLists?.length > 0) ? (
                    <div className='grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-dark2'>
                        {data.pages.map((page, pageIndex) => (
                            <Fragment key={pageIndex}>
                                {page.userNFTLists.map((item: any, index: number) => (
                                    <div key={index} className='relative overflow-hidden'>
                                        <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home">
                                            <div className="relative pb-[100%] h-0">
                                                {item.metadata.image && mediaType.image.some(extension => item.metadata.image.endsWith(extension)) && (
                                                    <Image
                                                        loading="lazy"
                                                        width={760}
                                                        height={760}
                                                        src={item.metadata.image}
                                                        alt="NFT Image"
                                                        placeholder="blur"
                                                        blurDataURL={`${images.blur}`}
                                                        className="absolute object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full rounded-lg"
                                                    />
                                                )}
                                                {item.metadata.animation_url &&
                                                    !item.metadata.image && mediaType.video.some(extension => item.metadata.animation_url.endsWith(extension)) && (
                                                        <video
                                                            src={item.metadata.animation_url}
                                                            autoPlay={false}
                                                            loop
                                                            muted
                                                            controls={false}
                                                            onMouseOver={(event) =>
                                                                (event.target as any).play()
                                                            }
                                                            onMouseOut={(event) =>
                                                                (event.target as any).pause()
                                                            }
                                                            className="absolute object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full rounded-lg"
                                                        />
                                                    )}
                                                {item.metadata.image &&
                                                    item.metadata.animation_url && mediaType.audio.some(extension => item.metadata.animation_url.endsWith(extension)) && (
                                                        <audio
                                                            autoPlay
                                                            loop
                                                            muted
                                                            controls
                                                            src={item.metadata.animation_url}
                                                            className="absolute top-[83%] h-10 translate-x-1/2 right-2/4 w-[80%] py-1 rounded-lg  object-cover"
                                                        >
                                                            Your browser does not support the
                                                            <code>audio</code> element.
                                                        </audio>
                                                    )}
                                            </div>
                                            <div>
                                                <div className="flex justify-between pb-1 my-2">
                                                    <div>
                                                        <h6
                                                            title={item.metadata.name}
                                                            className="flex items-start gap-2 font-medium uppercase"
                                                        >
                                                            <span className="flex-wrap text-xl line-clamp-1">
                                                                {item.metadata.name}
                                                            </span>
                                                        </h6>
                                                    </div>
                                                    <div className="flex items-end gap-x-1">
                                                        <p>Balance: </p>
                                                        {item.nftBalance ? (
                                                            <ModalNumber data={item.nftBalance} />
                                                        ) : (
                                                            <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <Button primary className='p-2' onClick={() => handleChoiceAction(index, 'Add')}>
                                                        Add
                                                    </Button>
                                                    <Button primary className='p-2' onClick={() => handleChoiceAction(index, 'Swap')}>
                                                        Swap
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='absolute top-[13px] left-[13px] rounded-tl-lg text-white text-sm bg-secondary5'>
                                            {item.chainId === 280 && (
                                                <>
                                                    <span><ZkSyncIcon className='p-1 fill-white' /></span>
                                                </>
                                            )}
                                        </div>
                                        {item && (
                                            <TransionDML item={item} chainId={item.chainId} selectedAction={selectedAction} index={index} selectedItemIndex={selectedItemIndex} setSelectedItemIndex={setSelectedItemIndex} />
                                        )}
                                    </div>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                ) : (
                    <p>No data available.</p>
                )
            )}
            <div ref={ref} style={{ height: "1px" }} />
        </div>
    )
}
const TransionDML = (
    props: {
        item: any,
        chainId: string,
        selectedAction: string,
        index: number,
        selectedItemIndex: number | null,
        setSelectedItemIndex: any
    }
) => {
    console.log(props);

    const { isLoading, data, isFetching, isSuccess, refetch } = useQuery({
        queryKey: ["dml", props],
        queryFn: async () => {
            const res = await searchNFTService(props.item.nftAddress, props.item.nftID, props.chainId);
            return res;
        },
        keepPreviousData: true,
    });
    console.log(data);

    return (
        <div className={`absolute border p-2 top-0 left-0 w-full h-full bg-white rounded-md transition-all ease-linear duration-150 ${props.selectedItemIndex === props.index ? 'translate-y-0' : 'translate-y-full'}`}>
            {props.selectedAction}
            {(isLoading || isFetching) ? (
                <p>Loading...</p>
            ) : isSuccess && data.length > 0 ? (
                data.map((dmlItem: any, index: number) => (
                    <Link href={`/details/${dmlItem.dmlAddress}`} key={index} className='relative flex items-center mt-2'>
                        <span>{dmlItem.metadata.symbol}</span>
                        <span className="block overflow-hidden leading-3">/</span>
                        <span>{dmlItem.tokenSymbol}</span>
                    </Link>
                ))
            ) : (
                <p>No data available.</p>
            )}
            <button
                className="absolute top-0 right-0 p-2 text-lg"
                onClick={() => props.setSelectedItemIndex(null)}
            >
                <CgClose className="text-xl transition-colors duration-100 ease-linear hover:text-red" />
            </button>
        </div>
    )
}
export default NFTs
