import TableRank from '@/components/LeaderBoard/TableRank';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules
import { Pagination } from 'swiper';
import { CardListLoading } from '../LeaderBoard/CardList';
import SkeletonTable from './SkeletonTable';
const SkeletonLeaderBoard = () => {
    return (
        <div>
            <div className='max-w-[400px] lg:max-w-[800px] mx-auto mb-6'>
                <Swiper
                    initialSlide={1}
                    // pagination={{
                    //     dynamicBullets: true,
                    // }}
                    loop={true}
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
                        <div className='lg:mt-6'>
                            <CardListLoading />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide >
                        <CardListLoading />
                    </SwiperSlide>
                    <SwiperSlide >
                        <div className='lg:mt-10'>
                            <CardListLoading />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <tbody>
                <SkeletonTable length={8} />
            </tbody>
        </div>
    )
}

export default SkeletonLeaderBoard
