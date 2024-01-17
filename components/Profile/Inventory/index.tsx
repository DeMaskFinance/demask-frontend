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
import { AddIcon, GoerliIcon, SwapIconProfile, ZkSyncIcon } from '@/components/Icons';
import ModalNumber from '@/components/Modal/ModalLength/ModalNumber';
import { Button } from '@/components/Buttons';
import FormatNumber from '@/components/Common/FormatNumber';
import ModalDocument from '@/components/Modal/ModalLength/ModalDocument';
import { ModalDetail } from '@/components/Modal/ModalDedail';
interface ModalDetailProps {
    data: any;
    nftAddress: string;
    nftID: string;
    setIsOpenDetail: any;
    isOpenDetail: boolean;
}
const Inventory = () => {
    const { account, chainId, demask } = useContext(AccountContext);
    const { NATIVE_ADDRESS: nativeAddress } = demask;
    const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<ModalDetailProps | null>(null);
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
        ["NFTsUser", chainId, account],
        ({ pageParam = 1 }) => fetchDataNFTs(pageParam, chainId, account),
        {
            getNextPageParam: (page) =>
                page?.currentPage === page?.totalPages
                    ? undefined
                    : page?.currentPage + 1,
        }
    );
    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);
    return (
        <div>
            {(isLoading) ? (
                <SkeletonCategory />
            ) : (
                (isSuccess && data?.pages[0]?.data?.length > 0) ? (
                    <div className='grid grid-cols-1 gap-6 mt-4 lg:grid-cols-4 md:grid-cols-3 text-dark2'>
                        {data?.pages.map((page, pageIndex) => (
                            <Fragment key={pageIndex}>
                                {page?.data?.map((item: any, index: number) => (
                                    <div key={index} className='relative overflow-hidden'>
                                        <div className="relative items-center p-3 text-sm transition-all border rounded-md cursor-pointer lg:text-base hover:-translate-y-1 hover:shadow-home">
                                            <div className="relative h-[240px]" onClick={() => {
                                                setSelectedItem(item);
                                                setIsOpenDetail(true);
                                                document.body.style.overflowY = "hidden";
                                            }}>
                                                <MediaNFT data={item} isControls={false} hover />
                                            </div>
                                            <div className='w-full'>
                                                <div className="flex w-full mt-2">
                                                    <div className='w-full'>
                                                        <h6
                                                            title={item.metadata.name}
                                                            className="flex items-start gap-2 font-medium uppercase"
                                                        >
                                                            <span className="flex-wrap text-xl line-clamp-1 max-w-[100%]">
                                                                <ModalDocument data={item.metadata.name} />
                                                            </span>
                                                        </h6>
                                                    </div>
                                                    {/* <ActiveIcon width={24} height={24} className="mr-4 fill-yellow" /> */}
                                                </div>
                                                <div className='my-1'>
                                                    {chainId === '280' ? (
                                                        <div className='flex items-center gap-x-1'>
                                                            <ZkSyncIcon width={18} height={12} className='fill-secondary3' />
                                                            <p className='text-[11px] font-semibold text-secondary3'>zKsync Era</p>
                                                        </div>
                                                    ) : (
                                                        <div className='flex items-center gap-x-1'>
                                                            <GoerliIcon width={18} height={12} className='fill-secondary3' />
                                                            <p className='text-[12px] font-semibold text-secondary3'>Goerli Testnet</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex justify-between'>
                                                    <p>Floor price</p>
                                                    <p>Balance</p>
                                                </div>
                                                <div className='flex justify-between font-semibold text-dark2'>
                                                    <div>
                                                        <FormatNumber number={item.floorPrice} />
                                                    </div>
                                                    <div>
                                                        {item.nftBalance ? (
                                                            <FormatNumber number={item.nftBalance} />
                                                        ) : (
                                                            <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className='flex justify-between mt-2'>
                                                    <Link href={`/add/${item.nftAddress}/${nativeAddress}/${item.nftID}`}>
                                                        <Button className='flex items-center px-6 py-2 text-white transition-all duration-100 bg-dark3 hover:bg-secondary5 gap-x-2'>
                                                            <p>Add</p>
                                                            <div>
                                                                <AddIcon width={24} height={24} />
                                                            </div>
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/swap/${item.nftAddress}/${nativeAddress}/${item.nftID}`}>
                                                        <Button className='flex items-center px-6 py-2 text-white transition-all duration-100 bg-dark3 hover:bg-secondary5 gap-x-2'>
                                                            <p>Swap</p>
                                                            <div>
                                                                <SwapIconProfile width={24} height={24} />
                                                            </div>
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Fragment>
                        ))}
                    </div>
                ) : (
                    <p>No data available.</p>
                )
            )}
            {selectedItem && (
                <ModalDetail
                    data={selectedItem}
                    idNFT={selectedItem?.nftID}
                    nftAddress={selectedItem?.nftAddress}
                    setIsOpenDetail={setIsOpenDetail}
                    isOpenDetail={isOpenDetail}
                />
            )}
            <div ref={ref} style={{ height: "1px" }}></div>
        </div>
    )
}
export default Inventory;