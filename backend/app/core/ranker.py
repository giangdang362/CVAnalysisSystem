from app.core.prompts import generate_prompt_for_cv_to_jd, generate_prompt_for_jd_to_cv
from app.core.ai_client import analyze_with_gemini

def rank_jds_with_cv(file_name: str, cv_text: str, jd_texts: list) -> list:
    """
    So sánh CV với danh sách JD, trả về danh sách JD được xếp hạng.
    """
    ranked_results = []

    for jd_text in jd_texts:
        # Tạo prompt cho từng JD
        prompt = generate_prompt_for_cv_to_jd()

        # Gửi prompt đến Gemini và nhận phản hồi
        response = analyze_with_gemini(prompt)

        # Giả định API trả về kết quả dạng JSON với các trường: overall_score, details
        score = response.get("overall_score", 0)  # Lấy điểm đánh giá
        details = response.get("details", "")  # Lấy chi tiết

        # Thêm kết quả vào danh sách
        ranked_results.append({
            "file_name": file_name,
            "jd": jd_text,  # JD tương ứng
            "score": score,  # Điểm đánh giá
            "details": details,  # Chi tiết phân tích
        })

    # Xếp hạng danh sách JD theo điểm giảm dần
    return sorted(ranked_results, key=lambda x: x["score"], reverse=True)


def rank_cvs_with_jd(file_name: str, jd_text: str, cv_texts: list) -> list:
    """
    So sánh JD với danh sách CV, trả về danh sách CV được xếp hạng.
    """
    ranked_results = []

    for cv_text in cv_texts:
        # Tạo prompt cho từng CV
        prompt = generate_prompt_for_jd_to_cv()

        # Gửi prompt đến Gemini và nhận phản hồi
        response = analyze_with_gemini(prompt)

        # Giả định API trả về kết quả dạng JSON với các trường: overall_score, details
        score = response.get("overall_score", 0)  # Lấy điểm đánh giá
        details = response.get("details", "")  # Lấy chi tiết

        # Thêm kết quả vào danh sách
        ranked_results.append({
            "file_name": file_name,
            "cv": cv_text,  # CV tương ứng
            "score": score,  # Điểm đánh giá
            "details": details,  # Chi tiết phân tích 
        })

    # Xếp hạng danh sách CV theo điểm giảm dần
    return sorted(ranked_results, key=lambda x: x["score"], reverse=True)
