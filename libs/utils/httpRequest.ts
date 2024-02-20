import store from "@/store";
import { logout } from "@/store/profileSlice";
import axios from "axios";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
const onError = (error: any) => {
  const { response } = error;
  if (response) {
    const { data, status } = response;
    if (status === 404) {
      return Promise.reject(response);
    }
    if (status === 401) {
      store.dispatch(logout());
    } else {
      const msg = data.errors?.message || data.message;
      console.log(`${status} - ${msg}`);
    }
  } else {
    console.log(`Cannot connect to Server. ${error.code}`);
  }
  return Promise.reject(response);
};
request.interceptors.request.use(
  (config) => {
    const { isLoggedIn, accessToken } = store.getState().profile;
    if (isLoggedIn) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (config.data instanceof FormData) {
      Object.assign(config.headers, { "Content-Type": "multipart/form-data" });
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// request.interceptors.response.use(({ data }) => {
//   const { success = true, errors } = data;
//   if (success) return data;
//   return Promise.reject(new Error(errors));
// }, onError);
// Add a response interceptor
// request.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response.status === 401) {
//       store.dispatch(logout());
//     }else {
//       console.error("FAILED RESPONSE!");
//     }
//     if(error.response.status === 404){
//       return Promise.reject(error);
//     }
//     return Promise.reject(error);
//   }
// );

export default request;
