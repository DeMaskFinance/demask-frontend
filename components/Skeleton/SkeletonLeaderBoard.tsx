import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { CardListLoading } from '../LeaderBoard/CardList';
import SkeletonTable from './SkeletonTable';
const SkeletonLeaderBoard = () => {
    return (
        <div>
            <div className='max-w-[400px] lg:max-w-[800px] mx-auto flex gap-x-4'>
                <div className='mt-6 basis-1/3'>
                    <CardListLoading />
                </div>
                <div className='basis-1/3'>
                    <CardListLoading />
                </div>
                <div className='mt-10 basis-1/3'>
                    <CardListLoading />
                </div>
            </div>
            <SkeletonTable length={8} />
        </div>
    )
}

export default SkeletonLeaderBoard
