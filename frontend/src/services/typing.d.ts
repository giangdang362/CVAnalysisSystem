// @ts-ignore
/* eslint-disable */

declare namespace API {

  type ResponseResultAnalyze = {
    data: ResultAnalyzeItem[];
    message?: string;
    count?: number;
  }

  type ResultAnalyzeItem = {
    name?: string;
    overall_score?: number;
    tech_stack?: number;
    experience?: number;
    language?: number;
    leadership?: number;
  }

  type ResponseMatchingCvAndJds = {
    message: string;
    data: API.JdItem[];
    ids: number[];
    count: number;
  }

  type ResponseMatchingJdAndCvs = {
    message: string;
    data: API.CvItem[];
    ids: number[];
    count: number;
  }

  type ResListRole = {
    message: string;
    data: string[];
    count: number;
  }
  
}