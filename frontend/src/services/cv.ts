import api from "@/src/axios";

export const getCVList = async (): Promise<API.ResponseGetListCV> => {
  const response = await api.get("/cv");
  return response.data;
};

export const getCvDetail = async (id: number): Promise<API.ResponseCvDetail> => {
  const response = await api.get(`/cv/${id}`);
  return response.data;
};

