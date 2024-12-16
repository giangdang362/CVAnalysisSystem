import api from "@/src/axios";

export const getJDList = async (): Promise<API.ResponseGetListJD> => {
  const response = await api.get("/jd");
  return response.data;
};

export const getJdDetail = async (id: number): Promise<API.ResponseJdDetail> => {
  const response = await api.get(`/jd/${id}`);
  return response.data;
};