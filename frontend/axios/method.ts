import { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from ".";

const getApi = async <T>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined
): Promise<AxiosResponse<T, any>> => {
  return await axios.get(url, config);
};

const postApi = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined
): Promise<AxiosResponse<T, any>> => {
  return await axios.post<T>(url, data, config);
};

const deleteApi = async <T>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined
): Promise<AxiosResponse<T, any>> => {
  return await axios.delete(url, config);
};

const patchApi = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined
): Promise<AxiosResponse<T, any>> => {
  return await axios.patch(url, data, config);
};

export { getApi, postApi, deleteApi, patchApi };
