import axios, { ResponseType } from "axios";

const instance = axios.create({
  baseURL:process.env.NEXT_PUBLIC_URL,
  withCredentials:true
});


instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
