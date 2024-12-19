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

  type ResponseGetListCV = {
    message: string;
    data: CvItem[];
    count: number;
  }
  type ResponseGetListJD = {
    message: string;
    data: JdItem[];
    count: number;
  }

  type ResponseCvDetail = {
    message: string;
    data: CvItem;
  }

  type ResponseJdDetail = {
    message: string;
    data: JdItem;
  }

  type ResponseMatchingCvAndJd = {
    message: string;
    data: JdItem[];
    ids: number[];
    count: number;
  }

  type CvItem = {
    id?: number;
    name?: string;
    path_file?: string;
    applicant_name?: string;
    expect_salary?: number;
    role?: string;
    experience_summary?: string;
    education?: string;
    recruiter?: string;
    created_at?: string;
    updated_at?: string;
  }
  type JdItem = {
    id?: number;
    name?: string;
    company_name?: string;
    path_file?: string;
    languages?: string;
    requirement?: string;
    role?: string;
    level?: string;
    technical_skill?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    overall_score?: number;
  }
}