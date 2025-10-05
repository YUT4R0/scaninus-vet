from flask import Blueprint, jsonify, request

from app.controllers import AnalyzerController

single_analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/v1/analyze")


@single_analysis_bp.route("/single", methods=["POST"])
def generate_analysis():
    if "image" not in request.files:
        return (
            jsonify({"error": "Nenhuma chave 'image' encontrada no formulário."}),
            400,
        )

    file = request.files["image"]
    analyzer_controller = AnalyzerController()
    return analyzer_controller.generate_single_analysis(file=file)
