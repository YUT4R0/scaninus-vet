import json
import re
from flask import jsonify

from ..utils import logger


class AnalyzerView:
    def __init__(self):
        self.__json_regex = r"```json\s*(\{.*\})\s*```"

    def sigle_analysis_output(self, response_data: str | dict[str]):
        """Saída de analise simples para outras apis"""
        if isinstance(response_data, dict):
            return jsonify(response_data), 200

        json_text = response_data
        try:
            json_match = re.search(self.__json_regex, json_text, re.DOTALL)
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

    def comparative_analysis_output(self, response_data: str | dict[str]):
        """Saída de analise comparativa para outras apis"""
        if isinstance(response_data, dict):
            return jsonify(response_data), 200

        try:
            json_match = re.search(self.__json_regex, response_data, re.DOTALL)
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
