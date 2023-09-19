import axios from "axios";

const request=axios.create({
    baseURL:'https://api.demask.finance',
});
export default request;