import api from "./api";

export const analyzeCV = async (file: File): Promise<API.ResponseAnalyze> => {
  const formData = new FormData();
  formData.append("cv_file", file);

  const response = await api.post<API.ResponseAnalyze>("/analyze/cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const analyzeJD = async (file: File): Promise<API.ResponseAnalyze> => {
  const formData = new FormData();
  formData.append("jd_file", file);

  const response = await api.post<API.ResponseAnalyze>("/analyze/jd", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
