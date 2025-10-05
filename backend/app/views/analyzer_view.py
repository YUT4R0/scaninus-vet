from flask import jsonify
import re


class AnalyzerView:
    def __init__(self):
        pass

    def sigle_analysis_output(self, text: str):
        match = re.search(r"\[STATUS=(.*?)\]", text)
        status = "ok"
        if match:
            status = match.group(1)

        if status == "ok":
            data = text.replace("[STATUS=ok]", "")
            body = {
                "success": True,
                "message": "Analise feita com sucesso!",
                "data": data,
            }
            response = jsonify(body), 200
            return response
        elif status == "bad":
            data = text.replace("[STATUS=bad]", "")
            body = {
                "success": True,
                "message": "Houve alguns erros na analise!",
                "data": data,
            }
            response = jsonify(body), 200
            return response
