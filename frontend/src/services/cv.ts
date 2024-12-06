import api from "./api";

export const getCVList = async (): Promise<API.ResponseGetListCV> => {
  const response = await api.get("/cv/list");
  return response.data;
};

export const analyzeCV = async (file: File): Promise<API.ResponseAnalyze> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<API.ResponseAnalyze>("/cv/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
