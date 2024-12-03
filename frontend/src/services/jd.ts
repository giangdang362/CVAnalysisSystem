import api from "./api";

export const getJDList = async (): Promise<API.ResponseGetListJD> => {
  const response = await api.get("/jd/list");
  return response.data;
};
