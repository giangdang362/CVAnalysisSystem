import api from "@/src/services/axios";

type PayloadGetAnalyze = {
  cv_id: number;
  jd_ids: number[];
}

export const getMatchingCvToJds = async (id: number): Promise<API.ResponseMatchingCvAndJd> => {
  const response = await api.post(`/matching/cv-to-jds?cv_id=${id}`);
  return response.data;
};

export const getMatchingJdToCvs = async (id: number): Promise<API.ResponseMatchingCvAndJd> => {
  const response = await api.post(`/matching/jd-to-cvs?jd_id=${id}`);
  return response.data;
};

export const getAnalyzeResult = async (payload: PayloadGetAnalyze): Promise<API.ResponseResultAnalyze> => {
  const response = await api.post(`/matching/cv-to-jds/rank`, payload);
  return response.data;
};