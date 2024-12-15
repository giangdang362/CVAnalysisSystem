import api from "@/axios";

export const getJDList = async (): Promise<API.ResponseGetListJD> => {
  const response = await api.get("/jd");
  return response.data;
};