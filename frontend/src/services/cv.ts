import api from "@/axios";

export const getCVList = async (): Promise<API.ResponseGetListCV> => {
  const response = await api.get("/cv");
  return response.data;
};