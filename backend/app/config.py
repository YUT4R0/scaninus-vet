import os


class Config:
    """
    Api Settings variables instance
    """

    OCR_SPACE_ENDPOINT = os.getenv("OCR_SPACE_ENDPOINT")
    OCR_SPACE_SECURE_ENDPOINT = os.getenv("OCR_SPACE_SECURE_ENDPOINT")
    OCR_SPACE_API_KEY = os.getenv("OCR_SPACE_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
