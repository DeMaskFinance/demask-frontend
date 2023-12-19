import request from "../utils/httpRequest";

export const searchTokenService = async (tokenAddress:string,chainId:string|string[]) =>{
    try {
        const res = await request.get(`token?chainId=${chainId}&tokenAddress=${tokenAddress}`);
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}
export const searchNFTService = async (chainId:string|string[],nftAddress:string,nftID:string) =>{
    try {
        const res = await request.get(`search?chainId=${chainId}&nftAddress=${nftAddress}&id=${nftID}`);
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}