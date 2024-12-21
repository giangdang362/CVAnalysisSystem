// @ts-ignore
/* eslint-disable */

declare namespace API {

  type ResponseGetListJD = {
    message: string;
    data: API.JdItem[];
    count: number;
  }

  type ResponseJdDetail = {
    message: string;
    data: API.JdItem;
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
    file?: File
  }

}