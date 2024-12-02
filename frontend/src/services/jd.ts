import api from "./api";

export const getJDList = async (): Promise<any[]> => {
  const response = await api.get("/jd/list");
  return response.data;
};

export const syncJDList = async (): Promise<any> => {
  const response = await api.post("/jd/sync");
  return response.data;
};

