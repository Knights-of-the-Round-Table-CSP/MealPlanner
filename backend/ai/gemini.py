import google.generativeai as genai
import os
from .base.ai_api_base import *
from dotenv import load_dotenv

load_dotenv()

class GeminiAPI(AI_API_Client):
    def __init__(self):
        api_key = os.getenv("API_KEY")  # Use the variable name defined in .env
        genai.configure(api_key=api_key)

    def fetch_data(self, endpoint, params):
        """Fetch data from the API."""
        pass

    def process_data(self, data):
        """Process the API data."""
        pass

    def send_prompt(self, message):
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(message)
        return str(response.text)