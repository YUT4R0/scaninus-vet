from concurrent.futures import ThreadPoolExecutor, as_completed
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
        self.keywords = [
            "nivéis de garantia",
            "umidade",
            "proteína bruta",
            "proteina bruta",
            "extrato etéreo",
            "extrato etereo",
            "matéria fibrosa",
            "materia fibrosa",
            "matéria mineral",
            "materia mineral",
            "guaranteed analysis",
            "moisture",
            "crude protein",
            "crude fat",
            "crude fiber",
            "ash",
        ]

    def _validate_data(self, file: FileStorage):
        if not file:
            raise ValueError("Erro interno: FileStorage não fornecido.")
        if file.filename == "":
            raise ValueError("Nenhum arquivo selecionado (nome vazio).")
        if not file.mimetype or not file.mimetype.startswith("image"):
            raise ValueError(
                f"Tipo de arquivo não suportado: {file.mimetype}. Esperado: imagem."
            )

    def _is_relevant_text(self, raw_text: str) -> bool:
        """Verifica se o texto contém palavras-chave relevantes para o cálculo do ENN."""
        if not raw_text:
            return False

        normalized_text = raw_text.lower()
        for keyword in self.keywords:
            if keyword in normalized_text:
                return True

        return False

    def generate_single_analysis(self, file: FileStorage):
        """
        single analysis handler method
        """
        try:
            self._validate_data(file=file)
        except ValueError as e:
            return (
                jsonify({"error": f"Erro de validação: {str(e)}"}),
                400,
            )

        logger.info(f"====> IMAGEM RECEBIDA: {file.filename}")

        try:
            ocr_service = OCRService()
            raw_text_data = ocr_service.extract_text(file=file)
            logger.info(f"====> RAW TEXT RETURNED FROM OCR-SERVICE: {raw_text_data}")

            if not self._is_relevant_text(raw_text_data):
                logger.warning(
                    "Texto OCR considerado irrelevante. Retornando falha controlada."
                )
                response_text = {
                    "status": "FALHA",
                    "response_title": "Análise Não Aplicável",
                    "description": "O texto da imagem não contém as informações de Níveis de Garantia (Proteína, Fibra, etc.). Tente focar melhor no rótulo da ração.",
                    "suggestion": "Refaça a foto, cobrindo apenas a tabela nutricional.",
                }
                return self._analyzer_view.sigle_analysis_output(response_text)

            agent_service = AgentService()
            response_text = agent_service.get_single_analysis(data=raw_text_data)
            logger.info(f"====> RESPONSE FROM MODEL: {response_text}")

            return self._analyzer_view.sigle_analysis_output(response_text)
        except Exception as e:
            return jsonify({"error": f"Erro no processamento: {str(e)}"}), 500

    def _process_single_image_worker(
        self, file: FileStorage, ocr_service: OCRService, label: int
    ) -> dict[str]:
        """Função executada em cada thread para processar a imagem."""
        try:
            # A thread precisa de uma nova instância do serviço (ou o serviço deve ser thread-safe)
            file.seek(0)
            raw_text_data = ocr_service.extract_text(file=file)

            return {
                "success": True,
                "filename": file.filename,
                "label": label,
                "raw_text": raw_text_data,
            }
        except Exception as e:
            logger.error(f"Erro no OCR da imagem {file.filename}: {str(e)}")
            return {
                "success": False,
                "filename": file.filename,
                "label": label,
                "error": str(e),
            }

    def generate_comparative_analysis(
        self, labeled_files: list[tuple[FileStorage, int]]
    ):
        """
        single analysis handler method
        """

        try:
            for file, _ in labeled_files:
                self._validate_data(file=file)
        except ValueError as e:
            return (
                jsonify({"error": f"Erro de validação em um dos arquivos: {str(e)}"}),
                400,
            )

        ocr_service = OCRService()
        results: list[dict[str]] = []
        max_workers = min(len(labeled_files), 5)

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Mapeia cada arquivo para a função _process_single_image_worker
            future_to_file = {
                executor.submit(
                    self._process_single_image_worker, file, ocr_service, label
                ): (file, label)
                for file, label in labeled_files
            }

            # Processa os resultados à medida que ficam prontos
            for future in as_completed(future_to_file):
                result = future.result()
                results.append(result)

        filtered_successful_data: list[dict] = []

        for result in results:
            if result["success"]:
                if self._is_relevant_text(result["raw_text"]):
                    filtered_successful_data.append(result)
                else:
                    logger.warning(
                        f"Imagem {result['label']} ignorada por ser irrelevante."
                    )

        if not filtered_successful_data or len(filtered_successful_data) < 2:
            response_text = {
                "status": "FALHA",
                "response_title": "Análise Não Aplicável",
                "description": "O texto das imagens não contém as informações de Níveis de Garantia (Proteína, Fibra, etc.). Pelo menos duas imagens relevantes de rótulo são necessárias para comparação.",
                "suggestion": "Refaça as fotos, focando melhor nos rótulos das rações e cobrindo apenas a tabela nutricional.",
            }
            return self._analyzer_view.comparative_analysis_output(response_text)

        logger.info(f"=====> DADOS EXTRAIDOS COM SUCESSO\n: {filtered_successful_data}")
        raw_tupled_data: list[tuple[int, str]] = sorted(
            [(d["label"], d["raw_text"]) for d in filtered_successful_data],
            key=lambda x: x[0],
        )

        agent_service = AgentService()
        response_json_text = agent_service.get_comparative_analysis(
            ocr_results=raw_tupled_data
        )

        logger.info(f"=====> RESULTADO DO GEMINI\n: {response_json_text}")
        return self._analyzer_view.comparative_analysis_output(
            response_data=response_json_text
        )
