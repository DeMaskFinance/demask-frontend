import { mediaType } from '@/libs/constants';
import formatNumber from "@/libs/utils/formatNumer";
import { getBuyPrice } from '@/libs/utils/getPrice';
import images from "@/public/images";
import Image from "next/image";
import Link from 'next/link';
import { AvatarUser } from "../Avatars";
import ModalNumber from '../Modal/ModalLength/ModalNumber';

interface NFTCategoryProps {
    item: any
}

const NFTCategory: React.FunctionComponent<NFTCategoryProps> = ({ item }) => {
    let symbolTokenSwap = "";
    if (item.tokenSymbol === "WETH") {
        symbolTokenSwap = "MATIC";
    } else if (item.tokenSymbol === "WBNB") {
        symbolTokenSwap = "BNB";
    } else {
        symbolTokenSwap = item.tokenSymbol;
    }
    const getDate = (timeStamp: any) => {
        const date = timeStamp * 1000;
        const currentDateMillis = Date.now();
        const timeDifferenceMillis = date - currentDateMillis;
        const daysLeft = Math.ceil(timeDifferenceMillis / (1000 * 60 * 60 * 24));
        return -daysLeft;
    };
    console.log(item);

    return (
        <Link
            href={`/swap/${item.nft}/${item.erc}/${item.FactoryContract_id}`}
        >
            <div className="relative">
                <div className="relative pb-[100%] h-0">
                    {item.metadata.image && mediaType.image.some(extension => item.metadata.image.endsWith(extension)) && (
                        <Image
                            loading="lazy"
                            width={760}
                            height={760}
                            src={item.metadata.image}
                            alt="NFT Image"
                            placeholder="blur"
                            blurDataURL={`${images.blur}`}
                            className="absolute object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full rounded-lg"
                        />
                    )}
                    {item.metadata.animation_url &&
                        !item.metadata.image && mediaType.video.some(extension => item.metadata.animation_url.endsWith(extension)) && (
                            <video
                                src={item.metadata.animation_url}
                                autoPlay={false}
                                loop
                                muted
                                controls={false}
                                onMouseOver={(event) =>
                                    (event.target as any).play()
                                }
                                onMouseOut={(event) =>
                                    (event.target as any).pause()
                                }
                                className="absolute object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full rounded-lg"
                            />
                        )}
                    {item.metadata.image &&
                        item.metadata.animation_url && mediaType.audio.some(extension => item.metadata.animation_url.endsWith(extension)) && (
                            <audio
                                autoPlay
                                loop
                                muted
                                controls
                                src={item.metadata.animation_url}
                                className="absolute top-[83%] h-10 translate-x-1/2 right-2/4 w-[80%] py-1 rounded-lg  object-cover"
                            >
                                Your browser does not support the
                                <code>audio</code> element.
                            </audio>
                        )}
                </div>

                <div>
                    <h6
                        title={item.metadata.name}
                        className="flex items-start gap-2 py-2 font-medium uppercase"
                    >
                        <span className="flex-wrap text-xl line-clamp-1">
                            {item.metadata.name}
                        </span>
                        <svg
                            className="flex-shrink-0"
                            width="25"
                            height="24"
                            viewBox="0 0 25 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                opacity="0.4"
                                d="M17.3199 1.91H7.67995C5.55995 1.91 3.81995 3.65 3.81995 5.77V19.86C3.81995 21.66 5.10995 22.42 6.68995 21.55L11.5699 18.84C12.0899 18.55 12.9299 18.55 13.4399 18.84L18.3199 21.55C19.8999 22.43 21.1899 21.67 21.1899 19.86V5.77C21.1799 3.65 19.4499 1.91 17.3199 1.91Z"
                                fill="#9075FE"
                            />
                            <path
                                d="M11.59 13.251C11.4 13.251 11.21 13.181 11.06 13.031L9.55999 11.531C9.42051 11.3899 9.34229 11.1994 9.34229 11.001C9.34229 10.8026 9.42051 10.6121 9.55999 10.471C9.84999 10.181 10.33 10.181 10.62 10.471L11.59 11.441L15.06 7.97099C15.35 7.68099 15.83 7.68099 16.12 7.97099C16.41 8.26099 16.41 8.74099 16.12 9.03099L12.12 13.031C11.97 13.181 11.78 13.251 11.59 13.251Z"
                                fill="#9075FE"
                            />
                        </svg>
                    </h6>
                    <div className="flex">
                        <span className="shrink-0">
                            <AvatarUser width={24} height={24} />
                        </span>
                        <span className="block pb-1">
                            {item.creator?.slice(0, 4)}...
                            {item.creator?.slice(-4)}
                        </span>
                    </div>
                    <div className="flex justify-between pb-1">

                        <div>
                            <p>Price</p>
                            {item.tokenSymbol && item.reserveToken && item.nft ? (
                                <div className="flex flex-col">
                                    {item.reserveToken.toString() === "0" ||
                                        item.reserveNFT.toString() === "0" ||
                                        item.reserveNFT.toString() === "1" ? (
                                        <div className="text-red">Can't buy</div>
                                    ) : (
                                        <div className='flex gap-x-1'>
                                            <span>{formatNumber(getBuyPrice(item.reserveNFT, item.reserveToken, 1).toString())}</span>
                                            <span>{symbolTokenSwap}</span>
                                        </div>
                                    )}

                                </div>
                            ) : (
                                <div className="flex animate-pulse gap-x-4">
                                    <div className="w-24 h-6 rounded-full bg-slate-200"></div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-end">
                            <p>Reverse NFT</p>
                            {item.reserveNFT ? (
                                <ModalNumber data={item.reserveNFT} />
                            ) : (
                                <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <p>Reverse Token</p>
                            {item.reserveToken ? (
                                <span className="block">
                                    {formatNumber(
                                        item.reserveToken
                                    )}
                                </span>
                            ) : (
                                <span className="block w-16 h-4 rounded-xl animate-pulse bg-slate-200"></span>
                            )}
                        </div>

                        <p className="block">
                            {getDate(item.blockTimestamp)} d ago
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default NFTCategory;