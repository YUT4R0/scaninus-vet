from werkzeug.datastructures import FileStorage
from flask import current_app
from app.config import Config
import requests


class OCRService:
    """
    Serviço de OCR genérico
    """

    def __init__(self):
        self._url = current_app.config.get(
            "OCR_SPACE_ENDPOINT", Config.OCR_SPACE_ENDPOINT
        )
        self._api_key = current_app.config.get(
            "OCR_SPACE_API_KEY", Config.OCR_SPACE_API_KEY
        )

    def extract_text(self, file: FileStorage):
        payload = {
            "apikey": self._api_key,
            "language": "por",  # Português
            "isOverlayRequired": "true",  # Para obter metadados de posição do texto (útil, mas opcional)
            "isTable": "true",  # Sugere otimização para detecção de tabelas
        }

        try:
            # Lê o conteúdo binário do arquivo em memória
            image_bytes = file.read()
            files = {"file": (file.name, image_bytes, file.mimetype)}

            response = requests.post(
                url=self._url, data=payload, files=files, timeout=60
            )
            response.raise_for_status()

            data = response.json()

            # --- Análise e Retorno do Texto ---

            # Verifica se o resultado foi um sucesso (Status Code 200)
            if data["OCRExitCode"] == 1 and data["IsErroredOnProcessing"] is False:
                # Concatena todo o texto detectado dos diferentes 'ParsedResults'
                extracted_text = ""
                for result in data["ParsedResults"]:
                    extracted_text += result["ParsedText"] + "\n"

                return extracted_text.strip()

            # Trata erros específicos retornados pela API (como imagem ilegível)
            else:
                error_message = data.get("ErrorMessage") or data.get(
                    "OCRExitCode", "Erro desconhecido na OCR.space"
                )
                raise Exception(f"OCR.space falhou na análise: {error_message}")

        except requests.exceptions.RequestException as e:
            raise Exception(f"Erro de conexão ao serviço OCR: {e}")
        except Exception as e:
            raise e
