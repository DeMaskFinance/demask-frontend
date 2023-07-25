import  axios  from 'axios';
import request from "../utils/httpRequest";

export const swapAPI = async (dmlAddress:string) =>{
    try {
        const res = await request.get(`/dml-chart?address=${dmlAddress}`)
        return res.data;
    } catch (error) {
        console.error(error);
    }
}