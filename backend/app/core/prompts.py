def get_cv_jd_comparison_prompt(jd_text: str, cv_text: str) -> str:
    """
    Tạo prompt để so sánh CV với JD
    """
    return f"""
    You are an AI tasked with evaluating a CV against a Job Description (JD).
    JD:
    {jd_text}

    CV:
    {cv_text}

    Compare based on:
    1. Skills (weight: 40%)
    2. Experience (weight: 30%)
    3. Education (weight: 20%)
    4. Certifications (weight: 5%)
    5. Soft skills (weight: 5%)

    Return a JSON with:
    - overall_score: A score from 0-100.
    - details: Explanation for each criterion.
    """
