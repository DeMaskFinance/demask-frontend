import AccountContext from '@/context/AccountContext';
import { nftsUserService } from '@/libs/service/profileService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useInView } from "react-intersection-observer";
import Image from 'next/image';
import images from '@/public/images';
import { mediaType } from '@/libs/constants';
import Link from 'next/link';
import { useQueryParam, StringParam, withDefault } from 'use-query-params';
import SkeletonCategory from '@/components/Skeleton/SkeletonCategory';
import MediaNFT from '@/components/Common/MediaNFT';
import { AddIcon, SwapIconProfile, ZkSyncIcon } from '@/components/Icons';
import ModalNumber from '@/components/Modal/ModalLength/ModalNumber';
import { Button } from '@/components/Buttons';
import TransionDML from './TransitionDML';
const Inventory = () => {
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
                page?.currentPage === page?.totalPages
                    ? undefined
                    : page?.currentPage + 1,
        }
    );

    console.log({
        data,
        chain
    });
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
            {(isLoading) ? (
                <SkeletonCategory />
            ) : (
                (isSuccess && data?.pages[0]?.data?.length > 0) ? (
                    <div className='grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-dark2'>
                        {data.pages.map((page, pageIndex) => (
                            <Fragment key={pageIndex}>
                                {page.data.map((item: any, index: number) => (
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
                                                        <div className='flex items-center gap-x-1'>
                                                            <ZkSyncIcon width={18} height={7} className='fill-secondary3' />
                                                            <p className='text-[11px] font-semibold text-secondary3'>zKsync Era</p>
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
            <div ref={ref} style={{ height: "1px" }}></div>
        </div>
    )
}
export default Inventory;