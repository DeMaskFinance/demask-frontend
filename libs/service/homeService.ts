import  axios  from 'axios';
import request from "../utils/httpRequest";

export const home = async (page:any) =>{
    try {
        const res = await request.get(`/homepage?page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}