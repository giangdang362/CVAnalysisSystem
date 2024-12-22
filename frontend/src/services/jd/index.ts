import api from "@/src/services/axios";

export const getJDList = async (): Promise<API.ResponseGetListJD> => {
  const response = await api.get("/jd");
  return response.data;
};

export const getJdDetail = async (id: number): Promise<API.ResponseJdDetail> => {
  const response = await api.get(`/jd/${id}`);
  return response.data;
};

export const postNewJd = async (payload: API.JdItem) => {
  const response = await api.post("/jd/create", payload);
  return response.data;
};

export const putJd = async (payload: API.JdItem) => {
  const { id, ...data } = payload;
  const response = await api.put(`/jd/${id}`, data);
  return response.data;
}

export const deleteJd = async (id: number) => {
  const response = await api.delete(`/jd/${id}`);
  return response.data;
}