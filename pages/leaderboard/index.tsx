import { TabGroups } from '@/components/NavChoice';
import { useContext, useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import SkeletonLeaderBoard from '@/components/Skeleton/SkeletonLeaderBoard';
import { SEO } from '@/next-seo.config';
import { NextSeo } from 'next-seo';
import { useQuery } from '@tanstack/react-query';
import AccountContext from '@/context/AccountContext';
import { leaderBoardAPI } from '@/libs/service/leaderBoard';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination } from 'swiper';
import TableRank from '@/components/LeaderBoard/TableRank';
import CardList from '@/components/LeaderBoard/CardList';
const updateMeta = {
    ...SEO,
    title: 'Leaderboard',
};
const LeaderBoard = () => {
    const [activeChoice, setActiveChoice] = useState<string>("Current Season");
    const handleChoiceChange = (choice: string) => {
        setActiveChoice("Current Season");
    };
    const { chainId } = useContext(AccountContext);
    const { isLoading, data, isSuccess } = useQuery({
        queryKey: ["leaderBoard", chainId],
        queryFn: async () => {
            const res = await leaderBoardAPI(chainId, 1, "");
            return res;
        },
        keepPreviousData: true,
    });

    return (
        <div>
            <NextSeo {...updateMeta} />
            <div className='py-8 min-h-[75vh] max-w-[1048px] mx-auto flex flex-col gap-y-14 mb-[100px]'>
                <h1 className='text-4xl h-[60px] lg:text-[60px] font-semibold bg-gradient-to-b text-center from-[#BA8DE6] to-[#7B54E8] bg-clip-text text-transparent'>Season 1</h1>
                <div className='flex justify-center'>
                    <TabGroups
                        choices={["Current Season", "Previous Season"]}
                        activeChoice={activeChoice}
                        onChoiceChange={handleChoiceChange}
                    />
                </div>
                {isLoading ? (
                    <SkeletonLeaderBoard />
                ) : isSuccess && (
                    <div>
                        <div className='max-w-[400px] lg:max-w-[800px] mx-auto flex gap-x-4'>
                            <div className='mt-6 basis-1/3'>
                                <CardList data={data.data[1]} />
                            </div>
                            <div className='basis-1/3'>
                                <CardList data={data.data[0]} />
                            </div>
                            <div className='mt-10 basis-1/3'>
                                <CardList data={data.data[2]} />
                            </div>
                        </div>
                        <TableRank />
                    </div>
                )}

            </div>
        </div>
    )
}

export default LeaderBoard
