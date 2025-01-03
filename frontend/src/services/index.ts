import api from "@/src/services/axios";

type PayloadGetAnalyzeCvToJds = {
  cv_id: number;
  jd_ids: number[];
}

type PayloadGetAnalyzeJdToCvs = {
  jd_id: number;
  cv_ids: number[];
}

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/upload/${path}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.s3_path;
};

export const getRoles = async (): Promise<API.ResListRole> => {
  const response = await api.get(`/roles`);
  return response.data;
}

export const getMatchingCvToJds = async (id: number): Promise<API.ResponseMatchingCvAndJds> => {
  const response = await api.post(`/matching/cv-to-jds?cv_id=${id}`);
  return response.data;
};

export const getMatchingJdToCvs = async (id: number): Promise<API.ResponseMatchingCvAndJds> => {
  const response = await api.post(`/matching/jd-to-cvs?jd_id=${id}`);
  return response.data;
};

export const getAnalyzeResultCvToJds = async (payload: PayloadGetAnalyzeCvToJds): Promise<API.ResponseResultAnalyze> => {
  const response = await api.post(`/matching/cv-to-jds/rank`, payload);
  return response.data;
};

export const getAnalyzeResultJdToCvs = async (payload: PayloadGetAnalyzeJdToCvs): Promise<API.ResponseResultAnalyze> => {
  const response = await api.post(`/matching/jd-to-cvs/rank`, payload);
  return response.data;
};