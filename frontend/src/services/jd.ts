import api from "./api";

export const getJDList = async (): Promise<API.ResponseGetListJD> => {
  const response = await api.get("/jd/list");
  return response.data;
};

export const analyzeJD = async (file: File): Promise<API.ResponseAnalyze> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<API.ResponseAnalyze>("/jd/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
