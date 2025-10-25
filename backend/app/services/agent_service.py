from typing import LiteralString
from flask import current_app
from app.config import Config
from google import genai


class AgentService:
    def __init__(self):
        self._api_key = current_app.config.get("GEMINI_API_KEY", Config.GEMINI_API_KEY)
        self._model = "gemini-2.5-flash"
        self._enn = ""
        self.__client = genai.Client(api_key=self._api_key)

    def get_single_analysis(self, data: LiteralString) -> str:
        """
        Instrui o Gemini a extrair variáveis, calcular o ENN e gerar a análise final em JSON.
        """

        # 1. Definição de Regras de Qualidade (Benchmarks Nutricionais Médios)
        # Estes valores dão ao Gemini a base para julgar a qualidade.
        # Fonte: Médias comuns para rações secas de manutenção para cães adultos.
        BENCHMARKS = {
            "PB_ALTA": 28,  # Acima disso, é considerado alto teor proteico/premium
            "PB_BAIXA": 22,  # Abaixo disso, é considerado teor econômico
            "EE_MEDIO": 10,  # Extrato Etéreo (Gordura)
            "MF_BAIXA": 4,  # Matéria Fibrosa
        }

        system_instruction = (
            "Você é o Scaninus, um **sistema de análise nutricional canina**, com um tom de voz direto, objetivo e profissional. "
            "Sua missão é traduzir a análise laboratorial de rótulos de rações caninas (mais especificamente, da parte de 'Níveis de Garantia') em informações de qualidade para o consumo humano, **sem introduções, saudações ou frases de abertura de persona**."
        )

        prompt = f"""
        **TEXTO OCR BRUTO (NÍVEIS DE GARANTIA):**
        ---
        {data}
        ---

        **FORMULA CRÍTICA:** ENN = 100 - (Umidade + Proteína Bruta + Extrato Etéreo + Matéria Fibrosa + Matéria Mineral)

        **INSTRUÇÕES DE ANÁLISE DE QUALIDADE:**
        1.  **Extração e Conversão:** Extraia os 5 valores percentuais (U, PB, EE, MF, MM) e converta vírgulas (,) para ponto (.). Se faltar algum valor, use null.
        2.  **Cálculo:** Calcule o ENN se todos os 5 valores forem encontrados.
        3.  **Avaliação:**
            * **Proteína Bruta (PB):** Se PB for > {BENCHMARKS['PB_ALTA']}%, classifique como "Excelente Teor Proteico". Se for < {BENCHMARKS['PB_BAIXA']}%, mencione que o teor é "Básico/Econômico".
            * **Matéria Fibrosa (MF):** Se MF for > {BENCHMARKS['MF_BAIXA']}%, mencione que é alto, o que pode ser bom para digestão, mas ruim para a densidade energética.
            * **Qualidade Geral:** O ENN representa os carboidratos. Rações de alta qualidade geralmente têm um ENN moderado (em torno de 35% a 45%). Use todos os fatores (PB, EE, ENN) para classificar o produto como **PREMIUM, PADRÃO ou ECONÔMICO**.

        4.  **Geração da Resposta:**

            * **Caso de Sucesso:** A `descricao_analise` deve ser uma **discussão argumentativa** da qualidade da ração, baseada na avaliação acima. Comece a descrição com uma frase de classificação (Ex: "Esta ração se enquadra na categoria PADRÃO").
            * **Caso de Imprecisão/Falha:** A descrição deve ser curta e focar no que faltou.

        **REGRAS DE SAÍDA (Obrigatório retornar o JSON estrito, adicione 'null' se o valor não for encontrado):**
        ```json
        {{
            "enn": "valor_float_ou_null",
            "status": "SUCESSO" | "IMPRECISA" | "FALHA",
            "response_title": "Análise Completa" | "Dados Incompletos",
            "description": "Descrição profissional argumentada da qualidade da ração.",
            "variables": {{
                "U": "valor_float_ou_null",
                "PB": "valor_float_ou_null",
                "EE": "valor_float_ou_null",
                "MF": "valor_float_ou_null",
                "MM": "valor_float_ou_null"
            }},
            "suggestion": "Breve dica prática para o dono do pet." 
        }}
        ```
        """

        response = self.__client.models.generate_content(
            model=self._model, contents=[system_instruction, prompt]
        )

        return response.text

    def get_comparative_analysis(self, ocr_results: list[tuple[int, str]]) -> str:
        """
        Gera a análise comparativa final, extraindo, calculando e comparando as rações.
        """

        system_instruction = (
            "Você é o Scaninus, um **especialista em comparação de nutrição canina**, com um tom de voz direto, objetivo e profissional. "
            "Sua missão é traduzir a análise laboratorial de rótulos de rações caninas (mais especificamente, da parte de 'Níveis de Garantia') em informações de qualidade para o consumo humano, **sem introduções, saudações ou frases de abertura de persona**."
            "Você deve processar os resultados brutos de OCR de múltiplas rações, realizar a extração, calcular o ENN para cada uma e, em seguida, gerar uma análise comparativa e sugestões."
        )

        # 1. Definição de Regras de Qualidade (Benchmarks Nutricionais Médios)
        # Estes valores dão ao Gemini a base para julgar a qualidade.
        # Fonte: Médias comuns para rações secas de manutenção para cães adultos.
        BENCHMARKS = {
            "PB_ALTA": 28,  # Acima disso, é considerado alto teor proteico/premium
            "PB_BAIXA": 22,  # Abaixo disso, é considerado teor econômico
            "EE_MEDIO": 10,  # Extrato Etéreo (Gordura)
            "MF_BAIXA": 4,  # Matéria Fibrosa
        }

        prompt = f"""
        **DADOS DE OCR PARA COMPARAÇÃO:**
        ---
        {ocr_results}
        ---

        **FORMULA CRÍTICA:** ENN = 100 - (Umidade + Proteína Bruta + Extrato Etéreo + Matéria Fibrosa + Matéria Mineral)

        **INSTRUÇÕES DE PROCESSAMENTO E ANÁLISE:**
        1.  **Extração:** Para cada ração em 'ocr_results' (sendo o primeiro item da dupla o 'label' da ração e o segundo o 'raw_text'), extraia os 5 valores percentuais (U, PB, EE, MF, MM) e converta vírgulas (,) para ponto (.). Se faltar algum valor, use null.
        2.  **Cálculo:** Calcule o ENN para cada ração que tiver os 5 valores.
        3.  **Avaliação:**
            * **Proteína Bruta (PB):** Se PB for > {BENCHMARKS['PB_ALTA']}%, classifique como "Excelente Teor Proteico". Se for < {BENCHMARKS['PB_BAIXA']}%, mencione que o teor é "Básico/Econômico".
            * **Matéria Fibrosa (MF):** Se MF for > {BENCHMARKS['MF_BAIXA']}%, mencione que é alto, o que pode ser bom para digestão, mas ruim para a densidade energética.
            * **Qualidade Geral:** O ENN representa os carboidratos. Rações de alta qualidade geralmente têm um ENN moderado (em torno de 35% a 45%). Use todos os fatores (PB, EE, ENN) para classificar o produto como **PREMIUM, PADRÃO ou ECONÔMICO**.
        4.  **Análise Individual (Crucial):** Para cada ração (item no vetor 'details'):
            * Preencha o campo **`quality`** (PREMIUM/PADRÃO/ECONÔMICO).
            * Preencha o campo **`description`** (Discussão dos níveis).
            * **NOVO:** Preencha o campo **`suggestion`** com uma frase concisa de 5 a 10 palavras que resuma o público-alvo ou o benefício principal da ração (Ex: "Foco no ganho de peso para cães muito ativos.").
        
        **REGRAS DE SAÍDA (Obrigatório retornar o JSON estrito):**
        ```json
        {{
            "status": "SUCESSO" | "IMPRECISA" | "FALHA",
            "response_title": "Análise Comparativa de Rações",
            "description": "Breve parágrafo comparando a qualidade geral das rações, indicando o destaque.",
            "details": [
                {{
                    "id": "valor do tipo inteiro relativo a 'label' da ração.",
                    "name": "Ração <label>", 
                    "quality": "PREMIUM" | "PADRÃO" | "ECONÔMICO",
                    "enn": "valor_float_ou_null",
                    "description": "Discussão sobre PB, EE e ENN, e classificação.",
                    "variables": {{"U": 0, "PB": 0, "EE": 0, "MF": 0, "MM": 0}},
                    "suggestion": "Breve frase de sugestão de uso (Ex: 'Ideal para filhotes ativos', 'Boa para controle de peso')."
                }},
                // ... (para Ração 2, Ração 3, ...)
            ],
            "suggestion": "Sugestão sobre qual ração escolher (se aplicável)."
        }}
        ```
        """

        response = self.__client.models.generate_content(
            model=self._model, contents=[system_instruction, prompt]
        )

        return response.text
