import api from "@/src/axios";

export const getMatchingCvToJds = async (id: number): Promise<API.ResponseMatchingCvToJds> => {
  const response = await api.post(`/matching/cv-to-jds?cv_id=${id}`);
  return response.data;
};

export const getMatchingJdToCvs = async (id: number): Promise<API.ResponseMatchingCvToJds> => {
  const response = await api.post(`/matching/jd-to-cvs?jd_id=${id}`);
  return response.data;
};

