from flask import current_app
from app.config import Config
from google import genai


class AgentService:
    def __init__(self):
        self._api_key = current_app.config.get("GEMINI_API_KEY", Config.GEMINI_API_KEY)
        self._model = "gemini-2.5-flash"
        self._enn = ""
        self.__client = genai.Client(api_key=self._api_key)

    def single_analyse(self, data) -> str:
        prompt = f"""
        Supondo que vc é especialistaa blablabla

        CONTEXTO: {data}

        TIPO DE ANALISE:

        FORMULA: {self._enn}

        REGRAS:
        - nao busque na web
        
        REGRAS DE SAIDA:
        - se nao reconhecer uma das variaveis, retorne (tal formato de mensagem)
        - se nao reonheecer uma das variaveis, retorne (tal formato de mensagem)
        - se der tudo certo, retorne a resposta com [STATUS=ok]
        - se não, retorne a resposta com [STATUS=bad]
        """

        response = self.__client.models.generate_content(
            model=self._model, contents=prompt
        )

        return response.text
