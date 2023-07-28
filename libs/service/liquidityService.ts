import request from "../utils/httpRequest";

const liquidityListAPI = async (accountUser:string,page:number) =>{
    try {
        const res = await request.get(`/liquidity-list?userAddress=${accountUser.toLowerCase()}&&page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
const liquidityHistory = async (accountUser:string,dmlToken:string,page:number) =>{
    try {
        const res = await request.get(`/liquidity-history?userAddress=${accountUser.toLocaleLowerCase()}&dmlAddress=${dmlToken.toLocaleLowerCase()}&page=${page}`);
        return res.data;
    } catch (error) {
        console.error(error);
    }

}
export {liquidityListAPI,liquidityHistory};