var feeProtocol = 5000

async function getBuyPrice(reserverNFT:number, reserverToken:number, amountNFT:number) {
    var numerator = reserverToken * amountNFT * 10000;
    var denominator = reserverNFT * amountNFT * 9975;
    var amountIn = ( numerator / denominator) + 1;
    var fee = amountIn * feeProtocol / 1000000;
    return (amountIn + fee) / amountNFT
}

async function getSellPrice(reserverNFT:number, reserverToken:number, amountNFT:number) {
    var amountInWithFee = amountNFT * 9975;
    var numerator = amountInWithFee * reserverToken;
    var denominator = reserverNFT * 10000 + amountInWithFee;
    var amountOut = numerator / denominator;
    var fee = amountOut * feeProtocol / 1000000;
    return (amountOut - fee) / amountNFT;
}