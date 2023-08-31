import  axios  from 'axios';
import request from "../utils/httpRequest";

export const swapAPI = async (dmlAddress:string,chainId:string|string[]) =>{
    try {
        const res = await request.get(`/v2/dml-chart?chainId=${chainId}&address=${dmlAddress}`)
        return res.data;
    } catch (error) {
        console.error(error);
    }
}