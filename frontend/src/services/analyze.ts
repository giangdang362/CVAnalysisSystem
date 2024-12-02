import api from "./api";

export const analyzeCV = async (cvFile: File): Promise<any> => {
  const formData = new FormData();
  formData.append("cv_file", cvFile);

  const response = await api.post("/analyze/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
