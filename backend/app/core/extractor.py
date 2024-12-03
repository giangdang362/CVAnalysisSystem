from tika import parser  # Dùng để trích xuất nội dung từ file PDF
from docx import Document  # Dùng để đọc file Word (.docx)
from pathlib import Path

def extract_text_from_file(file_path: str) -> str:
    """
    Trích xuất nội dung từ file Word, PDF hoặc TXT.
    """
    if file_path.endswith(".txt"):
        return extract_text_from_txt(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_word(file_path)
    elif file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    else:
        raise ValueError("Unsupported file format. Only .txt, .docx, and .pdf are allowed.")

def extract_text_from_pdf(file_path: str) -> str:
    """
    Trích xuất văn bản từ file PDF.
    """
    parsed = parser.from_file(file_path)
    return parsed["content"].strip() if parsed["content"] else ""

def extract_text_from_word(file_path: str) -> str:
    """
    Trích xuất văn bản từ file Word (.docx).
    """
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text_from_txt(file_path: str) -> str:
    """
    Trích xuất văn bản từ file TXT.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read().strip()

from docx import Document

def read_word_file(file_path: str) -> str:
    """
    Đọc nội dung từ file Word (.docx) và trả về chuỗi text.
    """
    try:
        doc = Document(file_path)
        content = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        return content
    except Exception as e:
        raise RuntimeError(f"Failed to read Word file {file_path}: {str(e)}")
