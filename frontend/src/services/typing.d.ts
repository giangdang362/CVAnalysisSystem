declare namespace API {

  type RankedItem = {
    name: string; // Tên CV hoặc JD
    score: number; // Điểm số (0-100)
    details: string; // Chi tiết đánh giá
  };

  // Response trả về từ API Analyze
  type ResponseAnalyze = {
    message: string;
    data: RankedItem[];
    count: number;
  };

  type ResponseGetListCV = {
    message: string;
    data: {
      cv_name?: string;
      file_path?: string;
      content?: string;
    }[];
    count: number;
  }
  type ResponseGetListJD = {
    message: string;
    data: {
      jd_name?: string;
      file_path?: string;
      content?: string;
    }[];
    count: number;
  }
}
