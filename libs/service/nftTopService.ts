import  axios  from 'axios';
import request from "../utils/httpRequest";

export const NFTTopService = async (page:number,chainId:string|string[]) =>{
    try {
        const res = await request.get(`topNFT-list?chainId=${chainId}&page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}