import { Button } from '@/components/Buttons';
import Image from 'next/image';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
export default function Referral() {
    const [sponsor] = useQueryParam('sponsor', withDefault(StringParam, '0x4699A9A5607c9281103Ad504fA922276Eb6385A2'));

    return (
        <div className='min-h-[75vh] pt-11 max-w-[1400px] mx-auto'>
            <div className='block lg:flex p-3 lg:p-8 shadow-home gap-x-20 min-h-[600px]'>
                <div className='flex flex-col items-center justify-center basis-1/2'>
                    <h1 className='text-xl lg:text-3xl h-[60px]  font-semibold bg-gradient-to-b text-center from-[#BA8DE6] to-[#7B54E8] bg-clip-text text-transparent'>ENTER YOUR INVITE CODE TO JOIN</h1>
                    <div className='flex gap-x-4'>
                        <p className='px-6 py-2 font-semibold border rounded-lg text-dark3 border-dark4'>CODE12343210002</p>
                        <Button className='px-6 py-2' primary>Join now</Button>
                    </div>
                </div>
                <div className='self-center mt-8 basis-1/2 justify-items-center lg:mt-0'>
                    <Image src='/images/referral.svg' alt='referral' width={412} height={384} className='mx-auto'/>
                </div>
            </div>
        </div>
    )
}
