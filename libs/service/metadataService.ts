import  axios  from 'axios';
import request from "../utils/httpRequest";

export const metadataService = async (nftAddress:string,idNFT:String) =>{
    try {
        const res = await request.get(`/getMetadata/${nftAddress}/${idNFT}`);
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}