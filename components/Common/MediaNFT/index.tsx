import images from '@/public/images'
import Image from 'next/image'
import React from 'react'
interface MediaNFTProps {
    data: any,
    isControls:boolean
}
const MediaNFT: React.FC<MediaNFTProps> = ({ data,isControls }) => {
    return (
        <>
            {data?.metadata && (
                <div className="relative h-[inherit]">
                    {data.metadata?.image && (
                        <Image
                            src={data.metadata.image}
                            alt="test"
                            width={680}
                            height={576}
                            sizes="(max-width: 770px) 100vw"
                            className="w-full rounded-lg h-full lg:max-h-[calc(100vh-326px)] object-cover"
                            blurDataURL={`${images.blur}`}
                        />
                    )}
                    {!data.metadata?.image && data.metadata?.animation_url && (
                        <video
                            src={data.metadata.animation_url}
                            autoPlay
                            loop
                            muted
                            controls={isControls}
                            className="w-full rounded-lg lg:max-h-[calc(100vh-326px)] object-cover h-full"
                        />
                    )}
                    {data.metadata?.image && data.metadata?.animation_url && (
                        <audio
                            autoPlay
                            loop
                            muted
                            controls
                            src={data.metadata.animation_url}
                            className={`absolute top-[83%] h-10 translate-x-1/2 right-2/4 w-[65%] py-1 rounded-lg  object-cover ${isControls?'':'hidden'}`}
                        >
                            Your browser does not support the
                            <code>audio</code> element.
                        </audio>
                    )}
                </div>
            )}</>
    )
}

export default MediaNFT
