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
  const response = await api.post(`/jd/edit/${payload.id}`, payload);
  return response.data;
}