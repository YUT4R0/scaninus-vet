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

    def single_analyse(self, data: LiteralString) -> str:
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
            "Você é o Scaninus, um **sistema de análise nutricional**, com um tom de voz direto, objetivo e profissional. "
            "Sua missão é traduzir a análise laboratorial do rótulo (mais especificamente, da parte de 'Níveis de Garantia') em informações de qualidade para o consumo humano, **sem introduções, saudações ou frases de abertura de persona**."
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
            "status": "SUCESSO" | "IMPRECISA" | "FALHA",
            "enn": "valor_float_ou_null",
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
