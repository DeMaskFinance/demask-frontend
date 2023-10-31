import divideByDecimal from "./divideByDecimal";

const slippageTolerance = 5000

const getBuyPrice = (reserverNFT:number, reserverToken:number, amountNFT:number) => {
    const numerator = reserverToken * amountNFT * 10000;
    const denominator = (reserverNFT - amountNFT) * 9975;
    const amountIn = ( numerator / denominator) + 1;
    const fee = amountIn * slippageTolerance / 1000000;
    return (amountIn + fee) / amountNFT;
}

const getSellPrice = (reserverNFT:number, reserverToken:number, amountNFT:number) => {
    const amountInWithFee = amountNFT * 9975;
    const numerator = amountInWithFee * reserverToken;
    const denominator = reserverNFT * 10000 + amountInWithFee;
    const amountOut = numerator / denominator;
    const fee = amountOut * slippageTolerance / 1000000;
    return (amountOut - fee) / amountNFT;
}
export {getBuyPrice,getSellPrice};