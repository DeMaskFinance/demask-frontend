import { useEffect, useState } from 'react'
import Image from "next/image";
import { AvatarUser } from "../Avatars";
import images from "@/public/images";
import useInformationDML from "@/hooks/useInformationDML";
import formatNumber from "@/libs/utils/formatNumer";
import divideByDecimal from "@/libs/utils/divideByDecimal";
import BigNumber from "bignumber.js";
import useAmountInMax from "@/hooks/useAmountInMax";
import checkIsERC20 from '@/libs/validation/checkIsERC20';
import Link from 'next/link';

interface NFTCategoryProps {
    item: any
}

const NFTCategory: React.FunctionComponent<NFTCategoryProps> = ({ item }) => {
    const [symbolToken, setSymbolToken] = useState<string>("");
    const {
        reserves,
        decimals,
        idNFT,
        nftAddress,
        reserveNFT,
        reserveToken,
        tokenAddress,
        isLoadingInforDML
    } = useInformationDML(item.dmlAddress);
    const { amountTokenBuy } = useAmountInMax(
        "1",
        item.dmlAddress,
        tokenAddress,
        nftAddress,
        idNFT,
        "Metamask",
        "BUY"
    );
    let tokenAddressSwap = "";
    if (tokenAddress === "0x734aeF51d427b2f745210Ec4BF1062ABd48Eceb6") {
        tokenAddressSwap = "MATIC";
    } else {
        tokenAddressSwap = tokenAddress;
    }
    const amountBuy = new BigNumber(amountTokenBuy);
    const formatPrice = formatNumber(
        divideByDecimal(amountBuy.toFixed(), decimals)
    );
    useEffect(() => {
        const handleToken = async () => {
            const { symbol } = await checkIsERC20(tokenAddress);
            setSymbolToken(symbol);
        };
        handleToken();
    }, [tokenAddress]);
    let symbolTokenSwap = "";
    if (symbolToken === "WETH") {
        symbolTokenSwap = "MATIC";
    } else {
        symbolTokenSwap = symbolToken;
    }
    const getDate = (timeStamp: any) => {
        const date = timeStamp * 1000;
        const currentDateMillis = Date.now();
        const timeDifferenceMillis = date - currentDateMillis;
        const daysLeft = Math.ceil(timeDifferenceMillis / (1000 * 60 * 60 * 24));
        return -daysLeft;
    };
    return (

        <Link
            href={`/swap/${item.nft}/${item.tokenAddress}/${item.tokenId}?dmlAddress=${item.dmlAddress}`}
        >
            <div className="relative">
                <div className="relative pb-[100%] h-0">
                    {item.metadata.image && (
                        <Image
                            loading="lazy"
                            width={760}
                            unoptimized
                            height={760}
                            src={item.metadata.image}
                            alt="NFT Image"
                            placeholder="blur"
                            blurDataURL={`${images.blur}`}
                            className="absolute object-cover w-0 h-0 max-w-full max-h-full min-w-full min-h-full rounded-lg"
                        />
                    )}
                    {item.metadata.animation_url &&
                        !item.metadata.image && (
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
                        item.metadata.animation_url && (
                            <audio
                                autoPlay
                                loop
                                muted
                                controls
                                src={item.metadata.animation_url}
                                className="absolute top-32 h-10 translate-x-1/2 right-2/4 w-[80%] py-1 rounded-lg  object-cover"
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
                        <span className="pb-1 -ml-2.5 block">
                            {item.creatorAddress.slice(0, 4)}...
                            {item.creatorAddress.slice(-4)}
                        </span>
                    </div>
                    <div className="flex justify-between pb-1">

                        <div>
                            <p>Price</p>
                            {symbolToken && tokenAddress && nftAddress ? (
                                <div className="flex flex-col">
                                    {reserveToken.toString() === "0" ||
                                        reserveNFT.toString() === "0" ||
                                        reserveNFT.toString() === "1" ? (
                                        <div className="text-red">Can't buy</div>
                                    ) : (
                                        <p>
                                            {formatPrice} {symbolTokenSwap}
                                        </p>
                                    )}

                                </div>
                            ) : (
                                <div className="flex animate-pulse gap-x-4">
                                    <div className="w-24 h-6 rounded-full bg-slate-200"></div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <p>Reverse NFT</p>
                            {isLoadingInforDML ? (
                                <span className="block w-20 h-6 rounded-xl animate-pulse bg-slate-200"></span>
                            ) : (
                                <p className="block">{formatNumber(reserveNFT.toString())}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <p>Reverse Token</p>
                            {isLoadingInforDML ? (
                                <span className="block w-20 h-6 rounded-xl animate-pulse bg-slate-200"></span>
                            ) : (
                                <p className="block">{formatNumber(
                                    divideByDecimal(reserveToken.toString(), decimals)
                                )}</p>
                            )
                            }
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