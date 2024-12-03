import api from "./api";

export const getCVList = async (): Promise<API.ResponseGetListCV> => {
  const response = await api.get("/cv/list");
  return response.data;
};
