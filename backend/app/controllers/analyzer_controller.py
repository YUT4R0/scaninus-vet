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
        self._ocr_service = OCRService()
        self._agent_service = AgentService()
        self._analyzer_view = AnalyzerView()

    def _extract_variables(self, raw_data):
        # iterate specific json
        pass

    def _validate_data(self, file: FileStorage):
        if file.filename == "":
            return jsonify({"error": "Nenhum arquivo selecionado."}), 400

        if file:
            if not file.mimetype or not file.mimetype.startswith("image"):
                return (
                    jsonify(
                        {"error": "Tipo de arquivo não suportado. Esperado: imagem."}
                    ),
                    400,
                )
            return

        return jsonify({"error": "Erro desconhecido."}), 500

    def generate_single_analysis(self, file: FileStorage):
        self._validate_data(file=file)

        try:
            raw_text_data = self._ocr_service.extract_text(file=file)
            logger.info(f"====> RAW TEXT RETURNED FROM OCR-SERVICE: {raw_text_data}")
            target_variables = self._extract_variables(raw_text_data)
            response_text = self._agent_service.single_analyse(data=target_variables)
            return self._analyzer_view.sigle_analysis_output(text=response_text)
        except Exception as e:
            return jsonify({"error": f"Erro no processamento: {str(e)}"}), 500
