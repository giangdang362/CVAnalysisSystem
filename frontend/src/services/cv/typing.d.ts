// @ts-ignore
/* eslint-disable */

declare namespace API {

  type ResponseGetListCV = {
    message: string;
    data: CvItem[];
    count: number;
  }
  
  type ResponseCvDetail = {
    message: string;
    data: CvItem;
  }

  type CvItem = {
    id?: number;
    name?: string;
    path_file?: string;
    avatar_url?: string;
    expect_salary?: number;
    role?: string;
    experience_summary?: string;
    education?: string;
    recruiter?: string;
    created_at?: string;
    updated_at?: string;
  }
}