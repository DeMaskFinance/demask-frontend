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
import { ActiveIcon, AddIcon, SwapIconProfile, ZkSyncIcon } from '../Icons';
import MediaNFT from '../Common/MediaNFT';
const NFTs = () => {
    const { account, chainId } = useContext(AccountContext);
    const [chain] = useQueryParam('chain', withDefault(StringParam, 'All'));
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
    const [selectedAction, setSelectedAction] = useState<string>('Add');
    const { ref, inView } = useInView();
    const fetchDataNFTs = async (pageParam = 1, chain: string | string[], account: string) => {
        const data = await nftsUserService(account, chain, pageParam);
        return data;
    };

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

    // console.log({
    //     data
    // });
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);
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
                                            <div className="relative pb-[100%] h-[240px]">
                                                <MediaNFT data={item} isControls={false} hover />
                                            </div>
                                            <div>
                                                <div className="flex mt-2">
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
                                                    {/* <ActiveIcon width={24} height={24} className="mr-4 fill-yellow" /> */}
                                                </div>
                                                <div className='my-1'>
                                                    {chainId === '280' && (
                                                        <div className='flex'>
                                                            <ZkSyncIcon width={14} height={7} className='fill-secondary3' />
                                                            <p className='text-[10px] font-semibold text-secondary3'>ZKsync Era</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex justify-between'>
                                                    <p>Floor price</p>
                                                    <p>Balance</p>
                                                </div>
                                                <div className='flex justify-between font-semibold text-dark2'>
                                                    100 ETH
                                                    <div>
                                                        {item.nftBalance ? (
                                                            <ModalNumber data={item.nftBalance} />
                                                        ) : (
                                                            <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between mt-2'>
                                                    <Button className='flex items-center px-6 py-2 text-white transition-all duration-100 bg-dark3 hover:bg-secondary5 gap-x-2' onClick={() => handleChoiceAction(index, 'Add')}>
                                                        <p>Add</p>
                                                        <div>
                                                            <AddIcon width={24} height={24}/>
                                                        </div>
                                                    </Button>
                                                    <Button  className='flex items-center px-6 py-2 text-white transition-all duration-100 bg-dark3 hover:bg-secondary5 gap-x-2' onClick={() => handleChoiceAction(index, 'Swap')}>
                                                        <p>Swap</p>
                                                        <div>
                                                            <SwapIconProfile width={24} height={24}/>
                                                        </div>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {item && (
                                            <TransionDML item={item} chainId={chainId} selectedAction={selectedAction} index={index} selectedItemIndex={selectedItemIndex} setSelectedItemIndex={setSelectedItemIndex} />
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
