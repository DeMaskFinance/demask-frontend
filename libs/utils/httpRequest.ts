import store from "@/store";
import axios from "axios";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
request.interceptors.request.use(
  (config) => {
    const { isLoggedIn, accessToken } = store.getState().profile;
    if (isLoggedIn) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default request;
