import  axios  from 'axios';
import request from "../utils/httpRequest";

export const NFTTopService = async (chainId:string|string[]) =>{
    try {
        const res = await request.get(`topNFT-list?chainId=${chainId}`)
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}