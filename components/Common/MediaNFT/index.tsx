import images from '@/public/images'
import Image from 'next/image'
import React from 'react'
interface MediaNFTProps {
    data: any,
    isControls: boolean,
    hover?: boolean,
    launchpad?: boolean
}
const MediaNFT: React.FC<MediaNFTProps> = ({ data, isControls, hover, launchpad }) => {
    
    return (
        <>
            {data?.metadata && (
                <div className="relative h-[inherit] w-full">
                    {data.metadata?.image && (
                        <Image
                            src={data.metadata.image}
                            alt="test"
                            width={680}
                            height={576}
                            sizes="(max-width: 770px) 100vw"
                            className="w-full rounded-lg h-full lg:max-h-[calc(100vh-326px)] object-cover"
                            blurDataURL={`${images.blur}`}
                            onError={(event: any) => {
                                event.target.srcset = "https://images.unsplash.com/photo-1511285605577-4d62fb50d2f7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=876&q=80";
                            }}
                        />
                    )}
                    {!data.metadata?.image && data.metadata?.animation_url && (
                        <video
                            src={data.metadata.animation_url}
                            autoPlay
                            playsInline
                            loop
                            muted
                            controls={isControls}
                            {...(hover
                                ? {
                                    onMouseOver: (event) => (event.target as any).play(),
                                    onMouseOut: (event) => (event.target as any).pause(),
                                }
                                : {})}
                            className="w-full rounded-lg lg:max-h-[calc(100vh-326px)] object-cover h-full"
                            poster="/Placeholder.png"
                        />
                    )}
                    {data.metadata?.image && data.metadata?.animation_url && !launchpad && (
                        <audio
                            autoPlay
                            loop
                            muted
                            controls
                            src={data.metadata.animation_url}
                            className={`absolute top-[83%] h-10 translate-x-1/2 right-2/4 w-[65%] py-1 rounded-lg  object-cover ${isControls ? '' : 'hidden'}`}
                        >
                            Your browser does not support the
                            <code>audio</code> element.
                        </audio>
                    )}
                    {!data.metadata?.image && !data.metadata?.animation_url && (
                        <Image
                            src="/Placeholder.png"
                            alt="test"
                            width={680}
                            height={576}
                            sizes="(max-width: 770px) 100vw"
                            className="w-full rounded-lg h-full lg:max-h-[calc(100vh-326px)] object-cover"
                            blurDataURL={`${images.blur}`}
                        />
                    )}
                </div>
            )}</>
    )
}

export default MediaNFT
