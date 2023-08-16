import  axios  from 'axios';
import request from "../utils/httpRequest";

export const metadataService = async (nftAddress:string,idNFT:String,tokenAddress:string) =>{
    try {
        const res = await request.get(`/getMetadata/${nftAddress}/${idNFT}/${tokenAddress}`);
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}