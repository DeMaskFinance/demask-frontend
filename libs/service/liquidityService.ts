import request from "../utils/httpRequest";

const liquidityListAPI = async (account:string,page:number) =>{
    try {
        const res = await request.get(`/liquidity-list?userAddress=${account}&&page=${page}`)
        return res.data;
    } catch (error) {
        console.error(error);
    }
}
export {liquidityListAPI}