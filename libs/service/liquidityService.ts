import request from "../utils/httpRequest";

const liquidityListAPI = async (accountUser:string,page:number) =>{
    try {
        const res = await request.get(`/liquidity-list?userAddress=${accountUser.toLowerCase()}&&page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
export {liquidityListAPI}