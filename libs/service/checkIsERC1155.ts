import request from "../utils/httpRequest";

export const checkIsERC1155Service = async (nftAddress:string,chainId:string|string[]) =>{

    try {
        const res = await request.get(`isERC1155?nftAddress=${nftAddress}&chainId=280`);
        return res.data;
    } catch (error) {
        console.error(error);
        
    }
}