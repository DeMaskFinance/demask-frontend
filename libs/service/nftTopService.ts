import  axios  from 'axios';
import request from "../utils/httpRequest";

export const NFTTopService = async (page:number) =>{
    try {
        const res = await request.get(`/topNFT-list?page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}