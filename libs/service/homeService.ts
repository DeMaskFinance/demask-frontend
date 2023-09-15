import  axios  from 'axios';
import request from "../utils/httpRequest";

export const 
home = async (page:number,chainId:string|string[]) =>{
    try {
        const res = await request.get(`/v2/homepage?chainId=${chainId}&page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}