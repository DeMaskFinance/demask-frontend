import  axios  from 'axios';
import request from "../utils/httpRequest";

export const metadataService = async (nftAddress:string,idNFT:string,chainId:string|string[]) =>{
    try {
        const res = await request.get(`getMetadata/${nftAddress}/${idNFT}?chainId=${chainId}`);
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}