import api from "@/src/services/axios";

export const getCVList = async (): Promise<API.ResponseGetListCV> => {
  const response = await api.get("/cv");
  return response.data;
};

export const getCvDetail = async (id: number): Promise<API.ResponseCvDetail> => {
  const response = await api.get(`/cv/${id}`);
  return response.data;
};

export const postNewCv = async (payload: API.CvItem) => {
  const response = await api.post("/cv/create", payload);
  return response.data;
}

export const putCv = async (payload: API.CvItem) => {
  const { id, ...data } = payload;
  const response = await api.put(`/cv/${id}`, data);
  return response.data;
}

export const deleteCv = async (id: number) => {
  const response = await api.delete(`/cv/${id}`);
  return response.data;
}
