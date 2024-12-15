// @ts-ignore
/* eslint-disable */

declare namespace API {

  type GetAllCVRes = {
    message?: string;
    data?: CvItem[];
    count?: number;
  }
  type GetAllJDRes = {
    message?: string;
    data?: JdItem[];
    count?: number;
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
    requirement?: number;
    role?: string;
    level?: string;
    technical_skill?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
  }
}