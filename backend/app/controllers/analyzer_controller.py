from flask import jsonify
from app.services import AgentService, OCRService
from app.views import AnalyzerView
from app.utils import logger

from werkzeug.datastructures import FileStorage


class AnalyzerController:
    """
    Controller que vai lidar com o gerenciamento dos serviços
    """

    def __init__(self):
        self._analyzer_view = AnalyzerView()

    def _validate_data(self, file: FileStorage):
        if not file:
            return jsonify({"error": "Erro desconhecido ('image' não fornecido)."}), 500
        if file.filename == "":
            return jsonify({"error": "Nenhum arquivo selecionado."}), 400
        if not file.mimetype or not file.mimetype.startswith("image"):
            return (
                jsonify({"error": "Tipo de arquivo não suportado. Esperado: imagem."}),
                400,
            )

    def generate_single_analysis(self, file: FileStorage):
        self._validate_data(file=file)
        ocr_service = OCRService()
        agent_service = AgentService()

        try:
            logger.info(f"====> IMAGEM RECEBIDA: {file.filename}")
            raw_text_data = ocr_service.extract_text(file=file)
            logger.info(f"====> RAW TEXT RETURNED FROM OCR-SERVICE: {raw_text_data}")
            response_text = agent_service.single_analyse(data=raw_text_data)
            logger.info(f"====> RESPONSE FROM MODEL: {response_text}")
            return self._analyzer_view.sigle_analysis_output(response_text)
        except Exception as e:
            return jsonify({"error": f"Erro no processamento: {str(e)}"}), 500
