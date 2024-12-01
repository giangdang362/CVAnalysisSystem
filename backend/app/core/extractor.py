from tika import parser
from docx import Document

def extract_text_from_file(file_path: str) -> str:
    """
    Trích xuất nội dung từ file Word hoặc Text
    """
    if file_path.endswith(".txt"):
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
    elif file_path.endswith(".docx"):
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format. Only .txt and .docx are allowed.")
    
def extract_text_from_pdf(file_path: str) -> str:
    """
    Trích xuất văn bản từ file PDF
    """
    parsed = parser.from_file(file_path)
    return parsed["content"] if parsed["content"] else ""

def extract_text_from_word(file_path: str) -> str:
    """
    Trích xuất văn bản từ file Word (.docx)
    """
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])