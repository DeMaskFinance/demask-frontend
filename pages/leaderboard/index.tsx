import { TabGroups } from '@/components/NavChoice';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import SkeletonLeaderBoard from '@/components/Skeleton/SkeletonLeaderBoard';
import { SEO } from '@/next-seo.config';
import { NextSeo } from 'next-seo';
const updateMeta = {
    ...SEO,
    title: 'Leaderboard',
};
const LeaderBoard = () => {
    const [activeChoice, setActiveChoice] = useState<string>("Current Season");
    const handleChoiceChange = (choice: string) => {
        setActiveChoice("Current Season");
    };
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
                {/* <div className='max-w-[400px] lg:max-w-[800px] mx-auto'>
                    <Swiper
                        initialSlide={1}
                        pagination={{
                            dynamicBullets: true,
                        }}
                        // loop={true}
                        modules={[Pagination]}
                        autoplay={
                            {
                                delay: 6000,
                                disableOnInteraction: false,
                                reverseDirection: true,
                            }
                        }
                        breakpoints={{
                            0: {
                                slidesPerView: 1.5,
                                spaceBetween: 10,
                                centeredSlides: true,
                            },
                            480: {
                                slidesPerView: 1.5,
                                spaceBetween: 30,
                                centeredSlides: true,
                            },
                            768: {
                                slidesPerView: 1.5,
                                spaceBetween: 30,
                                centeredSlides: true,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                        }}
                        className='mySwiper'
                    >
                        <SwiperSlide >
                            <div className='mt-6'>
                                <CardList />
                            </div>
                        </SwiperSlide>
                        <SwiperSlide >
                            <CardList />
                        </SwiperSlide>
                        <SwiperSlide >
                            <div className='mt-10'>
                                <CardList />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
                <TableRank /> */}
                <SkeletonLeaderBoard />
            </div>
        </div>
    )
}

export default LeaderBoard
