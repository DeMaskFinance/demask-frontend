import request from "../utils/httpRequest";

export const searchTokenService = async (tokenAddress:string,chainId:string|string[]) =>{
    try {
        console.log(tokenAddress);
        console.log(chainId);
        
        const res = await request.get(`/v2/token?chainId=${chainId}&tokenAddress=${tokenAddress}`);
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}