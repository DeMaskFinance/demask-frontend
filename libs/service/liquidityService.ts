import request from "../utils/httpRequest";

const liquidityListAPI = async (accountUser:string,page:number,chainId:string|string[]) =>{
    try {
        const res = await request.get(`/v2/liquidity-list?chainId=${chainId}&userAddress=${accountUser.toLowerCase()}&page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
const liquidityHistory = async (accountUser:string,dmlToken:string,page:number,chainId:string|string[]) =>{
    try {
        const res = await request.get(`/v2/liquidity-history?chainId=${chainId}&userAddress=${accountUser.toLocaleLowerCase()}&dmlAddress=${dmlToken.toLocaleLowerCase()}&page=${page}`);
        return res.data;
    } catch (error) {
        console.error(error);
    }

}
export {liquidityListAPI,liquidityHistory};