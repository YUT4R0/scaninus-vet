import json
import re
from flask import jsonify

from ..utils import logger


class AnalyzerView:
    def __init__(self):
        pass

    def sigle_analysis_output(self, text: str):
        try:
            json_match = re.search(r"```json\s*(\{.*\})\s*```", text, re.DOTALL)
            if not json_match:
                # Se não encontrar o bloco JSON, algo deu errado
                raise ValueError("LLM não retornou o JSON no formato esperado.")
            json_string_clean = json_match.group(1).strip()
            response_data_dict = json.loads(json_string_clean)
            logger.info(f"====> SANITIZED INFO: {response_data_dict}")
            return jsonify(response_data_dict), 200
        except json.JSONDecodeError:
            logger.error("Erro ao fazer parse do JSON retornado pelo modelo.")
            return (
                jsonify({"error": "Erro interno: Formato de resposta da IA inválido."}),
                500,
            )
