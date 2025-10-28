import re
from flask import Blueprint, jsonify, request
from werkzeug.datastructures import FileStorage
from app.controllers import AnalyzerController
from app.utils import logger

analysis_bp = Blueprint("analysis", __name__, url_prefix="/api/v1/analysis")

IMAGE_LABEL_REGEX = re.compile(r"image_(\d+)")


@analysis_bp.route("/single", methods=["POST"])
def generate_single_analysis():
    """
    Single analysis route
    """
    logger.info("=====> CHEGOU AQUI")

    # CORREÇÃO CRÍTICA: Verifica se a chave 'image' existe no MultiDict.
    if "image" not in request.files:
        logger.error("Chave 'image' não encontrada no request.files")
        return (
            jsonify(
                {"error": "Nenhuma chave 'image' encontrada no formulário (POST)."}
            ),
            400,  # Retorna 400 Bad Request, que é o correto para dados inválidos.
        )

    # Acessa o arquivo agora que sabemos que a chave existe
    file = request.files["image"]

    # Validação adicional: Se o arquivo estiver vazio (conteúdo zero ou nome vazio)
    if not file or file.filename == "":
        return (
            jsonify(
                {"error": "Arquivo 'image' está vazio ou nome de arquivo ausente."}
            ),
            400,
        )

    # Chama o Controller
    analyzer_controller = AnalyzerController()
    return analyzer_controller.generate_single_analysis(file=file)


@analysis_bp.route("/comparative", methods=["POST"])
def generate_comparative_analysis():
    """
    Comparative analysis route
    """
    files_dict = request.files

    if not files_dict:
        return jsonify({"error": "Nenhuma imagem encontrada no formulário."}), 400

    labeled_files: list[tuple[FileStorage, int]] = []
    for key, file_storage in files_dict.items():
        match = IMAGE_LABEL_REGEX.match(key)
        if not match:
            return (
                jsonify(
                    {
                        "error": f"Formato de chave de arquivo inválido: Esperado 'image_N', recebido '{key}'"
                    }
                ),
                400,
            )

        label = int(match.group(1))
        labeled_files.append((file_storage, label))

    analyzer_controller = AnalyzerController()
    return analyzer_controller.generate_comparative_analysis(
        labeled_files=labeled_files
    )
