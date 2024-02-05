import Branding from '@/components/MediaKit/Branding'
import Guidelines from '@/components/MediaKit/Guidelines'
import React from 'react';
import { SEO } from '@/next-seo.config';
import { NextSeo } from 'next-seo';
const updateMeta = {
    ...SEO,
    title: 'MediaKit',
};
const MediaKit = () => {
    return (
        <div>
            <NextSeo {...updateMeta} />
            <div className='py-8 min-h-[75vh] max-w-[800px] mx-auto flex flex-col gap-y-14 mb-[100px] lg:mb-0'>
                <h1 className='text-4xl h-[60px] lg:text-[60px] font-semibold bg-gradient-to-b text-center from-[#BA8DE6] to-[#7B54E8] bg-clip-text text-transparent'>Branding & Media</h1>
                <Guidelines />
                <Branding />
            </div>
        </div>
    )
}

export default MediaKit
