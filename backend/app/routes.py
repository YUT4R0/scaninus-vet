from flask import Blueprint, jsonify, request

from app.controllers import AnalyzerController
from app.utils import logger

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/v1/analysis")


@analysis_bp.route("/single", methods=["POST"])
def generate_analysis():
    logger.info("=====> CHEGOU AQUI")
    if "image" not in request.files:
        return (
            jsonify({"error": "Nenhuma chave 'image' encontrada no formulário."}),
            400,
        )

    file = request.files["image"]
    analyzer_controller = AnalyzerController()
    return analyzer_controller.generate_single_analysis(file=file)
