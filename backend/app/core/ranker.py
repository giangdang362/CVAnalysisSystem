from app.core.prompts import get_cv_jd_comparison_prompt
from app.core.ai_client import analyze_with_gpt

def rank_jds_with_cv(cv_text: str, jd_texts: list) -> list:
    """
    So sánh CV với danh sách JD, trả về danh sách JD được xếp hạng
    """
    ranked_results = []

    for jd_text in jd_texts:
        # Tạo prompt cho từng JD
        prompt = get_cv_jd_comparison_prompt(jd_text, cv_text)

        # Gửi prompt đến GPT/Gemini
        response = analyze_with_gpt(prompt)

        # Giả định API trả về kết quả dạng JSON
        score = response.get("overall_score", 0)
        details = response.get("details", "")

        ranked_results.append({
            "jd": jd_text,
            "score": score,
            "details": details,
        })

    # Xếp hạng danh sách JD theo điểm giảm dần
    return sorted(ranked_results, key=lambda x: x["score"], reverse=True)
